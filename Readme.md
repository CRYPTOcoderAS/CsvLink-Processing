# CsvLink-Processing

This project provides a Node.js-based service for processing images from CSV files, compressing them, and uploading them to Cloudinary. It also includes a webhook feature that triggers a callback once all images have been processed.

## Features

- **Image Download and Compression**: Downloads images from URLs provided in the CSV file, compresses them using `sharp`, and uploads them to Cloudinary.
- **Webhook Integration**: Triggers a webhook after all images have been processed successfully.
- **API Endpoints**: Provides endpoints to upload CSV files and check processing status.
- **Asynchronous Processing**: Handles image processing asynchronously to improve performance.


## Installation

1. **Clone the repository**:
   ```bash
  https://github.com/akshat-sachan1/CsvLink-Processing.git
   ```

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (see below).

3. **Start the server**:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
MONGODB_URI=<your_mongodb_uri>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
WEBHOOK_URL=<your_webhook_url>
```

## Usage

### Upload API

- **Endpoint:** `POST /api/upload`
- **Description:** Upload a CSV file containing image URLs. The service processes the images asynchronously.
- **Request:**
  - Method: `POST`
  - Headers: `Content-Type: multipart/form-data`
  - Body: `file=@"/path/to/your/file.csv"`
- **Response:**
  - `requestId`: A unique ID to track the processing status.

Example:
```bash
curl --location 'http://localhost:8080/api/upload' \
--form 'file=@"/path/to/your/file.csv"'
```

### Status API

- **Endpoint:** `GET /api/status/{requestId}`
- **Description:** Check the processing status of the images.
- **Request:**
  - Method: `GET`
  - Path Parameter: `requestId`
- **Response:**
  - JSON object containing the processing status and URLs of processed images.

Example:
```bash
curl --location 'http://localhost:8080/api/status/{requestId}'
```

## Webhook Integration

The service triggers a webhook after all images are processed. Ensure the `WEBHOOK_URL` is set in your environment variables. The data sent to the webhook includes the `productId` and the list of processed image URLs.

## Database Schema

The service uses MongoDB to store product data and track the status of each processing request. The schema includes:


```bash
{
  "_id": "ObjectId",
  "product_name": "String",
  "input_image_urls": ["String"],
  "output_image_urls": ["String"],
  "request_id": "String",
  "__v": "Number"
}
```

