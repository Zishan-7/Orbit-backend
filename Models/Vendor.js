const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vendorSchema = new Schema(
  {
    companyName: { type: String, required: true },
    servicesProvided: [],
    email: { type: String, required: true },
    personInCharge: { type: String, default: "" },
    profilePic: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/orbit-ad1bb.appspot.com/o/pp.png?alt=media",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
