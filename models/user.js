const mongoose = require("mongoose");

//***************create user schema for registration*************************//
const userScemna = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          //email validation using a regular expression
          const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return regex.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    mobileNo: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          // Mob no validation (example format: +1-555-555-5555 or 5555555555)
          const regex = /^[0-9]{10}$/; // Allows only 10 digits, no special characters
          return regex.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: ''
    },
  },
  { timestamps: true }
);

userScemna.set("toJSON", {
  // Exclude the password from the response when the user document is converted to JSON
  transform: (doc, ret) => {
    delete ret.password; // This removes the password from the returned object
    return ret;
  },
});
const userModel = mongoose.model("users", userScemna); //Create user modal

userScemna.set("toJSON", {
  // Exclude the password from the response when the user document is converted to JSON
  transform: (doc, ret) => {
    delete ret.password; // This removes the password from the returned object
    return ret;
  },
});
//const userLoginModel = mongoose.model("users", userScemna); //Create user modal

module.exports = {
  userModel,
};
