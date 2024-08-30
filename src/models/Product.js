const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  product_name: String,
  input_image_urls: [String],
  output_image_urls: [String],
  request_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
