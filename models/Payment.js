const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: [true, "Booking ID is Required"],
  },
  paymentDatetime: {
    type: Date,
    default: () => new Date(),
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  paymentMethodId: {
    type: String,
    required: [true, "Payment Method ID is required"],
  },
  paymentIntentId: {
    type: String,
    required: [true, "Payment Intent ID is required"],
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed'],
    default: 'pending',
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
