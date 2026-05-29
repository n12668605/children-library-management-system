const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    reservationStatus: {
      type: String,
      enum: ["Pending", "Ready for Pickup", "Collected", "Cancelled"],
      default: "Pending",
    },

    reservedDate: {
      type: Date,
      default: Date.now,
    },

    pickupDeadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);