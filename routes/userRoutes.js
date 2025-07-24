const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const app = express();

// Set up multer disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Folder where the file will be stored
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
    },
  });
  
  // Create multer instance with storage configuration
  const upload = multer({ storage: storage });

const { 
  handleCreateNewUser, 
  handleLoginUser, 
  handleFileUpload, 
  handlUserDetails,
  handleSendOpt,
  handleResetPassword,
} = require("../controllers/userControler");

router.post("/create", handleCreateNewUser );
router.post("/login", handleLoginUser);
router.post("/upload", upload.single('profilePic'), handleFileUpload);
router.post("/profile", handlUserDetails);
router.post('/forget-password', handleSendOpt);
router.post('/reset-password/:id/:token', handleResetPassword)

module.exports = router;