const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    author: {
      type: String,
      required: true
    },

    isbn: {
      type: String,
      required: true,
      unique: true
    },

    category: {
      type: String,
      required: true
    },

    ageRange: {
      type: String,
      required: true
    },

    copies: {
      type: Number,
      required: true,
      default: 1
    },

    availableCopies: {
      type: Number,
      required: true,
      default: 1
    },

    description: {
      type: String
    },

    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);