const router = require("express").Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware");
require("dotenv").config();
const cloudinary = require("../cloudinary");

//GET details of current logged-in user
router.get("/get-logged-user", authMiddleware, async (req, res) => {
  try {
    //matching by user id which we have passed in the authMiddleWare
    const user = await User.findOne({ _id: req.body.userId });

    res.status(200).send({
      message: "User fetched successfully!",
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

//Getting details of all user except loggedin user
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    //finding all users excluding currently logged in user
    const userId= req.body.userId;
    const allUsers = await User.find({_id: {$ne: userId}});

    res.status(200).send({
      message: "All users fetched successfully!",
      success: true,
      data: allUsers
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});


//Updating the Profile Picture
router.post("/upload-profile-pic",authMiddleware, async (req, res) => {
  try {
    const image = req.body.image;
    //Upload the image to cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "quick-chat"
    });
    //update the user model and set the profile pic property
   const user = await User.findByIdAndUpdate(
      {_id: req.body.userId},
      {profilePic: uploadedImage.secure_url},
      {new: true}
    );
    res.send({
      message: "Profile picture uploaded Successfully",
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false
    });
  }
});


module.exports = router;
