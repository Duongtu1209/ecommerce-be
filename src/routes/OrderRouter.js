const express = require("express");
const routes = express.Router();
const orderController = require("../controllers/OrderController");
const { authUserMiddleware, authMiddleware} = require("../middleware/authMiddleware");

routes.post("/create", authUserMiddleware, orderController.createOrder);
routes.get(
  "/get-order-by-user/:id",
  authUserMiddleware,
  orderController.getOrderByUser
);

routes.get(
  "/get-order-detail/:id",
  authUserMiddleware,
  orderController.getOrderDetail
);

routes.get(
    "/get-all",
    authMiddleware,
    orderController.getAll
);

routes.delete(
    "/cancel-order/:id",
    authUserMiddleware,
    orderController.cancelOrder
);



module.exports = routes;