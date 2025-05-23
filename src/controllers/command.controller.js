import xlsx from "xlsx";
import { generateRandomID } from "../config/utils.js";
import { Article } from '../models/article.model.js';
import { ContactClient } from '../models/client.model.js';
import { Command, LineCommand, StatutArtCmd, StatutCmd } from '../models/command.model.js';

export const getAllCommands = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    let query = Command.find();

    if (req.query.id_client) {
      query = query.where('id_client').equals(req.query.id_client);
    }

    if (req.query.id_collaborateur) {
      query = query.where('id_collaborateur').equals(req.query.id_collaborateur);
    }

    const commands = await query
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('id_collaborateur statut_cmd')
      .exec();

    // Manually populate id_client
    const populatedCommands = await Promise.all(
      commands.map(async (command) => {
        const contactClient = await ContactClient.findOne({ id_client: command.id_client });
        return {
          ...command.toObject(),
          id_client: contactClient,
        };
      })
    );

    const count = await Command.countDocuments();

    res.status(200).json({
      total: count,
      limit: limit,
      page: page,
      data: populatedCommands,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Command.countDocuments();
    res.json({
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCommand = async (req, res) => {
  const { date_cmd, id_client, id_collaborateur, statut_cmd, date_livraison, notes_cmd, articles } = req.body;

  try {
    const id_order = generateRandomID("ORD")
    // Create a new Command
    const newCommand = new Command({
      id_order,
      date_cmd,
      id_client,
      id_collaborateur,
      statut_cmd,
      date_livraison,
      notes_cmd,
    });

    const savedCommand = await newCommand.save();

    // Create LineCommands (Articles)
    const lineCommands = articles?.map(article => {
      return new LineCommand({
        id_commande: savedCommand._id,
        id_article: article.id_article,
        quantite_cmd: article.quantite_cmd,
        quantite_valid: article.quantite_valid || 0,
        quantite_confr: article.quantite_confr || 0,
        statut_art_cmd: article.statut_art_cmd,
        notes_cmd: article.notes_cmd || '',
      });
    });

    await LineCommand.insertMany(lineCommands);

    // Associate the LineCommands with the Command
    savedCommand.lignes = lineCommands.map(line => line._id);
    await savedCommand.save();

    res.status(201).json(savedCommand);
  } catch (error) {
    console.log("error", error);

    res.status(400).json({ message: error.message });
  }
};


export const exportCommands = async (req, res) => {
  try {
    console.log("Fetching commands...");

    // Fetch commands and populate related fields (client, collaborator, and status)
    const commands = await Command.find({})
      .populate('id_collaborateur', 'username') // Populate collaborator's username
      .populate('statut_cmd', 'value description') // Populate status' value and description
      .select('date_cmd id_client id_collaborateur statut_cmd date_livraison notes_cmd -_id'); // Select relevant fields

    console.log("commands", commands);

    if (commands.length === 0) {
      return res.status(404).json({ message: "No commands found" });
    }

    // Convert commands to an array of objects for Excel export
    const data = commands.map(command => ({
      date: command.date_cmd ? command.date_cmd.toISOString().split('T')[0] : 'N/A', // Format date as YYYY-MM-DD
      client: command.id_client || 'N/A', // Assuming id_client is just a string
      collaborator: command.id_collaborateur ? command.id_collaborateur.username : 'N/A', // Username of collaborator
      status: command.statut_cmd ? `${command.statut_cmd.value} - ${command.statut_cmd.description}` : 'N/A', // Status description
      deliveryDate: command.date_livraison ? command.date_livraison.toISOString().split('T')[0] : 'N/A', // Format delivery date
      notes: command.notes_cmd || 'N/A', // Notes
    }));

    console.log("Creating Excel file...");
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Commands");

    // Generate a safe filename based on the current date
    const formattedDate = new Date().toISOString().replace(/[-:.]/g, "_"); // Safe filename format (YYYY_MM_DD_HH_mm_SS)
    const filename = `commands_${formattedDate}.xlsx`;

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
    res.status(500).json({ message: 'Error exporting commands', error: error.message });
  }
};



export const validateOrder = async (req, res) => {
  const { id } = req.params;
  const { date_cmd, id_client, id_collaborateur, statut_cmd, date_livraison, notes_cmd, articles } = req.body;


  try {
    // 1. Update the main Command document
    const updatedCommand = await Command.findByIdAndUpdate(
      id,
      {
        date_cmd,
        id_client,
        id_collaborateur,
        statut_cmd,
        date_livraison,
        notes_cmd
      },
    );

    if (!updatedCommand) {
      throw new Error('Order not found');
    }

    // 2. Process Line Commands
    const existingLines = await LineCommand.find({ id_commande: id });
    const existingLineIds = existingLines.map(line => line._id.toString());

    // Prepare bulk operations
    const bulkOps = [];

    // Process incoming articles
    for (const article of articles) {
      // Validate article existence (optional)
      const validArticle = await Article.exists({ _id: article.id_article });
      if (!validArticle) throw new Error(`Invalid article ID: ${article.id_article}`);

      if (article._id) {
        // Update existing line
        bulkOps.push({
          updateOne: {
            filter: { _id: article._id },
            update: {
              $set: {
                quantite_cmd: article.quantite_cmd,
                quantite_valid: article.quantite_valid,
                quantite_confr: article.quantite_confr,
                statut_art_cmd: article.statut_art_cmd,
                notes_cmd: article.notes_cmd
              }
            }
          }
        });
        // Keep track of existing IDs
        existingLineIds.splice(existingLineIds.indexOf(article._id), 1);
      } else {
        // Create new line
        bulkOps.push({
          insertOne: {
            document: {
              ...article,
              id_commande: id
            }
          }
        });
      }
    }

    // Delete remaining lines not in incoming articles
    if (existingLineIds.length > 0) {
      bulkOps.push({
        deleteMany: {
          filter: { _id: { $in: existingLineIds } }
        }
      });
    }

    // Execute all line command operations
    const bulkResult = await LineCommand.bulkWrite(bulkOps);



    // 3. Update Command's lignes array
    const newIds = Object.values(bulkResult.insertedIds || {});
    updatedCommand.lignes = [
      ...articles.filter(a => a._id).map(a => a._id), // Existing IDs
      ...newIds // Newly created IDs
    ];

    await updatedCommand.save();

    // //  Populate the response
    // const finalCommand = await Command.findById(id)
    //   .populate('lignes')
    //   .populate('id_client')
    //   .populate('id_collaborateur');

    res.status(200).json({ data: updatedCommand });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      message: error.message,
      details: error instanceof mongoose.Error.ValidationError
        ? error.errors
        : null
    });
  }
};
export const getLineCommandsbyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const lineCommands = await LineCommand.find({ id_commande: id })
      .populate('id_commande statut_art_cmd id_article');
    res.json({ data: lineCommands });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllLineCommands = async (req, res) => {
  try {
    const lineCommands = await LineCommand.find()
      .populate('id_commande statut_art_cmd');
    res.json(lineCommands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCommandLine = async (req, res) => {
  try {
    const command = await Command.findById(req.params.id);
    if (!command) {
      return res.status(404).json({ message: 'Command not found' });
    }

    const line = new LineCommand({
      ...req.body,
      id_commande: command._id,
    });

    await line.save();

    // Add the LineCommand to the Command's `lignes` field
    command.lignes.push(line._id);
    await command.save();

    res.status(201).json(line);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getCommandById = async (req, res) => {

  try {
    const command = await Command.findById(req.params.id)

    if (!command) {
      return res.status(404).json({ message: 'Command not found' });
    }
    res.json({ data: command });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteCommand = async (req, res) => {

  try {
    const command = await Command.findByIdAndDelete(req.params.id);
    if (!command) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await LineCommand.deleteMany({ id_commande: req.params.id })
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






// Get all statutCmd descriptions
export const getAllStatutCmds = async (req, res) => {
  try {
    const statutCmds = await StatutCmd.find();

    res.json({ data: statutCmds });
  } catch (error) {
    console.log("err", error);

    res.status(500).json({ message: error.message });
  }
};

// Create a new statutCmd description
export const createStatutCmd = async (req, res) => {
  const { value, description } = req.body;

  try {
    const statutCmd = new StatutCmd({ value, description });
    const newStatutCmd = await statutCmd.save();
    res.status(201).json(newStatutCmd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single statutCmd by ID
export const getStatutCmdById = async (req, res) => {
  try {
    const statutCmd = await StatutCmd.findById(req.params.id);
    if (!statutCmd) {
      return res.status(404).json({ message: 'StatutCmd not found' });
    }
    res.json(statutCmd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update statutCmd by ID
export const updateStatutCmd = async (req, res) => {
  try {
    const updatedStatutCmd = await StatutCmd.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStatutCmd) {
      return res.status(404).json({ message: 'StatutCmd not found' });
    }
    res.json(updatedStatutCmd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a statutCmd by ID
export const deleteStatutCmd = async (req, res) => {
  try {
    const deletedStatutCmd = await StatutCmd.findByIdAndDelete(req.params.id);
    if (!deletedStatutCmd) {
      return res.status(404).json({ message: 'StatutCmd not found' });
    }
    res.json({ message: 'StatutCmd deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ** StatutArtCmd Controllers **

// Get all statutArtCmd descriptions
export const getAllStatutArtCmds = async (req, res) => {
  try {
    const statutArtCmds = await StatutArtCmd.find();
    res.json({ data: statutArtCmds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new statutArtCmd description
export const createStatutArtCmd = async (req, res) => {
  const { value, description } = req.body;

  try {
    const statutArtCmd = new StatutArtCmd({ value, description });
    const newStatutArtCmd = await statutArtCmd.save();
    res.status(201).json(newStatutArtCmd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single statutArtCmd by ID
export const getStatutArtCmdById = async (req, res) => {
  try {
    const statutArtCmd = await StatutArtCmd.findById(req.params.id);
    if (!statutArtCmd) {
      return res.status(404).json({ message: 'StatutArtCmd not found' });
    }
    res.json(statutArtCmd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update statutArtCmd by ID
export const updateStatutArtCmd = async (req, res) => {
  try {
    const { description } = req.body;
    const updatedStatutArtCmd = await StatutArtCmd.findByIdAndUpdate(req.params.id, { description: description });
    if (!updatedStatutArtCmd) {
      return res.status(404).json({ message: 'StatutArtCmd not found' });
    }
    res.json(updatedStatutArtCmd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a statutArtCmd by ID
export const deleteStatutArtCmd = async (req, res) => {
  try {
    const deletedStatutArtCmd = await StatutArtCmd.findByIdAndDelete(req.params.id);
    if (!deletedStatutArtCmd) {
      return res.status(404).json({ message: 'StatutArtCmd not found' });
    }
    res.json({ message: 'StatutArtCmd deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
