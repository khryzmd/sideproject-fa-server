// Dependencies and Modules
const Booking = require("../models/Booking");
const Flight = require("../models/Flight");
const { errorHandler } = require("../auth");

module.exports.getBookings = (req, res) => {
  const userId = req.user.id;

  return Booking.find({ userId: userId }) // Find bookings associated with the logged-in user
    .then((bookings) => {
      if (!bookings || bookings.length === 0) {
        return res.status(404).send({ message: "No bookings found" });
      }
      return res.status(200).send({ bookings: bookings });
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.makeBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { flightId } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    const flightPrice = flight.price;

    const newBooking = new Booking({
      userId,
      flightId,
      price: flightPrice,
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json(savedBooking);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.bookingDetail = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by its ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by its ID and delete it
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
