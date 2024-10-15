const mongoose = require("mongoose");

const orderItemsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const OrderItems = mongoose.model("OrderItems", orderItemsSchema);
module.exports = OrderItems;
