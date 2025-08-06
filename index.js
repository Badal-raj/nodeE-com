require('dotenv').config(); // Load .env variables
const express = require("express");
const path = require('path');
const cors = require("cors")

const { connectMongoDB } = require("./db/connection");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

const app = express();
const MONGO_DB_URL = process.env.NODE_APP_MONGODB_URL
const PORT = process.env.NODE_APP_PORT || 8001

//middleware to parse incoming Request Object if object, with nested objects, or generally any type.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')), (req,res, next)=>{
  console.log('Serving file:', req.url); // Log every file request
  next();
});

app.use(cors());

connectMongoDB(MONGO_DB_URL)
  .then(() => console.log("mongodab connected successfully"))
  .catch((err) => console.log("mongo connection error", err));

app.use("/api", userRouter);
app.use("/api", productRouter)

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
