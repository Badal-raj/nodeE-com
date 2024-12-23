const { productModal } = require("../models/product");

const handleAddProduct = async (req, res) => {
  const { name, price, catogry, company, userId } = req.body;
  try {
    if (!name || !userId) {
      return res
        .status(400)
        .json({ message: "Required fields and user Id can't be blank" });
    } else {
      let product = new productModal({ name, price, catogry, company, userId });
      let result = await product.save();
      return res
        .status(201)
        .json({ message: "product saved successfully", result: result });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "something server error !" });
  }
};

const handleAllProduct = async (req, res) => {
  try {
    const allProduct_list = await productModal.find({});
    if (allProduct_list.length > 0) {
      return res.status(200).json({
        result: allProduct_list,
        message: "all product fetched successfully",
      });
    } else {
      return res.status(400).json({ message: "No product found" });
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error! Error fetching users" });
  }
};

const handleDeleteProduct = async (req, res) => {
  const product_id = req.params.id;
  try {
    const deletedProduct = await productModal.findByIdAndDelete(product_id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({
      message: "Product deleted successfully",
      result: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json({ message: "Server error! Failed to delete product" });
  }
};

const handleGetSingleProductById = async (req, res) => {
  try {
    const product = await productModal.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    } else {
      return res
        .status(200)
        .json({ message: "Product details fetched successfully", result: product });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong! Failed to get product" });
  }
};

const handleUpdateProductById = async (req, res) => {
  const { name, price, catogry, company } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Required fields can't be blank" });
    } else {
      const updateProduct = await productModal.findByIdAndUpdate(
        req.params.id,
        {
          name,
          price,
          catogry,
          company,
        }
      );
      if (!updateProduct) {
        return res.status(404).json({ message: "Product not found" });
      } else {
        return res.status(200).json({ message: "Product updated successfully", result: updateProduct });
      }
    }
  } catch (err) {
    console.log("Error updating product:", err);
    return res.status(500).json({ message: "Server error! Failed to update product" || err });
  }
};

const handleSearchProduct = async(req, res) =>{
  const { search } = req.query;

  try {
    const query = {};
    // Dynamically build the search query
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive search for name
        { price: { $regex: search, $options: 'i' } }, // Case-insensitive search for email
      ];
    }

    const searchResult = await productModal.find(query);

    if (!searchResult.length) {
      return res.status(200).json({ message: 'No product result found', result: [] });
    }
    res.status(200).json({ result: searchResult });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

module.exports = {
  handleAddProduct,
  handleAllProduct,
  handleDeleteProduct,
  handleGetSingleProductById,
  handleUpdateProductById,
  handleSearchProduct,
};
