// Dependencies and Modules
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth.js");
const { errorHandler } = auth;
const mongoose = require("mongoose");

/* Controllers */
module.exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, mobileNo, birthdate, suffix } = req.body;

  // Validate input
  if (!firstName || !lastName || !email || !password || !mobileNo || !birthdate) {
    return res.status(400).send({ error: "All fields are required" });
  }

  if (!email.includes("@") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).send({ error: "Email is invalid" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .send({ error: "Password must be at least 8 characters long" });
  }

  if (!/^\d{11}$/.test(mobileNo)) {
    return res.status(400).send({ error: "Mobile number is invalid" });
  }

  // Validate birthdate
  const birthdateDate = new Date(birthdate);
  if (isNaN(birthdateDate.getTime())) {
    return res.status(400).send({ error: "Birthdate is invalid" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "Email already in use" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 10),
      mobileNo,
      birthdate: birthdateDate,
      suffix, // Added suffix field
    });

    await newUser.save();
    res.status(201).send({ message: "Registered successfully" });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.loginUser = (req, res) => {
  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({ error: "Invalid email" });
  }

  return User.findOne({ email: req.body.email })
    .then((result) => {
      if (!result) {
        return res.status(404).send({ error: "No Email Found" });
      }

      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        result.password
      );

      if (isPasswordCorrect) {
        return res.send({ access: auth.createAccessToken(result) });
      } else {
        return res
          .status(401)
          .send({ error: "Email and password do not match" });
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

// Function to validate email format
function isValidEmail(email) {
  // Use a simple regex for email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports.getProfile = (req, res) => {
  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      } else {
        user.password = ""; // Remove password from response
        return res.status(200).send({
          user: user,
        });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};
