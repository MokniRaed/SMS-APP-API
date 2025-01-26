import mongoose from 'mongoose';

const lineCommandSchema = new mongoose.Schema({
  Id_commande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Command',
    required: true
  },
  Id_ligne_cmd: {
    type: String,
    required: true
  },
  Id_Article: {
    type: String,
    required: true
  },
  Quantite_cmd: Number,
  Quantite_valid: Number,
  Quantite_confr: Number,
  Statut_art_cmd: String,
  Notes_cmd: String
});

const commandSchema = new mongoose.Schema({
  Id_commande: {
    type: String,
    required: true,
    unique: true
  },
  Date_cmd: {
    type: Date,
    required: true
  },
  Id_Client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  Id_Collaborateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Statut_cmd: {
    type: String,
    required: true
  },
  Date_livraison: Date,
  Heure_livraison: String,
  Notes_cmd: String,
  lignes: [lineCommandSchema]
}, {
  timestamps: true
});

export const LineCommand = mongoose.model('LineCommand', lineCommandSchema);
export const Command = mongoose.model('Command', commandSchema);