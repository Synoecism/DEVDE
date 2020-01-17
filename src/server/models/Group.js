const mongoose = require("mongoose");
const mongooseHistory = require("mongoose-diff-history/diffHistory");

const GroupSchema = new mongoose.Schema({
  group_name: {
    type: String,
    required: true
  },
  bookings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking"
  },
  status : {
      group : Boolean,
      accounting : Boolean
  }
});

GroupSchema.plugin(mongooseHistory.plugin);
module.exports = Group = mongoose.model("group", GroupSchema);
