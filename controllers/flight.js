// Dependencies and Modules
const Flight = require("../models/Flight");
const { errorHandler } = require("../auth");

/* Controllers */

// function for adding flights
module.exports.addFlight = (req, res) => {
  const {
    airline,
    departureCity,
    destinationCity,
    departureDatetime,
    arrivalDatetime,
    price,
    availableSeats,
  } = req.body;

  const newFlight = new Flight({
    airline,
    departureCity,
    destinationCity,
    departureDatetime: departureDatetime
      ? new Date(departureDatetime)
      : undefined,
    arrivalDatetime: arrivalDatetime ? new Date(arrivalDatetime) : undefined,
    price,
    availableSeats,
  });

  return newFlight
    .save()
    .then((savedFlight) => {
      if (savedFlight) {
        return res.status(201).send({
          message: "Flight added successfully!",
          savedFlight,
        });
      } else {
        return res.status(400).send({
          error: "Error saving the flight",
        });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// function for getting all flights
module.exports.getAllFlights = (req, res) => {
  return Flight.find()
    .then((flights) => {
      if (!flights || flights.length === 0) {
        return res.status(404).send({
          error: "No flights found",
        });
      } else {
        return res.status(200).send(flights);
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// function for getting flight details
module.exports.getFlightsDetail = (req, res) => {
  const flightId = req.params.flightId;

  Flight.findById(flightId)
    .then((flight) => {
      if (flight) {
        return res.status(200).send(flight);
      } else {
        return res.status(404).send({
          error: "Flight not found",
        });
      }
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
};

// function for updating flights (admin only)
module.exports.updateFlight = (req, res) => {
  const flightId = req.params.flightId;
  const { airline, departureCity, destinationCity, price, availableSeats } =
    req.body;

  const updateData = {
    airline,
    departureCity,
    destinationCity,
    price,
    availableSeats,
  };

  Flight.findByIdAndUpdate(flightId, updateData, { new: true })
    .then((updatedFlight) => {
      if (!updatedFlight) {
        return res.status(404).send({
          error: "Flight not found",
        });
      }
      return res.status(200).send({
        message: "Flight updated successfully!",
        updatedFlight,
      });
    })
    .catch((error) => errorHandler(error, req, res));
};

// function to delete flights (admin only)
module.exports.deleteFlight = (req, res) => {
  const flightId = req.params.flightId;

  Flight.findByIdAndDelete(flightId)
    .then((flightFound) => {
      if (!flightFound) {
        return res.status(404).send({
          error: "Flight not found!",
        });
      }
      return res.status(200).send({ message: "Flight Deleted Successfully" });
    })
    .catch((error) => errorHandler(error, req, res));
};

// Function to search flights
module.exports.searchFlight = (req, res) => {
  const { departureCity, destinationCity, arrivalDatetime, availableSeats } =
    req.body;

  // Initialize an empty query object
  const query = {};

  // Conditionally add properties to the query object
  if (departureCity) {
    query.departureCity = new RegExp(departureCity, "i");
  }

  if (destinationCity) {
    query.destinationCity = new RegExp(destinationCity, "i");
  }

  if (arrivalDatetime) {
    // Ensure arrivalDatetime is a valid date
    const arrivalDate = new Date(arrivalDatetime);
    if (!isNaN(arrivalDate.getTime())) {
      query.arrivalDatetime = { $gte: arrivalDate };
    }
  }

  if (availableSeats) {
    // Ensure availableSeats is a valid number
    const seats = parseInt(availableSeats, 10);
    if (!isNaN(seats)) {
      query.availableSeats = { $gte: seats };
    }
  }

  console.log("Search Query:", query);

  Flight.find(query)
    .then((flightFound) => {
      console.log("Flights Found:", flightFound.length);
      return res.status(200).send(flightFound);
    })
    .catch((error) => errorHandler(error, req, res));
};
