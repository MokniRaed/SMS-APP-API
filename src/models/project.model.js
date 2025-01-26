import mongoose from 'mongoose';


// Schema for type_PROJET
const typeProjetSchema = new mongoose.Schema({
  nom_type_prj: {
    type: String,
    required: true
  },
  description_type_prj: {
    type: String,
    required: true
  }
});

// Schema for PRODUIT_cible
const produitCibleSchema = new mongoose.Schema({

  nom_produit_cible: {
    type: String,
    required: true
  },
  description_produit_cible: {
    type: String,
    required: true
  }
});

// Schema for ZONE_cible
const zoneCibleSchema = new mongoose.Schema({

  zone_cible: {
    type: String,
    required: true
  },
  sous_Zone_cible: {
    type: String,
    required: true,
    unique: true

  },

});


// Schema for statut_PROJET
const statutProjetSchema = new mongoose.Schema({
  nom_statut_prj: {
    type: String,
    required: true
  },
  description_statut_prj: {
    type: String,
    required: true
  }
});

const projectSchema = new mongoose.Schema({
  nom_projet: {
    type: String,
    required: true,
  },
  type_projet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'TypeProjet',
  },
  produit_cible: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ProduitCible',// Reference to PRODUIT_cible table
  },

  description_projet: String,
  objectif_ca: Number,
  objectif_qte: Number,
  zone_cible: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ZoneCible',
  },
  periode_date_debut: Date,
  periode_date_fin: Date,
  statut_projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StatutProjet',
    required: true
  },

  notes_projet: String
}, {
  timestamps: true
});

// Create models for each schema
const TypeProjet = mongoose.model('TypeProjet', typeProjetSchema);
const ZoneCible = mongoose.model('ZoneCible', zoneCibleSchema);
const ProduitCible = mongoose.model('ProduitCible', produitCibleSchema);
const StatutProjet = mongoose.model('StatutProjet', statutProjetSchema);
const Project = mongoose.model('Project', projectSchema);

export { ProduitCible, Project, StatutProjet, TypeProjet, ZoneCible };

