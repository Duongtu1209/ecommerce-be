const Order = require("../models/OrderModel");
const bcrypt = require("bcrypt");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      subTotal,
      shippingAddress,
      discountAmount,
      grandTotal,
      shippingFee,
      user,
    } = newOrder;
    try {
      const createOrder = Order.create({
        orderItems,
        paymentMethod,
        subTotal,
        shippingAddress,
        discountAmount,
        grandTotal,
        shippingFee,
        user: user,
      });
      if (createOrder) {
        resolve({
          status: "OK",
          message: "Create order successfully",
          data: createOrder,
        });
      }
    } catch (error) {
      reject(err);
    }
  });
};

module.exports = {
  createOrder,
};
