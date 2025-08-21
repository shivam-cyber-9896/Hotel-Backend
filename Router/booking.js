const express = require("express");
const { addBooking, getBookings } = require("../controller/bookingController");

const router = express.Router();

// Create a booking
router.post("/bookdone", addBooking);

// Get all bookings
router.get("/bookshow", getBookings);

module.exports = router;
