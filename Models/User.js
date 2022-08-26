const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    state: { type: String, required: true },
    companyAddress: { type: String, required: true },
    // phone: { type: Number, required: true },
    profilePic: { type: String, default: "" },
    token: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
