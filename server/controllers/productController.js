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
  const { type, description, color, brand, lostTime } = req.body;

  try {
    const newProduct = new Product({
      type,
      description,
      color,
      brand,
      lostTime,
    });
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

// Update a product
async function updateProduct(req, res) {
  const productId = req.params.productId;
  const updateData = req.body;

  try {
    const updatedProduct = await Product.updateProduct(productId, updateData);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Search products based on keywords, lost time, and message
async function searchProducts(req, res) {
  const { keywords, lostTime, message } = req.query;
  try {
    let query = {};

    // Check if keywords are provided
    if (keywords) {
      const keywordArray = keywords.split(',').map((keyword) => keyword.trim());

      query.$and = keywordArray.map((keyword) => ({
        $or: [
          { type: { $regex: new RegExp(keyword, 'i') } },
          { description: { $regex: new RegExp(keyword, 'i') } },
          { color: { $regex: new RegExp(keyword, 'i') } },
          { brand: { $regex: new RegExp(keyword, 'i') } },
        ],
      }));
    }

    // Check if message is provided
    if (message) {
      // This can be incremented to include more stop words, or use a library like stopword (https://www.npmjs.com/package/stopword)
      const stopWords = ['i', 'lost', 'my'];

      const messageWords = message
        .split(' ')
        .map((word) => word.trim())
        .filter((word) => !stopWords.includes(word.toLowerCase())); // Filter out common stop words

      query.$and = query.$and || [];
      query.$and.push({
        $and: messageWords.map((word) => ({
          $or: [
            { type: { $regex: new RegExp(word, 'i') } },
            { description: { $regex: new RegExp(word, 'i') } },
            { color: { $regex: new RegExp(word, 'i') } },
            { brand: { $regex: new RegExp(word, 'i') } },
          ],
        })),
      });
    }

    // Check if lostTime is provided (should check between two dates)
    if (lostTime) {
      const date = new Date(lostTime);
      const twoDaysBefore = new Date(date);
      const twoDaysAfter = new Date(date);

      // Set two days before and two days after (can be a system variable)
      twoDaysBefore.setDate(date.getDate() - 2);
      twoDaysAfter.setDate(date.getDate() + 2);

      // Add date range to the query
      query.lostTime = { $gte: twoDaysBefore, $lte: twoDaysAfter };
    }

    const products = await Product.find(query);

    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  listProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  searchProducts,
};
