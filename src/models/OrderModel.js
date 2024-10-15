const mongoose = require('mongoose');
const OrderItems = require("../models/OrderItemsModel");
const ShippingAddress = require("../models/ShippingAddressModel");

const orderSchema = new mongoose.Schema(
    {
        paymentMethod: { type: String, required: true },
        shippingMethod: { type: String, required: true },
        subTotal: { type: Number, required: true },
        shippingFee: { type: Number, required: true },
        discountAmount: { type: Number, required: true },
        grandTotal: { type: Number, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date },
        orderItems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "OrderItems",
                required: true,
            },
        ],
        shippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShippingAddress",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.pre('remove', async function (next) {
    try {
        await OrderItems.deleteMany({ _id: { $in: this.orderItems } });

        await ShippingAddress.findByIdAndDelete(this.shippingAddress);

        next();
    } catch (err) {
        next(err);
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
