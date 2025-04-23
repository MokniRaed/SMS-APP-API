import xlsx from "xlsx";
import { generateRandomID } from "../config/utils.js";
import { Collaborator } from "../models/collaborator.model.js";

// Get client contact statistics
export const getCollaboratorStats = async (req, res) => {
  try {
    const totals = await Collaborator.countDocuments();

    res.json({
      totals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCollaborator = async (req, res) => {
  try {
    const updatedCollaborator = await Collaborator.findByIdAndUpdate(
      req.params.collabId,
      { $set: req.body }, // Update only the provided fields
      { new: true, runValidators: true } // Return the updated client and validate input
    );

    if (!updatedCollaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    res.json(updatedCollaborator);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCollaborator = async (req, res) => {
  try {
    const { collabId } = req.params;

    const deletedCollaborator = await Collaborator.findByIdAndDelete(collabId);
    if (!deletedCollaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    res.status(200).json({ message: "Collaborator deleted successfully" });
  } catch (error) {
    console.error(error);

    res.status(400).json({ message: error.message });
  }
};

// ******** Controller Code for Collaborator ********* //

// Create a new contact for a client
export const addCollaborator = async (req, res) => {
  try {

    const collaborator = new Collaborator(req.body);
    const collaboratorId = generateRandomID('CLB', 4);
    collaborator.id_collab = collaboratorId
    const newCollaborator = await collaborator.save();
    res.status(201).json({ data: newCollaborator });
  } catch (error) {
    res.status(400).json({ message: error.message, status: 400 });
  }
};

// Get all contacts for a specific client
export const getCollaborators = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const collaborators = await Collaborator.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)


    // get total documents in the Posts collection
    const count = await Collaborator.countDocuments();

    // return response with posts, total pages, and current page
    res.json({
      total: count,
      limit: limit,
      page: page,
      data: collaborators,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a specific contact by ID
export const getCollaboratorById = async (req, res) => {
  try {
    const collaborateur = await Collaborator.findById(req.params.collabId);
    if (!collaborateur) {
      return res.status(404).json({ message: "Collaborator not found" });
    }
    res.json({ data: collaborateur });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Excel file and save client contacts
export const uploadCollaborators = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const contacts = [];

    for (const row of data) {
      try {
        const collaboratorId = generateRandomID("CLB", 4);

        const newContact = {
          id_collab: collaboratorId,
          firstName: row["firstName"],
          lastName: row["lastName"],
          adresse_email: row["email"],
          numero_mobile: row["mobile"],
          fontion: row["fontion"],
          service: row["service"],
          is_user: row["user"] === true || row["is_user"] === true,
        };

        contacts.push(newContact);
      } catch (innerErr) {
        console.error("Error mapping contact row:", row, innerErr);
      }
    }

    const savedCollaborators = await Collaborator.insertMany(contacts, {
      ordered: false, // Continue inserting even if some fail
    });

    // Process user creation for those marked as users
    for (const contact of savedCollaborators) {
      if (contact.is_user) {
        try {
          const clientRole = await Role.findOne({ name: "collaborator" });
          if (!clientRole) {
            console.warn(
              'Collaborator role not found. Please ensure "collaborator" role exists.'
            );
            continue;
          }

          const username = `${contact.firstName}.${contact.lastName}`.toLowerCase();
          const password = "defaultPassword"; // Replace with secure password generator

          const newUser = new User({
            username: username,
            email: contact.adresse_email,
            password: password,
            role: clientRole._id,
            clientId: null, // Update if clientId is needed
          });

          await newUser.save();
          console.log(`User created for email: ${contact.adresse_email}`);
        } catch (userErr) {
          console.error(`Error creating user for ${contact.adresse_email}`, userErr);
        }
      }
    }

    console.log("savedCollaborators", savedCollaborators);


    res.status(201).json({
      message: "Collaborators uploaded successfully",
      contacts: savedCollaborators,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({
      message: "Error uploading collaborators",
      error: error.message,
    });
  }
};

export const exportCollaborators = async (req, res) => {
  try {
    console.log("Fetching contact clients...");

    // Fetch contact clients and populate related fields (Fonction)
    const contactCollaborators = await Collaborator.find({})
      .populate('fonction_contact', 'nom_fonction_contact') // Populate fonction_contact
      .select('id_client nom_prenom_contact fonction_contact numero_fix numero_mobile adresse_email compte_facebook compte_instagram compte_linkedin compte_whatsapp compte_whatsapp_num canal_interet is_user -_id');

    console.log("contactCollaborators", contactCollaborators);

    if (contactCollaborators.length === 0) {
      return res.status(404).json({ message: "No contact clients found" });
    }

    // Convert contact clients to an array of objects for Excel export
    const data = contactCollaborators.map(client => ({
      clientId: client.id_client,
      name: client.nom_prenom_contact || 'N/A',
      function: client.fonction_contact ? client.fonction_contact.nom_fonction_contact : 'N/A',
      phoneNumber: client.numero_fix || 'N/A',
      mobileNumber: client.numero_mobile || 'N/A',
      email: client.adresse_email || 'N/A',
      facebook: client.compte_facebook || 'N/A',
      instagram: client.compte_instagram || 'N/A',
      linkedin: client.compte_linkedin || 'N/A',
      whatsapp: client.compte_whatsapp || 'N/A',
      whatsappNumber: client.compte_whatsapp_num || 'N/A',
      interestChannel: client.canal_interet || 'N/A',
      isUser: client.is_user ? 'Yes' : 'No'
    }));

    console.log("Creating Excel file...");
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Collaborators");

    // Generate a safe filename based on the current date
    const formattedDate = new Date().toISOString().replace(/[-:.]/g, "_"); // Safe filename format (YYYY_MM_DD_HH_mm_SS)
    const filename = `contact_clients_${formattedDate}.xlsx`;

    // Write the file to a buffer (in memory)
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Set headers to indicate the file type and attachment
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the buffer directly
    res.send(buffer);

    console.log("File sent successfully!");

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error exporting contact clients', error: error.message });
  }
};


// // ******** Controller Code for function ********* //

// // Create a new function contact
// export const createFonction = async (req, res) => {
//   try {
//     const fonction = new Fonction(req.body);
//     const newFonction = await fonction.save();
//     res.status(201).json({ data: newFonction });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get all function contacts
// export const getAllFonctions = async (req, res) => {
//   try {
//     const fonctions = await Fonction.find();
//     res.json({ data: fonctions });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a specific function contact by ID
// export const getFonctionById = async (req, res) => {
//   try {
//     const fonction = await Fonction.findById(req.params.id);
//     if (!fonction) {
//       return res.status(404).json({ message: "Function contact not found" });
//     }
//     res.json(fonction);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a function contact by ID
// export const updateFonction = async (req, res) => {
//   try {
//     const updatedFonction = await Fonction.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body }, // Update only the provided fields
//       { new: true, runValidators: true } // Return the updated document and validate input
//     );

//     if (!updatedFonction) {
//       return res.status(404).json({ message: "Function contact not found" });
//     }

//     res.json({ data: updatedFonction });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a function contact by ID
// export const deleteFonction = async (req, res) => {
//   try {
//     const deletedFonction = await Fonction.findByIdAndDelete(
//       req.params.id
//     );
//     if (!deletedFonction) {
//       return res.status(404).json({ message: "Function contact not found" });
//     }

//     res.status(200).json({ message: "Function contact deleted successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
