const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema(
  {
    vendorId: { type: String, required: true, default: "" },
    logisticCompany: { type: String, required: true, default: "" },
    picture: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/orbit-ad1bb.appspot.com/o/pp.png?alt=media",
    },
    vehicle: { type: String, required: true, default: "" },
    brand: { type: String, required: true, default: "" },
    serviceProvided: [{ type: String }],
    maxWeight: { type: Number, required: true, default: "" },
    pickUpPoint: { type: String, required: true, default: "" },
    dropOffState: [{ type: String }],
    maxDropOffPoints: { type: Number, required: true, default: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true, default: "" },
    price: { type: Number, required: true, default: "" },
    maxBookings: { type: Number, default: 10 },
    currentBookings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
