import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

//Register Controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, answer, phone, address } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone No. is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }

    //Check user
    const existingUser = await userModel.findOne({ email: email });

    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User is Already Registered. Please Login",
      });
    }

    //Register user
    const hashedPassword = await hashPassword(password);

    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registeration",
      error,
    });
  }
};

//Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Email is not registered" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res
        .status(404)
        .send({ success: false, message: "Invalid Password" });
    }

    //token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Loging in.",
      error,
    });
  }
};

//Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is Required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "Answer is Required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "New Password is Required" });
    }

    //Check email and answer
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      res
        .status(404)
        .send({ success: false, message: "Wrong email or Answer" });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res
      .status(200)
      .send({ success: true, message: "Password reset Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong.",
      error,
    });
  }
};

//Test controller
export const testController = (req, res) => {
  res.send("Protected Router");
};
