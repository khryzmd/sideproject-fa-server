const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is Required"],
  },
  flightId: {
    type: String,
    required: [true, "Flight ID is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
