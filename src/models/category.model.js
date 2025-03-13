
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  cat_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['cat_stat', 'cat_nv_1', 'cat_nv_2', 'st', 'marque',],
    required: true
  },
  parentId: { type: String, default: null },
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
