const express = require("express");
const {
  createReservation,
  getReservations,
  getBorrowedBooks,
  getReservationById,
  updateReservation,
  markReservationAsBorrowed,
  markReservationAsReturned,
  deleteReservation,
} = require("../controllers/reservationController");

const router = express.Router();

router.post("/", createReservation);
router.get("/", getReservations);

// Must be above /:id
router.get("/borrowed", getBorrowedBooks);

router.get("/:id", getReservationById);
router.put("/:id", updateReservation);
router.put("/:id/borrow", markReservationAsBorrowed);
router.put("/:id/return", markReservationAsReturned);
router.delete("/:id", deleteReservation);

module.exports = router;