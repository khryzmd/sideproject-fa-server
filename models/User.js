const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is Required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile Number is Required"],
  },
  birthdate: {
    type: Date,
    required: [true, "Birthdate is Required"],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  suffix: {
    type: String,
    enum: ['Jr.', 'Sr.', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'Ma.'], // Add any other suffixes you want to allow
    default: null, // Optional default value
  }
});

module.exports = mongoose.model("User", userSchema);
