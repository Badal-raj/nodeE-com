const express = require("express");
const path = require('path');
const cors = require("cors")

const { connectMongoDB } = require("./db/connection");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

const app = express();
const PORT = 8001;

//middleware to parse incoming Request Object if object, with nested objects, or generally any type.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')), (req,res, next)=>{
  console.log('Serving file:', req.url); // Log every file request
  next();
});

app.use(cors());

connectMongoDB("mongodb://127.0.0.1:27017/e-commarce")
  .then(() => console.log("mongodab connected successfully"))
  .catch((err) => console.log("mongo connection error", err));

app.use("/api", userRouter);
app.use("/api", productRouter)

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
