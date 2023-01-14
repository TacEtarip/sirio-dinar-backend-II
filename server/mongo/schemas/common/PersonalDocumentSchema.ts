import { Schema } from 'mongoose';

const PersonalDocumentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      trim: true,
      default: '',
    },

    codigo: {
      type: Number,
      trim: true,
    },

    direccion: {
      type: String,
    },
  },
  { _id: false },
);

export default PersonalDocumentSchema;
