const mongoose = require("mongoose");

const HoldSchema = new mongoose.Schema({
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
  log: {
    type: [String],
    required: true
  },
  isArchived: {
    type: Boolean,
    default: false
  }
});

module.exports = Hold = mongoose.model("hold", HoldSchema);
