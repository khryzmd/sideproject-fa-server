const mongoose = require("mongoose");

// Helper function to generate a random date within a range
const getRandomDate = (start, end) => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date;
};

// Define the schema
const flightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: [true, "Airline is required"],
  },
  departureCity: {
    type: String,
    required: [true, "Departure city is required"],
  },
  destinationCity: {
    type: String,
    required: [true, "Destination city is required"],
  },
  departureDatetime: {
    type: Date,
    default: () => {
      const now = new Date();
      const oneMonthLater = new Date(now);
      oneMonthLater.setMonth(now.getMonth() + 1);
      return getRandomDate(now, oneMonthLater);
    },
  },
  arrivalDatetime: {
    type: Date,
    default: () => {
      const now = new Date();
      const oneMonthLater = new Date(now);
      oneMonthLater.setMonth(now.getMonth() + 1);
      const departureDate = getRandomDate(now, oneMonthLater);
      const arrivalDate = new Date(departureDate);
      arrivalDate.setDate(
        departureDate.getDate() + Math.floor(Math.random() * 10) + 1
      ); // Arrival is between 1 and 10 days after departure
      return arrivalDate;
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  availableSeats: {
    type: Number,
    required: [true, "Available seats are required"],
  },
});

module.exports = mongoose.model("Flight", flightSchema);
