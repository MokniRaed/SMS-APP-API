import xlsx from "xlsx";
import {
  ContactClient,
  EquipementClient,
  FonctionContact,
  InformationLibre,
  TypeInfoLibre,
} from "../models/client.model.js";

// export const getAllClients = async (req, res) => {
//   try {
//     const clients = await Client.find();
//     res.json(clients);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getClientDetails = async (req, res) => {
//   try {
//     const client = await Client.findById(req.params.id);
//     if (!client) {
//       return res.status(404).json({ message: 'Client not found' });
//     }

//     const contacts = await ContactClient.find({ Id_Client: client._id });
//     const equipements = await EquipementClient.find({ Id_Client: client._id });
//     const informations = await InformationLibre.find({ Id_Client: client._id });

//     res.json({
//       client,
//       contacts,
//       equipements,
//       informations
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createClient = async (req, res) => {
//   const client = new Client(req.body);
//   try {
//     const newClient = await client.save();
//     res.status(201).json(newClient);
//   } catch (error) {
//     console.log("error", error);

//     res.status(400).json({ message: error.message });
//   }
// };

// export const addClientContact = async (req, res) => {
//   try {
//     const contact = new ContactClient({
//       ...req.body,
//       Id_Client: req.params.id
//     });
//     const newContact = await contact.save();
//     res.status(201).json(newContact);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const addClientEquipement = async (req, res) => {
  try {
    const equipement = new EquipementClient({
      ...req.body,
      Id_Client: req.params.id,
    });
    const newEquipement = await equipement.save();
    res.status(201).json(newEquipement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get client contact statistics
export const getClientContactStats = async (req, res) => {
  try {
    const totalContacts = await ContactClient.countDocuments();

    res.json({
      totalContacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update only the provided fields
      { new: true, runValidators: true } // Return the updated client and validate input
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);

    res.status(400).json({ message: error.message });
  }
};

// ******** Controller Code for ContactClient ********* //

// Create a new contact for a client
export const addClientContact = async (req, res) => {
  try {
    const contact = new ContactClient(req.body);
    const newContact = await contact.save();
    res.status(201).json({ data: newContact });
  } catch (error) {
    res.status(400).json({ message: error.message, status: 400 });
  }
};

// Get all contacts for a specific client
export const getClientContacts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const contacts = await ContactClient.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("fonction_contact")
      .exec();

    // get total documents in the Posts collection
    const count = await ContactClient.countDocuments();

    // return response with posts, total pages, and current page
    res.json({
      total: count,
      limit: limit,
      page: page,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a specific contact by ID
export const getContactById = async (req, res) => {
  try {
    const contact = await ContactClient.findById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ data: contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get client contacts with pagination, search, and dropdown style
export const getClientContactsDropdown = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  try {
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const skip = (parsedPage - 1) * parsedLimit;

    const query = {};
    if (search) {
      query.$or = [
        { nom_contact: { $regex: search, $options: 'i' } }, // Assuming contact has 'nom_contact' field
        { email_contact: { $regex: search, $options: 'i' } }, // Assuming contact has 'email_contact' field
      ];
    }

    const results = await ContactClient.find(query)
      .populate("fonction_contact")
      .skip(skip)
      .limit(parsedLimit + 1)
      .exec();

    const hasMore = results.length > parsedLimit;
    const data = hasMore ? results.slice(0, -1) : results;

    res.json({
      data,
      nextPage: hasMore ? parsedPage + 1 : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update a contact by ID
export const updateContact = async (req, res) => {
  try {
    const updatedContact = await ContactClient.findByIdAndUpdate(
      req.params.contactId,
      { $set: req.body }, // Update only the provided fields
      { new: true, runValidators: true } // Return the updated contact and validate input
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a contact by ID
export const deleteContact = async (req, res) => {
  try {
    const deletedContact = await ContactClient.findByIdAndDelete(
      req.params.contactId
    );
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Upload Excel file and save client contacts
export const uploadContacts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet); // Convert sheet to JSON

    // Map Excel data to ContactClient schema
    const contacts = data.map((row) => ({
      id_client: row["Client ID"], // Map Excel column to schema field
      nom_prenom_contact: row["Full Name"],
      fonction_contact: row["Function Contact ID"], // Ensure this is a valid ObjectId
      numero_fix: row["Phone"],
      numero_mobile: row["Mobile"],
      adresse_email: row["Email"],
      compte_facebook: row["Facebook"],
      compte_instagram: row["Instagram"],
      compte_linkedin: row["LinkedIn"],
      compte_whatsapp: row["WhatsApp"],
      compte_whatsapp_num: row["WhatsApp Number"],
      canal_interet: row["Preferred Channel"],
      is_user: row["User"] === true,
    }));

    // Save contacts to the database
    await ContactClient.insertMany(contacts);

    // Create users for contacts where is_user is true
    for (const contact of contacts) {
      if (contact.is_user) {
        try {
          // Find the ContactClient by ID
          const contactClient = await ContactClient.findOne({
            adresse_email: contact.adresse_email,
          });
          if (!contactClient) {
            console.log(
              `ContactClient not found for email: ${contact.adresse_email}`
            );
            continue;
          }

          // Assuming a default role named 'client' exists
          const clientRole = await Role.findOne({ name: "client" });
          if (!clientRole) {
            console.log(
              'Client role not found. Please create a role named "client".'
            );
            continue;
          }

          // Create the new user
          const username =
            contact.nom_prenom_contact || contact.adresse_email.split("@")[0];
          const password = "defaultPassword"; // Replace with a more robust password generation

          const newUser = new User({
            username: username,
            email: contact.adresse_email,
            password: password,
            clientId: contact.id_client, // Set the clientId
            role: clientRole._id,
          });

          await newUser.save();
          console.log(`User created for email: ${contact.adresse_email}`);
        } catch (error) {
          console.error(
            `Error creating user for email: ${contact.adresse_email}`,
            error
          );
        }
      }
    }
    res
      .status(201)
      .json({ message: "Contacts uploaded successfully", contacts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error uploading contacts", error: error.message });
  }
};


export const exportContactClients = async (req, res) => {
  try {
    console.log("Fetching contact clients...");

    // Fetch contact clients and populate related fields (FonctionContact)
    const contactClients = await ContactClient.find({})
      .populate('fonction_contact', 'nom_fonction_contact') // Populate fonction_contact
      .select('id_client nom_prenom_contact fonction_contact numero_fix numero_mobile adresse_email compte_facebook compte_instagram compte_linkedin compte_whatsapp compte_whatsapp_num canal_interet is_user -_id');

    console.log("contactClients", contactClients);

    if (contactClients.length === 0) {
      return res.status(404).json({ message: "No contact clients found" });
    }

    // Convert contact clients to an array of objects for Excel export
    const data = contactClients.map(client => ({
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
    xlsx.utils.book_append_sheet(workbook, worksheet, "ContactClients");

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


// ******** Controller Code for functionContact ********* //

// Create a new function contact
export const createFonctionContact = async (req, res) => {
  try {
    const fonctionContact = new FonctionContact(req.body);
    const newFonctionContact = await fonctionContact.save();
    res.status(201).json({ data: newFonctionContact });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all function contacts
export const getAllFonctionContacts = async (req, res) => {
  try {
    const fonctionContacts = await FonctionContact.find();
    res.json({ data: fonctionContacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific function contact by ID
export const getFonctionContactById = async (req, res) => {
  try {
    const fonctionContact = await FonctionContact.findById(req.params.id);
    if (!fonctionContact) {
      return res.status(404).json({ message: "Function contact not found" });
    }
    res.json(fonctionContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a function contact by ID
export const updateFonctionContact = async (req, res) => {
  try {
    const updatedFonctionContact = await FonctionContact.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update only the provided fields
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedFonctionContact) {
      return res.status(404).json({ message: "Function contact not found" });
    }

    res.json({ data: updatedFonctionContact });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a function contact by ID
export const deleteFonctionContact = async (req, res) => {
  try {
    const deletedFonctionContact = await FonctionContact.findByIdAndDelete(
      req.params.id
    );
    if (!deletedFonctionContact) {
      return res.status(404).json({ message: "Function contact not found" });
    }

    res.status(200).json({ message: "Function contact deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ******** Controller Code for typeInfoLibreSchema ********* //

// Create a new type of free information
export const createTypeInfoLibre = async (req, res) => {
  try {
    const typeInfoLibre = new TypeInfoLibre(req.body);
    const newTypeInfoLibre = await typeInfoLibre.save();
    res.status(201).json(newTypeInfoLibre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all types of free information
export const getAllTypeInfoLibres = async (req, res) => {
  try {
    const typeInfoLibres = await TypeInfoLibre.find();
    res.json(typeInfoLibres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific type of free information by ID
export const getTypeInfoLibreById = async (req, res) => {
  try {
    const typeInfoLibre = await TypeInfoLibre.findById(req.params.id);
    if (!typeInfoLibre) {
      return res
        .status(404)
        .json({ message: "Type of free information not found" });
    }
    res.json(typeInfoLibre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a type of free information by ID
export const updateTypeInfoLibre = async (req, res) => {
  try {
    const updatedTypeInfoLibre = await TypeInfoLibre.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update only the provided fields
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedTypeInfoLibre) {
      return res
        .status(404)
        .json({ message: "Type of free information not found" });
    }

    res.json(updatedTypeInfoLibre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a type of free information by ID
export const deleteTypeInfoLibre = async (req, res) => {
  try {
    const deletedTypeInfoLibre = await TypeInfoLibre.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTypeInfoLibre) {
      return res
        .status(404)
        .json({ message: "Type of free information not found" });
    }

    res
      .status(200)
      .json({ message: "Type of free information deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ******** Controller Code for informationLibreSchema ********* //

// Create a new free information
export const createInformationLibre = async (req, res) => {
  try {
    const informationLibre = new InformationLibre(req.body);
    const newInformationLibre = await informationLibre.save();
    res.status(201).json(newInformationLibre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all free information
export const getAllInformationLibres = async (req, res) => {
  try {
    const informationLibres = await InformationLibre.find();
    res.json(informationLibres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific free information by ID
export const getInformationLibreById = async (req, res) => {
  try {
    const informationLibre = await InformationLibre.findById(req.params.id);
    if (!informationLibre) {
      return res.status(404).json({ message: "Free information not found" });
    }
    res.json(informationLibre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a free information by ID
export const updateInformationLibre = async (req, res) => {
  try {
    const updatedInformationLibre = await InformationLibre.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update only the provided fields
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedInformationLibre) {
      return res.status(404).json({ message: "Free information not found" });
    }

    res.json(updatedInformationLibre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a free information by ID
export const deleteInformationLibre = async (req, res) => {
  try {
    const deletedInformationLibre = await InformationLibre.findByIdAndDelete(
      req.params.id
    );
    if (!deletedInformationLibre) {
      return res.status(404).json({ message: "Free information not found" });
    }

    res.status(200).json({ message: "Free information deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
