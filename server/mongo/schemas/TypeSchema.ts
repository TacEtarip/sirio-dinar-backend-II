import { Schema } from 'mongoose';

const TypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  codigo: {
    type: String,
  },

  subTipo: {
    type: [String],
    trim: true,
  },

  subTipoLink: {
    type: [String],
    trim: true,
  },

  deleted: {
    type: Boolean,
    default: false,
  },

  link: {
    type: String,
    default: 'noPhoto.jpg',
  },

  order: {
    type: Number,
    default: -1,
  },
});

export default TypeSchema;
