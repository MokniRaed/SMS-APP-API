import xlsx from 'xlsx';
import { Category } from '../models/category.model.js';

export const uploadCategories = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { type } = req.query;
        if (!type) return res.status(400).json({ message: "Type parameter is required" });

        const allowedTypes = ["cat_stat", "cat_nv_1", "cat_nv_2", "st", "marque"];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid category type" });
        }

        console.log("Reading file...");
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        const bulkOperations = data.map((row) => ({
            updateOne: {
                filter: { cat_id: row['id'] }, // Check if the category exists by ID
                update: { $set: { name: row['name'], label: row['name'], type: type } }, // Update fields
                upsert: true // Insert if not exists
            }
        }));

        console.log("Inserting/Updating data...");
        await Category.bulkWrite(bulkOperations);

        res.status(201).json({ message: "Categories imported successfully", count: data.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading categories', error: error.message });
    }
};

export const exportCategories = async (req, res) => {
    try {
        const { type } = req.query;
        if (!type) return res.status(400).json({ message: "Type parameter is required" });

        const allowedTypes = ["cat_stat", "cat_nv_1", "cat_nv_2", "st", "marque"];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid category type" });
        }

        console.log("Fetching categories...");
        const categories = await Category.find({ type }).select('cat_id name label type -_id');

        if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found for this type" });
        }

        // Convert categories to an array of objects for Excel
        const data = categories.map(cat => ({
            id: cat.cat_id,
            name: cat.name,
            label: cat.label,
            type: cat.type
        }));

        console.log("Creating Excel file...");
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Categories");

        // Define file path
        const filePath = path.join(__dirname, `categories_${type}.xlsx`);
        xlsx.writeFile(workbook, filePath);

        console.log("Sending file...");
        res.download(filePath, `categories_${type}.xlsx`, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ message: "Error exporting categories" });
            }
            // Delete file after sending
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error exporting categories', error: error.message });
    }
};



export const createCategory = async (req, res) => {
    try {
        const { type } = req.query;
        if (!type) return res.status(400).json({ message: "Type parameter is required" });

        const allowedTypes = ["cat_stat", "cat_nv_1", "cat_nv_2", "st", "marque"];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid category type" });
        }

        // Find the latest `cat_id` for the given type
        const lastCategory = await Category.findOne({ type })
            .sort({ cat_id: -1 }) // Sort descending to get the highest one
            .collation({ locale: "en", numericOrdering: true }); // Ensure proper number sorting

        console.log("lastCategory", lastCategory);

        let newIdNumber = 1; // Default if no previous category exists
        let prefix = `${type.toUpperCase()}_`; // Default prefix
        console.log("prefix", prefix);

        if (lastCategory) {
            const lastCatId = lastCategory.cat_id; // Example: CAT_STAT_ID_005
            const match = lastCatId.match(/(.*?)(\d+)$/); // Extract prefix and number

            if (match) {
                prefix = match[1]; // Keep the prefix as it is
                newIdNumber = parseInt(match[2], 10) + 1; // Increment the number
            }
        }

        // Generate new `cat_id` with zero padding
        const newCatId = `${prefix}${newIdNumber.toString().padStart(3, "0")}`;
        console.log("newCatId", newCatId);

        // Create and save the new category
        const category = new Category({
            ...req.body,
            cat_id: newCatId,
            type
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Get All Categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ✅ Get categories by type
export const getCategoriesByType = async (req, res) => {
    try {
        const { type } = req.params; // Get type from request params
        const { page = 1, limit = 10, searchTerm = '' } = req.query;

        const validTypes = ['cat_stat', 'cat_nv_1', 'cat_nv_2', 'st', 'marque'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid category type" });
        }

        const skip = (page - 1) * limit;

        const searchQuery = searchTerm
            ? {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { label: { $regex: searchTerm, $options: 'i' } },
                ],
            }
            : {};

        const categories = await Category.find({
            type,
            ...searchQuery,
        })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Category.countDocuments({ type, ...searchQuery });

        res.status(200).json({
            message: `Categories of type ${type} retrieved successfully`,
            count: categories.length,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            searchTerm,
            data: categories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};


// ✅ Get a Category by ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({ id: req.params.id });
        if (!category) return res.status(404).json({ message: "Category not found" });

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update a Category
export const updateCategory = async (req, res) => {
    try {
        console.log("id", req.params.id);
        console.log("body", req.body);

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            // { new: true }
        );

        if (!updatedCategory) return res.status(404).json({ message: "Category not found" });

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Delete a Category
export const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) return res.status(404).json({ message: "Category not found" });

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
