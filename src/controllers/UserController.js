const UserService = require("../services/UserService");
const JwtService = require("../services/jwtService");

const createUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password || !confirmPassword) {
      return res.json({
        status: "ERR",
        message: "This field is a required field",
      });
    } else if (!isCheckEmail) {
      return res.json({
        status: "ERR",
        message: "Email must be a valid email",
      });
    } else if (password !== confirmPassword) {
      return res.json({
        status: "ERR",
        message: "Confirm password not match",
      });
    }

    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res.json({
        status: "ERR",
        message: "This field is a required field",
      });
    } else if (!isCheckEmail) {
      return res.json({
        status: "ERR",
        message: "The email must be a valid email",
      });
    }

    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;    
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict'
    });

    return res.status(200).json(newResponse);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const { name, email, password, confirmPassword, phone, oldPassword } =
      req.body;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const isCheckEmail = reg.test(email);
    const isCheckPhone = phoneno.test(phone);
    if (!userId) {
      return res.json({
        status: "ERR",
        message: "The user does not exist",
      });
    } else if (!name || !email || !password || !confirmPassword || !phone) {
      return res.json({
        status: "ERR",
        message: "This field is a required field",
      });
    } else if (!isCheckEmail) {
      return res.json({
        status: "ERR",
        message: "Email must be a valid email",
      });
    } else if (password !== confirmPassword) {
      return res.json({
        status: "ERR",
        message: "Confirm password not match",
      });
    } else if (!isCheckPhone) {
      return res.json({
        status: "ERR",
        message:
          "Phone number must be 10 characters long and must be a numeric string",
      });
    }

    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.json({
        status: "ERR",
        message: "The user does not exist",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getDetailsUser = async (req, res) => {
  try {    
    const userId = req.params.id;        
    if (!userId) {
      return res.json({
        status: "ERR",
        message: "The user does not exist",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const refreshToken = async (req, res) => {    
  try {    
    const token = req.cookies.refresh_token;
    if (!token) {
      return res.json({
        status: "ERR",
        message: "The authentication",
      });
    }
    const response = await JwtService.refreshToken(token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const logoutUser = async (req, res) => {
  
  try {
    res.clearCookie('refresh_token')

    return res.status(200).json({
      status: 'OK',
      message: 'Logout successfully'
    });
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
  logoutUser
};
