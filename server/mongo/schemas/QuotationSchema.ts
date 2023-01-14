import { Schema } from 'mongoose';
import PersonalDocumentSchema from './common/PersonalDocumentSchema';
import SoldItemSchema from './common/SoldItemSchema';

export const QuotationSchema = new Schema({
  codigo: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  totalPrice: {
    type: Number,
    trim: true,
    required: true,
  },

  totalPriceNoIGV: {
    type: Number,
    trim: true,
    required: true,
  },

  estado: {
    type: String,
    trim: true,
    required: true,
  },

  documento: {
    type: PersonalDocumentSchema,
  },

  itemsVendidos: {
    type: [SoldItemSchema],
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  vendedor: {
    type: String,
  },

  tipoVendedor: {
    type: String,
    default: 'admin',
  },

  cliente_email: {
    type: String,
    trim: true,
  },

  celular_cliente: {
    type: String,
    trim: true,
  },
});

export default QuotationSchema;
