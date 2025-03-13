import xlsx from 'xlsx';
import { Article } from "../models/article.model.js";

// Get all articles
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ active: true });
    res.status(200).json({ data: articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single article by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById({ _id: req.params.id, active: true });
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new article
export const createArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an article by ID
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an article by ID
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const uploadArticles = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the  Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheet = workbook.Sheets[sheetName];
    let data = xlsx.utils.sheet_to_json(sheet);

    // Convert headers to lowercase and map Excel data to Article schema
    const articles = data.map((row) => {
      const transformedRow = {};
      Object.keys(row).forEach((key) => {
        transformedRow[key.toLowerCase()] = String(row[key]); // Convert headers to lowercase & values to strings
      });

      return {
        art_id: transformedRow['art_id'] || '',
        art_designation: transformedRow['art_designation'] || '',
        art_unite_vente: transformedRow['art_unite_vente'] || '',
        art_suivi_stock: transformedRow['art_suivi_stock'] || '',
        art_code_famille: transformedRow['art_code_famille'] || '',
        art_famille: transformedRow['art_famille'] || '',
        art_cat_niv_1: transformedRow['art_cat_niv_1'] || '',
        art_cat_niv_2: transformedRow['art_cat_niv_2'] || '',
        art_marque: transformedRow['art_marque'] || '',
        art_st: transformedRow['art_st'] || '',
        art_tb: transformedRow['art_tb'] || '',
      };
    });

    // Save articles to the database
    await Article.insertMany(articles);

    // Remove the uploaded file after processing
    // fs.unlinkSync(req.file.path);

    res.status(201).json({ message: 'Articles uploaded successfully', data: articles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading articles', error: error.message });
  }
};
