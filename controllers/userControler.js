const { userModel } = require("../models/user");
const { generateToken } = require("../middlewares/authToken");

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
      let findUserIndex = all_data.findIndex(
        (itm) => itm.email === email && itm.password === password
      );

      if (findUserIndex < 0) {
        return res.status(400).json({
          message: "Invalid credentials! userId or password is not correct.",
        });
      } else {
        const token = generateToken({ id: all_data[findUserIndex]._id });

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
    
    const user = await userModel.findByIdAndUpdate(
      req.body.userId,
      { profilePic: fileUrl }
    );
    res.status(200).json({ message: "Profile picture uploaded", result: user });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload image", error: err });
  }
};

//Get user details by user id
const handlUserDetails = async(req, res) =>{
  let { user_id } = req.body;
  try{
    const userDeatils = await userModel.findById(user_id);
    if(userDeatils){
      res.status(200).json({message:"User detail fetched successfully", result: userDeatils })
    }else{
      res.status(400).json({message:"User not found"})
    }
    
  }catch(err){
    res.status(500).json({ message: 'Error! Deails not found' });
  }
}

module.exports = {
  handleCreateNewUser,
  handleLoginUser,
  handleFileUpload,
  handlUserDetails,
};
