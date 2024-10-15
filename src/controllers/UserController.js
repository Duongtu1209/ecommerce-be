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
        message: "The email must be a valid email",
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

const createUserByAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = reg.test(email);
     if (!isCheckEmail) {
      return res.json({
        status: "ERR",
        message: "The email must be a valid email",
      });
    } 
    const response = await UserService.createUserByAdmin(req.body);
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
        
    if (!userId) {
      return res.json({
        status: "ERR",
        message: "The userId is required"
      })
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

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.json({
        status: "ERR",
        message: "The user does not exist",
      });
    }
    const response = await UserService.deleteMany(ids);
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

const handleChangePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.params.id;
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      status: "ERR",
      message: "New password and confirmation do not match",
    });
  }

  try {
    const response = await UserService.changePassword(userId, oldPassword, newPassword);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
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
  logoutUser,
  deleteMany,
  createUserByAdmin,
  handleChangePassword
};
