const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
//create user register user
exports.registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //Validation
    if (!username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please Fill all fields",
      });
    }

    //เช็ค User
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        success: false,
        message: "user already exisits",
      });
    }
    //hash PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // SAVE NEW USER
    const user = new userModel({ username, email, password: hashedPassword });
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Created Your User",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "errror",
      success: false,
      error,
    });
  }
};

//get all users
exports.getAllUsers = async (req, res) => {};

//login
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //VALIDATION
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "email is not registerd",
      });
    }

    //PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invlid username or password",
      });
    }
    // ถ้ารหัสตรงกัน
    return res.status(200).send({
      success: true,
      messgae: "login successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Login Callcback",
      error,
    });
  }
};
