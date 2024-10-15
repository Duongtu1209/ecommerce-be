const mongoose = require("mongoose");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductsModel");
const OrderItems = require("../models/OrderItemsModel");
const ShippingAddress = require("../models/ShippingAddressModel");
const User = require("../models/UserModel");

const createOrder = async (newOrder) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      orderItems,
      paymentMethod,
      shippingMethod,
      subTotal,
      shippingAddress,
      discountAmount,
      grandTotal,
      shippingFee,
      user,
    } = newOrder;

    const createdShippingAddress = await ShippingAddress.create(
      [shippingAddress],
      { session }
    );

    const orderItemsData = await Promise.all(
      orderItems.map(async (item) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: item.product,
            quantity: { $gte: item.quantity },
          },
          {
            $inc: { quantity: -item.quantity, sold: +item.quantity },
          },
          { new: true, session }
        );

        if (!productData) {
          throw new Error(
            `Product with id: ${item.product} is out of stock or insufficient quantity`
          );
        }

        const createdOrderItem = await OrderItems.create(
          [
            {
              name: item.name,
              quantity: item.quantity,
              image: item.image,
              price: item.price,
              discount: item.discount || 0,
              product: item.product,
            },
          ],
          { session }
        );

        return createdOrderItem[0]._id;
      })
    );

    const createdOrder = await Order.create(
      [
        {
          paymentMethod,
          shippingMethod,
          subTotal,
          shippingFee,
          discountAmount,
          grandTotal,
          user: user,
          orderItems: orderItemsData,
          shippingAddress: createdShippingAddress[0]._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      status: "OK",
      message: "Successfully created the order.",
      data: createdOrder,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return {
      status: "ERR",
      message: error.message || "Failed to create order.",
    };
  }
};

const getOrderByUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({ user: userId })
        .populate("orderItems")
        .populate("shippingAddress")
          .populate("user");

      if (!orders || orders.length === 0) {
        resolve({
          status: "ERR",
          message: "No orders found for this user",
        });
      } else {
        resolve({
          status: "OK",
          message: "Orders retrieved successfully",
          data: orders,
        });
      }
    } catch (err) {
      reject({
        status: "ERR",
        message: err.message,
      });
    }
  });
};

const getOrderDetail = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(orderId)
        .populate("orderItems")
        .populate("shippingAddress")
          .populate("user");

      if (!order) {
        resolve({
          status: "ERR",
          message: "Order does not exist",
        });
      } else {
        resolve({
          status: "OK",
          message: "Order details retrieved successfully",
          data: order,
        });
      }
    } catch (err) {
      reject({
        status: "ERR",
        message: err.message,
      });
    }
  });
};

const getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find().populate("user");

      resolve({
        status: "OK",
        message: "successfully",
        data: allOrder,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const cancelOrder = async (orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(orderId)
        .populate("orderItems")
        .populate("shippingAddress")
        .session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return {
        status: "ERR",
        message: "Order does not exist",
      };
    }

    await Promise.all(
        order.orderItems.map(async (item) => {
          await Product.findOneAndUpdate(
              { _id: item.product },
              { $inc: { quantity: item.quantity, sold: -item.quantity } },
              { session }
          );
        })
    );

    await OrderItems.deleteMany({ _id: { $in: order.orderItems } }).session(session);
    await ShippingAddress.findByIdAndDelete(order.shippingAddress._id).session(session);

    await Order.findByIdAndDelete(orderId).session(session);

    await session.commitTransaction();
    session.endSession();

    return {
      status: "OK",
      message: "Order and related records canceled and deleted successfully",
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return {
      status: "ERR",
      message: err.message,
    };
  }
};


module.exports = {
  createOrder,
  getOrderByUser,
  getOrderDetail,
  cancelOrder,
  getAll
};
