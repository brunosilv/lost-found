const express = require('express');

const router = express.Router();

const { productController } = require('../controllers');
const authenticateAgent = require('../middleware/authenticateAgent');

// List products
router.get('/', authenticateAgent, productController.listProducts);

// Create a new product
router.post('/', authenticateAgent, productController.createProduct);

// Update a product
router.put('/:productId', authenticateAgent, productController.updateProduct);

// Delete a product
router.delete('/:productId', authenticateAgent, productController.deleteProduct);

module.exports = router;