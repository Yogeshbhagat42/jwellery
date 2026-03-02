const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    plating: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    dimensions: {
      length: { type: String, trim: true },
      width: { type: String, trim: true },
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

