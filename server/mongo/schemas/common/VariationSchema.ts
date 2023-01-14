import { Schema } from 'mongoose';
import QuantityOrderSchema from './QuantityOrderSchema';

const VariationSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    cantidad: {
      type: Number,
      default: 0,
      min: 0,
    },
    tipo: {
      type: Boolean,
      default: false,
    },
    comentario: {
      type: String,
      trim: true,
    },
    costoVar: {
      type: Number,
    },
    cantidadSC: {
      type: [QuantityOrderSchema],
      default: [],
    },
    usuario: {
      type: String,
      default: 'desconocido',
    },
  },
  { _id: false },
);

export default VariationSchema;
