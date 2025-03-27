const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Sign up request means creating Account
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    //1. If the user already exists
    const user = await User.findOne({ email: email });

    //2. If user exists, sending an error response
    if (user) {
      return res.status(400).send({
        message: "User already exists!!",
        success: false,
      });
    }
    //3.encrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    //4.Create new user, Saving it in DB
    //we can also use create
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).send({
      message: "User created successfully!",
      success: true,
    });
  } catch (error) {
    res.status().send({
      message: error.message,
      success: false,
    });
  }
});

//Login or signin for checking if user is present
router.post("/login", async(req, res) => {
  // console.log("Received Request body", req.body);
  const {email, password} = req.body; 
  try {
    //1. Check if user exists or not
   const user = await User.findOne({email: email}).select("+password");
  //  console.log("User from DB:", user);
   if (!user) {
    return res.status(404).send({
      message: "User does not exist",
      success: false
    });
   } 
  //  console.log("Stored password:", user.password);
    //2. check if the password is correct
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(409).send({
        message: "Incorrect Password!",
        success: false
      });
     } 

    //3. If the user exists and password is correct, assign a JWT
    //authentication token
    const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "1d"});

    res.status(200).send({
      message: "Logged-in successful",
      success: true,
      token: token
    });

  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false
    });
  }

});

module.exports = router;
