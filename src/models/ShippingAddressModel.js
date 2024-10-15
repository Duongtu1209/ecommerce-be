const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const ShippingAddress = mongoose.model(
  "ShippingAddress",
  shippingAddressSchema
);
module.exports = ShippingAddress;
