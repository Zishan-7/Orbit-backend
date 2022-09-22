const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userName: { type: String, required: true, default: "" },
    userId: { type: String, required: true, default: "" },
    vendorId: { type: String, required: true, default: "" },
    pickUpPoint: { type: String, required: true, default: "" },
    dropOffState: [{ type: String }],
    picture: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/orbit-ad1bb.appspot.com/o/pp.png?alt=media",
    },
    // amtDropOffPoints: { type: Number, required: true, default: 1 },
    itemType: { type: String, required: true, default: "" },
    cargoWeight: { type: Number, required: true, default: "" },
    logisticCompany: { type: String, required: true, default: "" },
    vehicle: { type: String, required: true, default: "" },
    brand: { type: String, required: true, default: "" },
    promoCode: { type: String, default: "" },
    promoCodeValue: { type: Number, default: "" },
    date: { type: Date, required: true },
    status: { type: String, required: true, default: "REQUESTED" },
    paymentStatus: { type: String, required: true, default: "PENDING" },
    totalPrice: { type: Number, required: true, default: 0 },
    vendorPrice: { type: Number, required: true, default: 0 },
    adminFee: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
