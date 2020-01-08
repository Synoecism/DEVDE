const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
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
  status : Boolean,
  isArchived: {
    type: Boolean,
    default: false
  }
});

module.exports = Booking = mongoose.model("booking", BookingSchema);
