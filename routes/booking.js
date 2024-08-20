// Dependencies and Modules
const express = require("express");
const bookingController = require("../controllers/booking");
const { verify, verifyAdmin } = require("../auth.js");

// Routing Component
const router = express.Router();

router.get("/", verify, bookingController.getBookings);
router.post("/makeBooking", verify, bookingController.makeBooking);
router.get("/:bookingId", verify, bookingController.bookingDetail);
router.delete(
  "/cancelBooking/:bookingId",
  verify,
  bookingController.cancelBooking
);
module.exports = router;
