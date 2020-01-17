const mongoose = require("mongoose");
const mongooseHistory = require("mongoose-diff-history/diffHistory");

const ProductionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  users: {
    admins: [String],
    accounting: [String],
    coordinators: [String]
  },
  reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reservation"
    }
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group"
    }
  ],
  settings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "setting"
  },
  createdAt: {
    date: String,
    user: String
  },
  isArchived: {
    type: Boolean,
    default: false
  }
});

ProductionSchema.plugin(mongooseHistory.plugin);
module.exports = Production = mongoose.model("Production", ProductionSchema);
