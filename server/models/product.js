const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    type: String,
    brand: String,
    color: String,
    description: String,
    lostTime: Date,
    status: { type: String, enum: ['lost', 'found', 'claimed'], default: 'lost' },
    updatedTime: {
      type: Date,
      default: null,
    },
  });

  // Automatically update the updatedTime field
  productSchema.statics.updateProduct = async function (productId, updateData) {
    try {
      const updatedProduct = await this.findByIdAndUpdate(
        productId,
        { ...updateData, updatedTime: new Date() },
        { new: true }
      );
  
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  };
  

module.exports = mongoose.model('Product', productSchema);