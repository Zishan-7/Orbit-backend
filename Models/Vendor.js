const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vendorSchema = new Schema(
  {
    companyName: { type: String, required: true },
    servicesProvided: [],
    email: { type: String, required: true },
    personInCharge: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
