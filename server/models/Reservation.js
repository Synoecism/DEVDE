const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  hotel_name: {
    type: String,
    required: true
  },
  email_address: {
    type: String,
    required: true
  },
  rooms: [
    {
      room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "room"
      },
      availability : [{
          date: Date,
          number: Number
      }]
    }
  ],
  isArchived: {
    type: Boolean,
    default: false
  }
});

module.exports = Reservation = mongoose.model("reservation", ReservationSchema);
