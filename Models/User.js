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
    profilePic: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/orbit-ad1bb.appspot.com/o/blank-profile-picture-ge13eef4ee_1280.png?alt=media",
    },
    token: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    pushToken: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
