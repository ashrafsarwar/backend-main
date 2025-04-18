import { model, Schema } from "mongoose";

const newSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    new_price: {
      type: Number,
      required: true,
    },
    old_price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    availabe: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Product = model("product", newSchema);
