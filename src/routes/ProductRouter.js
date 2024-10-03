const express = require("express");
const routes = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleware } = require("../middleware/authMiddleware");

routes.get("/get-all", productController.getAllProduct);
routes.post("/create", productController.create);
routes.get("/get-all-type", productController.getAllType);
routes.put("/update/:id", authMiddleware, productController.update);
routes.get("/get-details/:id", productController.getDetailsProduct);
routes.delete("/delete/:id", authMiddleware, productController.deleteProduct);
routes.post('/delete-many',authMiddleware, productController.deleteMany)

module.exports = routes;
