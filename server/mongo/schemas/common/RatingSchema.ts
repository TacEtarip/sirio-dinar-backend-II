import { Schema } from 'mongoose';

const RatingSchema = new Schema(
  {
    user: {
      type: String,
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

export default RatingSchema;
