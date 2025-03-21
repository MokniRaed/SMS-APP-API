import mongoose from 'mongoose';

// statutCmdSchema Schema (for statut_cmd)
const statutCmdSchema = new mongoose.Schema({
  value: {
    type: String,
    // required: true,  // status value like 'pending', 'completed', etc.
  },
  description: {
    type: String,
    required: true,  // description of the status
  }
});

// statutArtCmdSchema Schema (for statut_art_cmd)
const statutArtCmdSchema = new mongoose.Schema({
  value: {
    type: String,
    // required: true,  // status value like 'shipped', 'pending', etc.
  },
  description: {
    type: String,
    required: true,  // description of the status
  }
});

const commandSchema = new mongoose.Schema({
  date_cmd: {
    type: Date,
    required: true
  },
  id_client: {
    type: String,
    required: true
  },
  id_collaborateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  statut_cmd: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StatutCmd',  // Reference to statutCmdSchema model
    required: true
  },
  date_livraison: Date,
  notes_cmd: String,
}, {
  timestamps: true
});

// LineCommand Schema (uses StatutArtCmdDescription)
const lineCommandSchema = new mongoose.Schema({
  id_commande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Command',
    required: true
  },
  id_article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  quantite_cmd: Number,
  quantite_valid: Number,
  quantite_confr: Number,
  statut_art_cmd: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StatutArtCmd',  // Reference to statutArtCmd model
    required: true
  },
  notes_cmd: String
});

//  Models for the Descriptions
export const StatutCmd = mongoose.model('StatutCmd', statutCmdSchema);
export const StatutArtCmd = mongoose.model('StatutArtCmd', statutArtCmdSchema);

//  the Main Models
export const LineCommand = mongoose.model('LineCommand', lineCommandSchema);
export const Command = mongoose.model('Command', commandSchema);
