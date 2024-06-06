const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res) => {
  const token = req.headers.token.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        status: "ERR",
        message: "The authentication",
      });
    }
    const { payload } = user;

    if (payload.isAdmin) {
      next();
    } else {
      return res.status(404).json({
        status: "ERR",
        message: "The authentication",
      });
    }
  });
};

module.exports = {
  authMiddleware,
};