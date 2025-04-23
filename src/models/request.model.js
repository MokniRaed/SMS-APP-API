import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  id_requete: {
    type: String,
    required: true,
    unique: true
  },
  date_requete: {
    type: Date,
    required: true
  },
  id_client: {
    type: String,
    required: true,
  },
  type_requete: {
    type: String,
    required: true
  },
  cible_requete: String,
  description_requete: String,
  date_traitement_requete: Date,
  heure_traitement_requete: String,
  statut_requete: {
    type: String,
    required: true
  },
  archived: {
    type: Boolean,
    required: true,
    default: false,
  },
  notes_requete: String
}, {
  timestamps: true
});

export default mongoose.model('Request', requestSchema);