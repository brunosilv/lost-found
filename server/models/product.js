const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    type: String,
    brand: String,
    color: String,
    description: String,
    lostTime: Date,
    status: { type: String, enum: ['lost', 'found', 'claimed'], default: 'lost' },
  });

module.exports = mongoose.model('Product', productSchema);