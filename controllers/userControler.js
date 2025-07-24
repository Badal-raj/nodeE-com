const { userModel } = require("../models/user");
const { generateToken } = require("../middlewares/authToken");
const bcrypt = require("bcryptjs");

const nodemailer = require('nodemailer')

const Jwt = require("jsonwebtoken"); //will create seprate authtoken for forget password

const handleCreateNewUser = async (req, res) => {
  let { userName, email, phoneNo, password } = req.body;
  try {
    const all_users = await userModel.find({});
    if (!userName || !email || !phoneNo || !password) {
      return res
        .status(400)
        .json({ message: "Required fields can't be blank." });
    } else if (
      all_users.length > 0 &&
      all_users.find(
        (data) => data.email === email || data.mobileNo === Number(phoneNo)
      )
    ) {
      return res
        .status(400)
        .json({ message: "Email id or contact no. already exist" });
    } else {
      const result = await userModel.create({
        name: userName,
        email: email,
        mobileNo: phoneNo,
        password: password,
      });
      return res
        .status(201)
        .json({ message: "user register successfully", result: result });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const handleLoginUser = async (req, res) => {
  let { email, phoneNo, password } = req.body;
  try {
    const all_data = await userModel.find({});
    if (all_data.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    if (all_data.length > 0) {
      let findUserIndex = all_data.findIndex((itm) => itm.email === email);

      if (findUserIndex < 0) {
        return res.status(400).json({
          message: "Invalid credentials! userId or password is not correct.",
        });
      } else {
        // Compare the provided password with the stored encrypted password
        const isPasswordValid = await bcrypt.compare(password, all_data[findUserIndex].password);

        if (!isPasswordValid) {
          return res.status(400).json({
            message:
              "password is incorrect.",
          });
        }
        const token = generateToken(all_data[findUserIndex]._id);
        return res.status(200).json({
          message: "login successfully",
          userId: all_data[findUserIndex]._id,
          token: token,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const handleFileUpload = async (req, res) => {
  try {
    const fileUrl = `/uploads/${req.file.filename}`; // URL for the uploaded image

    const user = await userModel.findByIdAndUpdate(req.body.userId, {
      profilePic: fileUrl,
    });
    res.status(200).json({ message: "Profile picture uploaded", result: user });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload image", error: err });
  }
};

//Get user details by user id
const handlUserDetails = async (req, res) => {
  let { user_id } = req.body;
  try {
    const userDeatils = await userModel.findById(user_id);
    if (userDeatils) {
      res
        .status(200)
        .json({
          message: "User detail fetched successfully",
          result: userDeatils,
        });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error! Deails not found" });
  }
};

const handleSendOpt = async (req, res)=>{
 const {email} = req.body
 await userModel.findOne({email: email})
 .then(user=>{
  if(!user){
     res.status(400).json({ Message: "User does not exist" });
  }
  const token =  Jwt.sign( {id: user._id} , 'jwt-secret-token', { expiresIn: "10m" });
   // Send the token to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "harikeshb900@gmail.com",
        pass: "cduf cueg lvql lyiy",
      },
    });

    // Email configuration
    const mailOptions = {
      from: "harikeshb900@gmail.com",
      to: email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
    <p>Click on the following link to reset your password:</p>
    <a href="http://localhost:3000/reset-password/${user._id}/${token}">http://localhost:3000/reset-password/${user._id}/${token}</a>
    <p>The link will expire in 10 minutes.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

     // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json({ message: "Password reset link sent to email." });
    });
 })
}

const handleResetPassword = async (req, res)=>{
 const { id, token } = req.params;
  const { password } = req.body;

  Jwt.verify(token, "jwt-secret-token", async (err, decoded) => {
    if (err) {
      console.log("JWT Verify Error:", err); // log for debugging
      return res.status(400).json({ Status: "Error with token", error: err.message });
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const updatedUser = await userModel.findByIdAndUpdate({ _id: id }, { password: hash });

        res.status(200).json({ message: "Password reset successfully", result: updatedUser });
      } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
      }
    }
  });
}

module.exports = {
  handleCreateNewUser,
  handleLoginUser,
  handleFileUpload,
  handlUserDetails,
  handleSendOpt,
  handleResetPassword,
};
