const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

// Encrypt password before saving to the database
userScemna.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only encrypt if password is modified
  try {
    const salt = await bcrypt.genSalt(10); // generate salt
    this.password = await bcrypt.hash(this.password, salt); // hash password
    next();
  } catch (err) {
    next(err);
  }
});

userScemna.set("toJSON", {
  // Exclude the password from the response when the user document is converted to JSON
  transform: (doc, ret) => {
    delete ret.password; // This removes the password from the returned object
    return ret;
  },
});
const userModel = mongoose.model("users", userScemna); //Create user modal

module.exports = {
  userModel,
};
