const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

//key for creating and verifying the user
const JWT_SECRET = "Harryisgoodboy$";

//Route 1:Create a user using:POST "/api/auth/createUser". Doesnt require Auth. no login required
router.post(
  "/createuser",
  [
    body("name", "Enter a Valid Name").isLength({ min: 5 }),
    body("email", "Enter a Valid email").isEmail(),
    body("password", "Enter Valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    //check whether the email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success: false, error: "Sorry a user with this email already exists" });
      }

      //salt creating for password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      //creating user
      const data = {
        user: {
          id: user.id,
        },
      };
      //token banana for user
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ success: true, authtoken });
    } catch (error) {
      //error catching
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route 2: Authenticate a User using POST "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a Valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          error: "Please try to login with correct credentials" 
        });
      }
      
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ 
          success: false, 
          error: "Please try to login with correct credentials" 
        });
      }
      
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ success: true, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route 3:Get loggedin User Details using:POST "/api/auth/getuser".Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;