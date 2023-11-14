const Product = require('../models/product');

// List all products
async function listProducts(req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Create a new product
async function createProduct(req, res) {
  const { name, description, color, brand, lostTime } = req.body;

  try {
    const newProduct = new Product({ name, description, color, brand, lostTime });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Delete a product
async function deleteProduct(req, res) {
  const productId = req.params.productId;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(deletedProduct);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { listProducts, createProduct, deleteProduct };