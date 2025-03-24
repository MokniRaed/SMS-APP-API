import mongoose from 'mongoose';


const typeInfoLibreibSchema = new mongoose.Schema({
  nom_type_inf: {
    type: String,
    required: true,
    unique: true
  },
  description_type_inf: String
});

const informationLibreSchema = new mongoose.Schema({
  Id_Client: {
    type: String,
    required: true
  },
  Type_info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TypeInfoLibre',

    required: true,
    unique: true
  },
  Description_info: String
});

const equipementClientSchema = new mongoose.Schema({
  Id_equipement: {
    type: String,
    required: true
  },
  Id_Client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  Classe_equipement: String,
  Model_equipement: String,
  Constructeur_equipement: String,
  Producteur_reactif: String,
  Producteur_Controle: String,
  Distributeur_local: String,
  Annee_installation: Number,
  Position_equipement: String
});

// const clientSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   adresse: String,
//   phone: String,
//   email: String
// }, {
//   timestamps: true
// });



const fonctionContactSchema = new mongoose.Schema({
  nom_fonc: {
    type: String,
    required: true,
    unique: true
  },
  description_fonc: String
});

const contactClientSchema = new mongoose.Schema({
  id_client: {
    type: String,
    required: true,
    unique: true
  },
  nom_prenom_contact: String,
  fonction_contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FonctionContact',
    // required: true
  },
  numero_fix: String,
  numero_mobile: String,
  adresse_email: String,
  compte_facebook: String,
  compte_instagram: String,
  compte_linkedin: String,
  compte_whatsapp: String,
  compte_whatsapp_num: String,
  canal_interet: String,
  is_user: {
    type: String,
    default: false
  },
});



export const FonctionContact = mongoose.model('FonctionContact', fonctionContactSchema);
export const InformationLibre = mongoose.model('InformationLibre', informationLibreSchema);
export const TypeInfoLibre = mongoose.model('TypeInfoLibre', typeInfoLibreibSchema);
export const ContactClient = mongoose.model('ContactClient', contactClientSchema);
export const EquipementClient = mongoose.model('EquipementClient', equipementClientSchema);
// export const Client = mongoose.model('Client', clientSchema);