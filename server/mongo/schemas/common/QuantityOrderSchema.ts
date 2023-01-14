import { Schema } from 'mongoose';

const QuantityOrderSchema = new Schema(
  {
    name: { type: String },
    nameSecond: { type: String },
    cantidadDisponible: { type: Number },
    cantidadVenta: { type: Number },
  },
  { _id: false },
);

export default QuantityOrderSchema;
