const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    //validating the json webtoken from the header
    //getting the token which comes as [Bearer token]
    const token = req.headers.authorization.split(" ")[1];

    //verfiying the json token
    //this will return us {userId:user._id }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    //adding user id 
    req.body.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.send({
      message: error.message,
      success: false
    });
  }
}