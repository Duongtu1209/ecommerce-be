const { isSet } = require("util/types");
const OrderService = require("../services/OrderService");
const UserService = require("../services/UserService");

const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      shippingMethod,
      subTotal,
      shippingAddress,
      discountAmount,
      grandTotal,
      shippingFee,
    } = req.body;
    if (
      isSet(paymentMethod) ||
      isSet(shippingMethod) ||
      isSet(subTotal) ||
      isSet(shippingAddress) ||
      isSet(discountAmount) ||
      isSet(grandTotal) ||
      isSet(shippingFee)
    ) {
      return res.status(500).json({
        status: "ERR",
        message: "This field is a required field",
      });
    }

    const response = await OrderService.createOrder(req.body);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getOrderByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(500).json({
        status: "ERR",
        message: "The user does not exist",
      });
    }
    const response = await OrderService.getOrderByUser(userId);
    
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(500).json({
        status: "ERR",
        message: "The order id does not exist",
      });
    }
    const response = await OrderService.getOrderDetail(orderId);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(500).json({
        status: "ERR",
        message: "The order id does not exist",
      });
    }
    const response = await OrderService.cancelOrder(orderId);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getAll = async (req, res) => {
  try {
    const response = await OrderService.getAll();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

module.exports = {
  createOrder,
  getOrderByUser,
  getOrderDetail,
  cancelOrder,
  getAll
};
