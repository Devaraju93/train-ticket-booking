const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, JWT_SECRET);
  req.userId = decoded.userId;
  next();
};

router.post("/reserve", async (req, res) => {
  const { seatsRequested } = req.body;
  const userId = req.userId;

  // Check if requested seats are valid (between 1 and 7)
  if (seatsRequested < 1 || seatsRequested > 7) {
    return res
      .status(400)
      .json({ error: "You can only reserve up to 7 seats at a time." });
  }

  // Find all available seats, ordered by row and seat number
  const allAvailableSeats = await prisma.seat.findMany({
    where: { isReserved: false },
    orderBy: [{ rowNumber: "asc" }, { seatNumber: "asc" }],
  });

  let seatsToReserve = [];
  let seatsReserved = [];

  // Try to find up to 7 seats in the same row
  for (let i = 0; i < allAvailableSeats.length; i++) {
    // Collect available seats in the current row
    let rowSeats = allAvailableSeats.filter(
      (seat) => seat.rowNumber === allAvailableSeats[i].rowNumber
    );

    if (rowSeats.length >= seatsRequested) {
      // Reserve the seats in the row
      seatsToReserve = rowSeats.slice(0, seatsRequested);
      seatsReserved = await prisma.seat.updateMany({
        where: { id: { in: seatsToReserve.map((seat) => seat.id) } },
        data: { isReserved: true, userId },
      });
      break;
    }
  }

  // If not enough seats were found in one row, try to reserve from nearby rows
  if (seatsReserved.length === 0) {
    for (let i = 0; i < allAvailableSeats.length; i++) {
      // Find and reserve nearby seats (not necessarily in the same row)
      let availableSeats = allAvailableSeats.filter(
        (seat) => seat.isReserved === false
      );
      if (availableSeats.length >= seatsRequested) {
        seatsToReserve = availableSeats.slice(0, seatsRequested);
        seatsReserved = await prisma.seat.updateMany({
          where: { id: { in: seatsToReserve.map((seat) => seat.id) } },
          data: { isReserved: true, userId },
        });
        break;
      }
    }
  }

  // Add endpoint to get seat statistics
  router.get("/stats", async (req, res) => {
    const totalSeats = await prisma.seat.count();
    const bookedSeats = await prisma.seat.count({
      where: { isReserved: true },
    });
    const availableSeats = totalSeats - bookedSeats;

    res.json({ totalSeats, bookedSeats, availableSeats });
  });

  // Add endpoint to reset seat reservations
  router.post("/reset", async (req, res) => {
    await prisma.seat.updateMany({
      data: { isReserved: false, userId: null },
    });
    res.json({ message: "All seats have been reset." });
  });

  // If we couldn't reserve enough seats, return an error
  if (seatsReserved.length < seatsRequested) {
    return res
      .status(400)
      .json({ error: "Not enough seats available to reserve." });
  }

  res.json({ message: "Seats reserved successfully.", seats: seatsReserved });
});

router.get("/layout", async (req, res) => {
  const seats = await prisma.seat.findMany({
    orderBy: [{ rowNumber: "asc" }, { seatNumber: "asc" }],
  });
  res.json(seats);
});

module.exports = router;
