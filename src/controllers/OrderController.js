const { isSet } = require("util/types");
const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      subTotal,
      shippingAddress,
      discountAmount,
      grandTotal,
      shippingFee,
    } = req.body;
    if (
      isSet(paymentMethod) ||
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

module.exports = {
  createOrder,
};
