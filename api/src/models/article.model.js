import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  art_id: {
    type: String,
    required: true,
    unique: true
  },
  art_designation: {
    type: String,
    required: true
  },
  art_unite_vente: String,
  art_suivi_stock: {
    type: String,
  },
  art_code_famille: String,
  art_famille: String,
  art_cat_niv_1: String,
  art_cat_niv_2: String,
  art_marque: String,
  art_st: String,
  art_tb: String
});

export const Article = mongoose.model('Article', articleSchema);
