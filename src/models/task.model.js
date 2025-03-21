import mongoose from 'mongoose';

const typeTacheSchema = new mongoose.Schema({
  nom_type_tch: {
    type: String,
    required: true,
  },
  description_type_tch: {
    type: String,
    // required: true,
  },
}, {
  timestamps: true,
});

const statutTacheSchema = new mongoose.Schema({

  nom_statut_tch: {
    type: String,
    required: true,
  },
  description_statut_tch: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const taskSchema = new mongoose.Schema({
  title_tache: String,
  type_tache: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'TypeTache',
  },
  id_client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContactClient',
    required: true,
  },
  id_projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  id_collaborateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date_tache: {
    type: Date,
    required: true,
  },
  description_tache: String,
  adresse_tache: String,
  date_execution_tache: Date,
  compte_rendu_tache: String,
  statut_tache: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StatutTache',
    required: true,
  },
  notes_tache: String,
}, {
  timestamps: true,
});

// Export models
export const TypeTache = mongoose.model('TypeTache', typeTacheSchema);
export const StatutTache = mongoose.model('StatutTache', statutTacheSchema);
export const Task = mongoose.model('Task', taskSchema);
