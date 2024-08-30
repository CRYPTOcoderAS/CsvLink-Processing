const cloudinary = require('../utils/cloudinary');
const sharp = require('sharp');
const axios = require('axios');
const { Readable } = require('stream');
const { sendWebhookNotification } = require('./webhookService');

const downloadImage = async (url) => {
  try {
    const response = await axios({
      url,
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    throw new Error(`Error downloading image from ${url}`);
  }
};

const compressImage = async (buffer) => {
  try {
    return sharp(buffer)
      .resize({ width: 800 }) 
      .jpeg({ quality: 50 }) 
      .toBuffer();
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Error compressing image');
  }
};

const uploadToCloudinary = async (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { public_id: publicId, folder: 'csv-processing' },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

const processImages = async (productId, imageUrls, webhookUrl) => {
  try {
    const processedImageUrls = await Promise.all(imageUrls.map(async (url) => {
      try {
        const imageBuffer = await downloadImage(url);
        const compressedBuffer = await compressImage(imageBuffer);
        const publicId = `${productId}/${Date.now()}`; 
        return uploadToCloudinary(compressedBuffer, publicId);
      } catch (error) {
        console.error(`Error processing image ${url}:`, error);
        return null; 
      }
    }));

    const validUrls = processedImageUrls.filter(url => url !== null);
    
    if (webhookUrl) {
      await sendWebhookNotification(webhookUrl, {
        productId,
        processedImageUrls: validUrls
      });
    }

    return validUrls;
  } catch (error) {
    console.error('Error processing images:', error);
    return [];
  }
};

module.exports = {
  processImages,
};
