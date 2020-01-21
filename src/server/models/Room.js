const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  bed_type: {
    type: String,
    required: true
  },
  short_code: {
    type: String,
    required: true
  },
  economy: {
    multipliers: [
      {
        occupants: Number,
        value: Number
      }
    ],
    cost: Number,
    price: Number
  },
  isArchived: {
    type: Boolean,
    default: false
  }
});

module.exports = Room = mongoose.model("room", RoomSchema);
