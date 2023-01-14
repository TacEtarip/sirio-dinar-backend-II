import { Schema } from 'mongoose';
import OrderSchema from './OrderSchema';

const SubQuantitySchema = new Schema(
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

    order: {
      type: [OrderSchema],
    },
  },
  { _id: false },
);

export default SubQuantitySchema;
