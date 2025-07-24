const mongoose = require("mongoose");

const ForgetPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
   // expireIn: Number,
  },
  { timestamps: true }
);

const ForgetPasswordModal = mongoose.model("otp", ForgetPasswordSchema);

module.exports = {
  ForgetPasswordModal,
};
