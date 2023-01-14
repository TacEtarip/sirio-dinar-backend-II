import { Schema } from 'mongoose';

const BrandSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  codigo: {
    type: String,
    required: true,
    unique: true,
  },

  ruc: {
    type: Number,
  },
});

export default BrandSchema;
