const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  group_name: {
    type: String,
    required: true
  },
  occupancy: [{
      room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "room"
      },
      check_in_date : Date,
      check_out_date : Date,
      occupants : [String],
      cost_center : String,
      confirmation_number : String,
      discount : Number,
      comment : String
  }],
  status : {
      group : Boolean,
      hotel : Boolean,
      accounting : Boolean
  },
  log: {
    type: [String],
    required: true
  },
  isArchived: {
    type: Boolean,
    default: false
  }
});

module.exports = Reservation = mongoose.model("reservation", ReservationSchema);
