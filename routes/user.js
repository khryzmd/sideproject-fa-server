// Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user");
const { verify } = require("../auth.js");

// Routing Component
const router = express.Router();

/* Routes */
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getProfile);
//  Export Route System
module.exports = router;
