const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  group_name: {
    type: String,
    required: true
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking"
  }],
  status : {
      group : Boolean,
      accounting : Boolean
  }
});

module.exports = Group = mongoose.model("group", GroupSchema);
