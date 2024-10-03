const express = require("express");
const routes = express.Router();
const userController = require("../controllers/UserController");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

routes.get("/get-all", authMiddleware, userController.getAllUser);
routes.post("/refresh-token", userController.refreshToken);
routes.post("/sign-up", userController.createUser);
routes.post("/sign-in", userController.loginUser);
routes.post("/logout", userController.logoutUser);
routes.post('/delete-many',authMiddleware, userController.deleteMany)
routes.put("/update-user/:id", authUserMiddleware, userController.updateUser);
routes.delete("/delete-user/:id", authMiddleware, userController.deleteUser);
routes.get("/get-details/:id", authUserMiddleware, userController.getDetailsUser);

module.exports = routes;
