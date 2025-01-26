import xlsx from 'xlsx';
import { Project, ZoneCible } from '../models/project.model.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()// Populate the ClientId field with corresponding Client document
      ;
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  const project = new Project(req.body);
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Excel file and save client contacts
export const uploadZones = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet); // Convert sheet to JSON

    // Map Excel data to ContactClient schema
    const zones = data.map((row) => ({
      zone_cible: row['CL_Zone'], // Map Excel column to schema field
      sous_Zone_cible: row['CL_Sous_Zone'],

    }));

    // Save ZoneCible to the database
    await ZoneCible.insertMany(zones);

    res.status(201).json({ message: 'zones uploaded successfully', zones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading zones', error: error.message });
  }
};