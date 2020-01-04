const express = require("express");
const router = express.Router();
const Production = require("../models/Production");
const Reservation = require("../models/Reservation");

// Route: Post
// Description: Create reservation
// Access: Private

router.post("/:production_id", async (req, res) => {
  try {
    // create reservation
    const newReservation = new Reservation({
      group_name: req.body.group_name
    });

    // find production and add the reservation the list of reservations
    Production.findByIdAndUpdate(
      { _id: req.params.production_id },
      { $push: { reservations: [newReservation] } },
      { new: true },
      async (err, production) => {
        if (err) {
          return next(err);
        }
        if (production == null) {
          res.status(404).json({ message: "No tasklist found " });
        }
        newReservation.save(async err => {
          if (err) {
            return next(err);
          }
          res
            .status(201)
            .json({
              message: "Succesfully created reservation!",
              newReservation
            });
        });
      }
    ); //.populate('tasks');
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Route: Put
// Description: Change reservation
// Access: Private

router.put("/:id", async (req, res) => {
  try {
    return res.status(200).json({ status: true, payload: production });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ status: false, message: "Server Error" });
  }
});

// Route: Put
// Description: Remove reservation
// Access: Private

router.put("/:production_id/:reservation_id", async (req, res) => {
  try {
    return res.status(200).json(production);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Route: Get
// Description: Get all reservations
// Access: Private

router.get("/:production_id", async (req, res) => {
  try {
    return res.status(200).json(productions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
