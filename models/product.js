const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: String,
  catogry: String,
  company: String,
  userId: {
    type: String,
    required: true,
  },
});

const productModal = mongoose.model("products", productSchema);

module.exports = {
  productModal,
};
