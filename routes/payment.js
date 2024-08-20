// Dependencies and Modules
const express = require("express");
const paymentController = require("../controllers/payment");
const { verify, verifyAdmin } = require("../auth.js");

// Routing Component
const router = express.Router();

/* Routes */
//  Process a new payment
router.post("/makePayment", verify, paymentController.makePayment);

// Retrieve payment details
router.get("/:paymentId", verify, paymentController.getPaymentDetails);

// Retrieve payments associated with a specific booking
router.get(
  "/booking/:bookingId",
  verify,
  paymentController.getPaymentsByBooking
);

// Export Route System
module.exports = router;
