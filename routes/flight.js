// Dependencies and Modules
const express = require("express");
const flightController = require("../controllers/flight");
const { verify, verifyAdmin } = require("../auth.js");

// Routing Component
const router = express.Router();

/* Routes */

// Adding flight (admin only)
router.post("/addFlight", verify, verifyAdmin, flightController.addFlight);

// Getting all flights
router.get("/getAllFlights", flightController.getAllFlights);

// Getting flight details
router.get("/getFlightDetails/:flightId", flightController.getFlightsDetail);

// Updating flight (admin only)
router.patch(
  "/updateFlight/:flightId",
  verify,
  verifyAdmin,
  flightController.updateFlight
);

// Deleting flight (admin only)
router.delete(
  "/deleteFlight/:flightId",
  verify,
  verifyAdmin,
  flightController.deleteFlight
);

// Searching flights
router.post("/search-flights", flightController.searchFlight);

// Export Route System
module.exports = router;
