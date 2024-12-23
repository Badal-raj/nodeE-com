const express = require("express");
const router = express.Router();

const { veriFyAuthToken } = require("../middlewares/authToken");


const {
  handleAddProduct,
  handleAllProduct,
  handleDeleteProduct,
  handleGetSingleProductById,
  handleUpdateProductById,
  handleSearchProduct,
} = require("../controllers/productController");

router.post("/add-product", veriFyAuthToken, handleAddProduct);
router.get("/all-product", veriFyAuthToken, handleAllProduct);
router.delete("/product/:id", veriFyAuthToken, handleDeleteProduct);
router.get("/single-product/:id", veriFyAuthToken, handleGetSingleProductById);
router.patch("/update/:id", veriFyAuthToken, handleUpdateProductById);
router.get("/search-product", veriFyAuthToken, handleSearchProduct);

module.exports = router;
