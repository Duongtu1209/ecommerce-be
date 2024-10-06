const express = require("express");
const routes = express.Router();
const orderController = require("../controllers/OrderController");
const { authUserMiddleware } = require("../middleware/authMiddleware");

routes.post("/create", authUserMiddleware, orderController.createOrder);

module.exports = routes;
