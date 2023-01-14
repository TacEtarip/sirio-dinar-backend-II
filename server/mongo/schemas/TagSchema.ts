import { Schema } from 'mongoose';

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  deleted: {
    type: Boolean,
    default: false,
  },
});

export default TagSchema;
