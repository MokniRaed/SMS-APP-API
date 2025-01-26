import { Command, LineCommand } from '../models/command.model.js';

export const getAllCommands = async (req, res) => {
  try {
    const commands = await Command.find().populate('Id_Client Id_Collaborateur');
    res.json(commands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCommand = async (req, res) => {
  const command = new Command(req.body);
  try {
    const newCommand = await command.save();
    res.status(201).json(newCommand);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
      Id_commande: command._id
    });
    
    command.lignes.push(line);
    await command.save();
    
    res.status(201).json(command);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};