const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminFeeSchema = new Schema(
  {
    fee: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminFeeSchema", adminFeeSchema);
