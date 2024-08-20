// Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const flightRoutes = require("./routes/flight");
const bookingRoutes = require("./routes/booking");
const paymentRoutes = require("./routes/payment");

// Environment Setup
require("dotenv").config();

// Server setup
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);

// Backend Routes
app.use("/users", userRoutes);
app.use("/flights", flightRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);

// Server Gateway Response
app.listen(process.env.PORT || 4000, () =>
  console.log(`API is now online on port ${process.env.PORT || 4000}`)
);
