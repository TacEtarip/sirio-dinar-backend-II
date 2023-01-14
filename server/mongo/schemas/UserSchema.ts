import { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  hashPassword: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  dirOne: {
    type: String,
    trim: true,
  },
  dirTwo: {
    type: String,
    trim: true,
  },
  reference: {
    type: String,
    trim: true,
  },
  ciudad: {
    type: String,
    trim: true,
  },
  nombre: {
    type: String,
    trim: true,
  },
  apellido: {
    type: String,
    trim: true,
  },
  nomape: {
    type: String,
  },
  googleCod: {
    type: String,
    unique: true,
  },
  documento: {
    type: String,
    trim: true,
  },
  tipoPersona: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  celular: {
    type: String,
  },

  ventaActiva: {
    type: [String],
    default: [],
  },

  carrito: {
    type: String,
    default: 'not',
  },
});

export default UserSchema;
