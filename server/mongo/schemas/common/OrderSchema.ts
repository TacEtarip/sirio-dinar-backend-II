import { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    nameSecond: {
      type: String,
      trim: true,
    },

    cantidad: {
      type: Number,
      min: 0,
    },
  },
  { _id: false },
);

export default OrderSchema;
