const Reservation = require("../models/Reservation");

const createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("book")
      .populate("member");

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Reservation.find({
      reservationStatus: "Borrowed",
    })
      .populate("book")
      .populate("member");

    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("book")
      .populate("member");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("book")
      .populate("member");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const markReservationAsBorrowed = async (req, res) => {
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        reservationStatus: "Borrowed",
        borrowedDate: new Date(),
        dueDate: dueDate,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("book")
      .populate("member");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const markReservationAsReturned = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        reservationStatus: "Returned",
        returnedDate: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("book")
      .populate("member");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getReservations,
  getBorrowedBooks,
  getReservationById,
  updateReservation,
  markReservationAsBorrowed,
  markReservationAsReturned,
  deleteReservation,
};