const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
    rating: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    description: { type: String },
    selled: { type: Number },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
