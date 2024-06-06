const express = require("express");
const routes = express.Router();
const userController = require("../controllers/UserController");
const { authMiddleware } = require("../middleware/authMiddleware");

routes.post("/sign-up", userController.createUser);
routes.post("/sign-in", userController.loginUser);
routes.post("/update-user/:id", userController.updateUser);
routes.post("/delete-user/:id", authMiddleware, userController.deleteUser);

module.exports = routes;
