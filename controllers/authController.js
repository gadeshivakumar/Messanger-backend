const User = require('../models/chatSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).send("Phone and password required");
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).send("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Invalid Credentials");
    }

    req.phone = phone;

    const token = jwt.sign(
      { phone },
      process.env.Secret_key,
      { expiresIn: "50d" }
    );

    res.cookie("token", token, {
      maxAge: 50 * 24 * 60 * 60 * 1000,
      secure: true,
      // httpOnly: process.env.NODE_ENV==="production",
      // secure: process.env.NODE_ENV==="production",
      sameSite: "none",
    });

    return res.status(200).send({
      message:'success',
      user:{
        username:user.username,
        token,token,
        phone:user.phone
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).send("Internal Server Error");
  }
};


const signup = async (req, res) => {
  try {
    const { username, password, phone } = req.body;

    if (!username || !password || !phone) {
      return res.status(400).send("All fields are required");
    }

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      phone,
      contacts: [],
      message: []
    });

    await user.save();

    return res.status(201).send("Successfully registered");
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).send("Cannot register user. Try again");
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      // httpOnly: process.env.NODE_ENV === "production",
      // secure: process.env.NODE_ENV === "production",
      secure:true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).send("Logout failed");
  }
};


const islogin = async (req, res) => {
  try {
    if (req.phone && req.cookies?.token) {
      const user=await User.findOne({phone:req.phone});
      if(!user) return res.status(401).send({
        message:"Not logged in"
      })
      return res.status(200).json({ 
            username:user.username,
            phone:user.phone,
            token:req.cookies?.token,
            message:"success"     
       });
    }
    return res.status(401).send("Not logged in");
  } catch (err) {
    console.error("IsLogin Error:", err);
    return res.status(500).send("Something went wrong");
  }
};

module.exports = { login, signup, logout, islogin };
