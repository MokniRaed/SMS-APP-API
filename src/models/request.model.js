import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  Id_requete: {
    type: String,
    required: true,
    unique: true
  },
  Date_requete: {
    type: Date,
    required: true
  },
  Id_Client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  Type_requete: {
    type: String,
    required: true
  },
  Cible_requete: String,
  Description_requete: String,
  Date_traitement_requete: Date,
  Heure_traitement_requete: String,
  Statut_requete: {
    type: String,
    required: true
  },
  Notes_requete: String
}, {
  timestamps: true
});

export default mongoose.model('Request', requestSchema);