const express = require("express");
const routes = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleware } = require("../middleware/authMiddleware");

routes.post("/create", productController.create);
routes.put("/update/:id", authMiddleware, productController.update);
routes.get("/:id", productController.getDetailsProduct);
routes.delete("/delete/:id", authMiddleware, productController.deleteProduct);
routes.get("", productController.getAllProduct);

module.exports = routes;
