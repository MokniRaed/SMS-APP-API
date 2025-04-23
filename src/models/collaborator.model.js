import mongoose from 'mongoose';

const CollaboratorSchema = new mongoose.Schema({
  id_collab: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  numero_mobile: {
    type: String,
    required: true,
    unique: true

  },
  adresse_email: {
    type: String,
    required: true,
    unique: true

  },
  fontion: {
    type: String,
    required: true
  },
  service: String,
  is_user: {
    type: Boolean,
    default: false
  },
});



export const Collaborator = mongoose.model('Collaborator', CollaboratorSchema);
// export const Collaborator = mongoose.model('Collaborator', collabSchema);
