const express = require("express");
const routes = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleware } = require("../middleware/authMiddleware");

routes.get("/get-all", productController.getAllProduct);
routes.post("/create", productController.create);
routes.put("/update/:id", authMiddleware, productController.update);
routes.get("/:id", productController.getDetailsProduct);
routes.delete("/delete/:id", authMiddleware, productController.deleteProduct);

module.exports = routes;
