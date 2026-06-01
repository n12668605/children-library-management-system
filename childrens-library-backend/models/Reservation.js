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
      ref: "User",
      required: true,
    },

    reservationStatus: {
      type: String,
      enum: [
        "Pending",
        "Ready for Pickup",
        "Collected",
        "Borrowed",
        "Returned",
        "Cancelled",
      ],
      default: "Pending",
    },

    reservedDate: {
      type: Date,
      default: Date.now,
    },

    pickupDeadline: {
      type: Date,
    },

    borrowedDate: {
      type: Date,
    },

    dueDate: {
      type: Date,
    },

    returnedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);