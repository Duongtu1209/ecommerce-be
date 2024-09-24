const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./jwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, phone, isAdmin } = newUser;
    try {
      const existUser = await User.findOne({
        email,
      });
      if (existUser !== null) {
        resolve({
          status: "ERR",
          message: "User already exists",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createUser = await User.create({
        name,
        password: hash,
        email,
        phone,
        isAdmin,
      });

      if (createUser) {
        resolve({
          status: "OK",
          message: "User created successfully",
          data: createUser,
        });
      } else {
        resolve({
          status: "ERR",
          message: "There was an error during user creation",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const user = await User.findOne({
        email,
      });
      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user not defined",
        });
      }

      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password or user is incorrect",
        });
      }
      const access_token = await generalAccessToken({
        id: user.id,
        isAdmin: user.isAdmin,
      });

      const refresh_token = await generalRefreshToken({
        id: user.id,
        isAdmin: user.isAdmin,
      });

      resolve({
        status: "OK",
        message: "Login successfully",
        access_token,
        refresh_token,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: id });
      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user does not exist",
        });
      }

      const updateUser = await User.findByIdAndUpdate(id, data, { new: true });

      resolve({
        status: "OK",
        message: "User updated successfully",
        data: updateUser,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: id });
      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user does not exist",
        });
      }

      await User.findByIdAndDelete(id, { new: true });

      resolve({
        status: "OK",
        message: "User deleted successfully",
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();

      resolve({
        status: "OK",
        message: "successfully",
        data: allUser,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: id });
      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "successfully",
        data: user,
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
};
