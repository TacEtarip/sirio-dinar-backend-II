import { Schema } from 'mongoose';
import QuantityOrderSchema from './QuantityOrderSchema';

const SoldItemSchema = new Schema(
  {
    codigo: {
      type: String,
      required: true,
      trim: true,
    },

    tipo: {
      type: String,
      trim: true,
      default: 'producto',
    },

    name: {
      type: String,
      trim: true,
    },

    descripcion: {
      type: String,
      trim: true,
    },

    priceIGV: {
      type: Number,
      required: true,
      trim: true,
    },

    priceNoIGV: {
      type: Number,
      required: true,
      trim: true,
    },

    priceCosto: {
      type: Number,
      default: 0,
    },

    cantidad: {
      type: Number,
      required: true,
      trim: true,
      min: 0,
    },

    cantidadSC: {
      type: [QuantityOrderSchema],
      default: [],
    },

    totalPrice: {
      type: Number,
    },

    totalPriceNoIGV: {
      type: Number,
    },

    unidadDeMedida: {
      type: String,
    },

    photo: {
      type: String,
    },

    ventaCod: {
      type: String,
    },
  },
  { _id: false },
);

export default SoldItemSchema;
