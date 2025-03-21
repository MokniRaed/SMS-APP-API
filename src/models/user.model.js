import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';


const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  clientId: {
    type: String, // Or mongoose.Schema.Types.ObjectId if ContactClient.id is an ObjectId
    required: false, // Make it optional in case some users aren't associated with a ContactClient
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', // Reference to the Role collection
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


export const User = mongoose.model('User', userSchema);
export const Role = mongoose.model('Role', roleSchema);
