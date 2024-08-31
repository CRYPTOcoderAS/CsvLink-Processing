# Technical Design Document: Image Processing with Webhook Integration

## Project Overview

This document details the design and implementation of a Node.js service that processes images from URLs provided in a CSV file, compresses them, uploads them to Cloudinary, and triggers a webhook once all images are processed. The project consists of three main components: image processing, Cloudinary integration, and webhook notification.

---

## 1. **System Architecture**

### 1.1 Components
- **Node.js Application**: Core service handling image processing, integration with Cloudinary, and triggering webhooks.
- **Cloudinary**: External cloud service for storing and serving processed images.
- **Webhook Receiver**: External endpoint that receives notifications after the image processing is completed.

### 1.2 High-Level Flow
1. **CSV Upload**: The user uploads a CSV file containing image URLs.
2. **Image Processing**: The service downloads, compresses, and uploads images to Cloudinary.
3. **Webhook Trigger**: After all images are processed, a webhook is triggered to notify an external service.

---

## 2. **Functional Requirements**

### 2.1 Image Processing
- Download images from provided URLs.
- Compress images to reduce size while maintaining quality.
- Upload compressed images to Cloudinary.

### 2.2 Webhook Notification
- Trigger a POST request to a specified webhook URL after processing all images.
- Include details like `productId` and `processedImageUrls` in the payload.

### 2.3 Error Handling
- Log errors during image download, compression, or upload.
- Skip images that fail to process and continue with the next.

---

## 3. **Non-Functional Requirements**

### 3.1 Scalability
- The system should handle large volumes of images by processing them asynchronously.
  
### 3.2 Performance
- Image processing should be optimized to minimize the time taken for download, compression, and upload.

### 3.3 Security
- Secure sensitive information such as Cloudinary API credentials using environment variables.

---

## 4. **Technical Design**

### 4.1 Environment Configuration

- **Environment Variables**:
  - `MONGODB_URI`: MongoDB connection string.
  - `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
  - `CLOUDINARY_API_KEY`: Cloudinary API key.
  - `CLOUDINARY_API_SECRET`: Cloudinary API secret.
  - `WEBHOOK_URL`: Webhook URL for notifications.

### 4.2 Image Processing Service

**Modules**: 
- **axios**: For making HTTP requests to download images.
- **sharp**: For image processing (compression, resizing).
- **cloudinary**: Cloudinary SDK for uploading images.
- **webhookService**: Custom service to trigger webhook notifications.

**Functions**:
1. **downloadImage(url)**: Downloads the image from the provided URL and returns a Buffer.
2. **compressImage(buffer)**: Compresses the image to 50% quality and resizes it to 800px width.
3. **uploadToCloudinary(buffer, publicId)**: Uploads the processed image to Cloudinary and returns the secure URL.
4. **processImages(productId, imageUrls, webhookUrl)**:
   - Downloads, compresses, and uploads images.
   - Triggers a webhook with processed image URLs.

### 4.3 Webhook Service

**Modules**: 
- **axios**: To make HTTP POST requests to the webhook URL.

**Functions**:
1. **triggerWebhook(data)**: Sends a POST request to the specified webhook URL with the processed data.

### 4.4 Error Handling
- **Try-Catch Blocks**: Ensure that each function gracefully handles errors and logs appropriate messages.
- **Skip Errors**: Continue processing remaining images even if some fail.

### 4.5 Logging
- **Console Logging**: Basic logging for development and debugging purposes.
- **Error Logging**: Capture and log errors for troubleshooting.

---

## 5. **API Design**

### 5.1 Upload Endpoint

**Route**: `/upload`
**Method**: `POST`

**Request**:
- **Headers**: `Content-Type: multipart/form-data`
- **Body**: CSV file containing image URLs.

**Response**:
- **200 OK**: Processing started.
- **400 Bad Request**: Invalid input (e.g., missing CSV file).
- **500 Internal Server Error**: Processing failure.

### 5.2 Webhook Notification

**URL**: Configurable via environment variable (`WEBHOOK_URL`)
**Method**: `POST`

**Payload**:
```json
{
  "productId": "12345",
  "processedImageUrls": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ]
}
```

---

## 6. **Deployment and Configuration**

### 6.1 Environment Setup

- **Node.js**: Ensure Node.js and npm are installed.
- **Environment Variables**: Set up the `.env` file with the required variables.

### 6.2 Deployment

- **Local Deployment**: Run the application locally for testing.
- **Production Deployment**: Deploy to a cloud service like Heroku, AWS, or DigitalOcean.

### 6.3 Scaling

- Consider using a message queue like RabbitMQ or AWS SQS for scaling the image processing tasks.
- Implement horizontal scaling by running multiple instances of the service.

---

## 7. **Testing Strategy**

### 7.1 Manual Testing

- Upload sample CSV files and verify the images are processed correctly.
- Check webhook notifications using Webhook.site or Postman.


---

## 8. **Conclusion**

This document outlines the design and implementation of an CSV-image processing service with webhook integration. 
