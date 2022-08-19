const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promoCodeSchema = new Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PromoCode", promoCodeSchema);
