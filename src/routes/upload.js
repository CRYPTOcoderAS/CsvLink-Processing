const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const Request = require('../models/Request');
const Product = require('../models/Product');
const imageService = require('../services/imageService');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const request_id = uuidv4();
    
    const request = new Request({ request_id, status: 'processing' });
    await request.save();

    const results = [];
    fs.createReadStream(file.path)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        await Promise.all(results.map(async (row) => {
          const { 'Product Name': product_name, 'Input Image Urls': input_image_urls } = row;
          const inputUrls = input_image_urls.split(',');

          const product = new Product({
            product_name,
            input_image_urls: inputUrls,
            request_id,
          });
          await product.save();

          const outputUrls = await imageService.processImages(product._id.toString(), inputUrls);

          product.output_image_urls = outputUrls;
          await product.save();
        }));

        request.status = 'completed';
        await request.save();

        res.status(200).json({ request_id });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
