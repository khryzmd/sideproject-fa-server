// Dependencies
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { errorHandler } = require("../auth");

/* Process a new payment */
module.exports.makePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const amount = booking.price;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "php",
      payment_method: "pm_card_visa",
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    const payment = new Payment({
      bookingId: req.body.bookingId,
      amount,
      paymentMethodId: paymentIntent.payment_method,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });

    await payment.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

/* Retrieve payment details */
module.exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({ paymentIntentId: paymentId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

/* Retrieve payments associated with a specific booking */
module.exports.getPaymentsByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payments = await Payment.find({ bookingId });

    if (payments.length === 0) {
      return res
        .status(404)
        .json({ message: "No payments found for this booking" });
    }

    res.status(200).json(payments);
  } catch (error) {
    errorHandler(error, req, res);
  }
};
