import xlsx from 'xlsx';
import { ProduitCible, Project, StatutProjet, TypeProjet, ZoneCible } from '../models/project.model.js';

export const getAllProjects = async (req, res) => {
  const { page = 1, limit = 10, searchTerm = '' } = req.query;
  try {
    const skip = (page - 1) * limit;

    let searchQuery = searchTerm
      ? {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
          ],
        }
      : {};

    const projects = await Project.find(searchQuery)
      .populate('type_projet produit_cible statut_projet zone_cible')
      .skip(skip)
      .limit(limit * 1)
      .exec();

    const total = await Project.countDocuments(searchQuery);

    res.json({
      total: total,
      limit: limit,
      page: page,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ data: project });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    console.log("reading file");

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet); // Convert sheet to JSON

    // Map Excel data to ContactClient schema
    const zones = data.map((row) => ({
      zone_cible: row['CL_Zone'], // Map Excel column to schema field
      sous_Zone_cible: row['CL_Sous_Zone'],

    }));
    console.log("insering data");


    // Save ZoneCible to the database
    await ZoneCible.insertMany(zones);

    res.status(201).json({ message: 'zones uploaded successfully', zones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading zones', error: error.message });
  }
};


export const getAllZones = async (req, res) => {
  try {
    const zoneCible = await ZoneCible.find()
      ;
    res.json({ data: zoneCible });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const exportProjects = async (req, res) => {
  try {
    console.log("Fetching projects...");

    // Fetch projects and populate related fields
    const projects = await Project.find({})
      .populate('type_projet', 'nom_type_prj') // Populate type_projet
      .populate('produit_cible', 'nom_produit_cible') // Populate produit_cible
      .populate('zone_cible', 'zone_cible sous_Zone_cible') // Populate zone_cible
      .populate('statut_projet', 'nom_statut_prj') // Populate statut_projet
      .select('nom_projet type_projet produit_cible description_projet objectif_ca objectif_qte zone_cible periode_date_debut periode_date_fin statut_projet notes_projet -_id');

    console.log("projects", projects);

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    // Convert projects to an array of objects for Excel export
    const data = projects.map(project => ({
      projectName: project.nom_projet,
      projectType: project.type_projet ? project.type_projet.nom_type_prj : 'N/A',
      targetProduct: project.produit_cible ? project.produit_cible.nom_produit_cible : 'N/A',
      description: project.description_projet || 'N/A',
      targetRevenue: project.objectif_ca || 'N/A',
      targetQuantity: project.objectif_qte || 'N/A',
      targetZone: project.zone_cible ? `${project.zone_cible.zone_cible} - ${project.zone_cible.sous_Zone_cible}` : 'N/A',
      startDate: project.periode_date_debut ? project.periode_date_debut.toISOString().split('T')[0] : 'N/A', // Format date as YYYY-MM-DD
      endDate: project.periode_date_fin ? project.periode_date_fin.toISOString().split('T')[0] : 'N/A', // Format date as YYYY-MM-DD
      status: project.statut_projet ? project.statut_projet.nom_statut_prj : 'N/A',
      notes: project.notes_projet || 'N/A'
    }));

    console.log("Creating Excel file...");
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Projects");

    // Generate a safe filename based on the current date
    const formattedDate = new Date().toISOString().replace(/[-:.]/g, "_"); // Safe filename format (YYYY_MM_DD_HH_mm_SS)
    const filename = `projects_${formattedDate}.xlsx`;

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
    res.status(500).json({ message: 'Error exporting projects', error: error.message });
  }
};



// ******** Controller Code for TypeProjects ********* //


export const getAllTypeProjects = async (req, res) => {
  try {
    const typeProjects = await TypeProjet.find()
      ;
    res.json({ data: typeProjects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTypeProjectById = async (req, res) => {
  try {
    const typeProject = await TypeProjet.findById(
      req.params.id
    );
    if (!typeProject) {
      return res.status(404).json({ message: 'type Project not found' });
    }
    res.json(typeProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const createTypeProject = async (req, res) => {
  const typeProject = new TypeProjet(req.body);
  try {
    const newTypeProject = await typeProject.save();
    res.status(201).json(newTypeProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateTypeProject = async (req, res) => {
  try {
    const typeProject = await TypeProjet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!typeProject) {
      return res.status(404).json({ message: 'type Project not found' });
    }
    res.json(typeProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTypeProject = async (req, res) => {
  try {
    const typeProject = await TypeProjet.findByIdAndDelete(req.params.id);
    if (!typeProject) {
      return res.status(404).json({ message: 'Type Project not found' });
    }
    res.json({ message: 'typeProject deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ******** Controller Code for ProduitCible ********* //


export const getAllProduitsCible = async (req, res) => {
  try {
    const produitsCible = await ProduitCible.find()// Populate the ClientId field with corresponding Client document
      ;
    res.json({ data: produitsCible });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduitCibleById = async (req, res) => {
  try {
    const produitCible = await ProduitCible.findById(
      req.params.id
    );
    if (!produitCible) {
      return res.status(404).json({ message: 'Produit Cible  not found' });
    }
    res.json(produitCible);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const createProduitCible = async (req, res) => {
  const produitCible = new ProduitCible(req.body);
  try {
    const newProduitCible = await produitCible.save();
    res.status(201).json(newProduitCible);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateProduitCible = async (req, res) => {
  try {
    const produitCible = await ProduitCible.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!produitCible) {
      return res.status(404).json({ message: 'Produit Cible  not found' });
    }
    res.json(produitCible);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduitCible = async (req, res) => {
  try {
    const produitCible = await ProduitCible.findByIdAndDelete(req.params.id);
    if (!produitCible) {
      return res.status(404).json({ message: 'Produit Cible  not found' });
    }
    res.json({ message: 'Produit Cible deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ******** Controller Code for StatutProjet ********* //


export const getAllProjectsStatus = async (req, res) => {
  try {
    const statutProjet = await StatutProjet.find()// Populate the ClientId field with corresponding Client document
      ;
    res.json({ data: statutProjet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectStatus = async (req, res) => {
  try {
    const statutProjet = await StatutProjet.findById(
      req.params.id
    );
    if (!statutProjet) {
      return res.status(404).json({ message: 'Statut Projet  not found' });
    }
    res.json(statutProjet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const createProjectStatus = async (req, res) => {
  const statutProjet = new StatutProjet(req.body);
  try {
    const newProduitCible = await statutProjet.save();
    res.status(201).json(newProduitCible);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateProjectStatus = async (req, res) => {
  try {
    const statutProjet = await StatutProjet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!statutProjet) {
      return res.status(404).json({ message: 'Statut Projet not found' });
    }
    res.json(statutProjet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProjectStatus = async (req, res) => {
  try {
    const statutProjet = await StatutProjet.findByIdAndDelete(req.params.id);
    if (!statutProjet) {
      return res.status(404).json({ message: 'Statut Projet  not found' });
    }
    res.json({ message: 'Statut Projet deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get project statistics
export const getProjectStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ 'statut_projet.nom_statut_prj': 'PENDING' });

    res.json({
      totalProjects,
      activeProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
