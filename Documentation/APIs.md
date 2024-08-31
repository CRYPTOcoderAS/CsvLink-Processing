### 1. **Upload API**
   - **Endpoint:** `POST /api/upload`
   - **Role:** 
     - This API endpoint is responsible for accepting CSV files that contain image URLs and other related product data.
     - The CSV file is uploaded, and each image URL in the file is queued for asynchronous processing (e.g., downloading, compressing, uploading to Cloudinary).
     - Once the file is successfully uploaded, the API returns a unique request ID that can be used to track the status of the image processing task.
   
   - **Request:**
     - **Method:** `POST`
     - **URL:** `http://localhost:8080/api/upload`
     - **Headers:**
       - `Content-Type: multipart/form-data`
     - **Body:**
       - `file`: The CSV file containing the image URLs and associated data. For example:
         ```bash
         curl --location 'http://localhost:8080/api/upload' \
         --form 'file=@"/Users/akshat.sachan/Desktop/Akshat/CSV-Img-Processing/test.csv"'
         ```
   
   - **Response:**
     - **Status Code:** `200 OK` (if successful)
     - **Body:**
       - A JSON object containing the `requestId`:
         ```json
         {
           "requestId": "e889c8ae-0cc5-4104-8a0e-0c311f6b65ab"
         }
         ```
     - **Error Handling:**
       - If there's an issue with the file upload (e.g., incorrect format), a `400 Bad Request` status will be returned with an error message.

### 2. **Status API**
   - **Endpoint:** `GET /api/status/{requestId}`
   - **Role:**
     - This API endpoint allows clients to check the processing status of the images associated with a specific request.
     - The request ID provided as a path parameter is used to query the database, and the current status of the processing task is returned.
     - The status may include stages like `pending`, `in-progress`, `completed`, or `failed`, along with other details like the number of images processed and their URLs.
   
   - **Request:**
     - **Method:** `GET`
     - **URL:** `http://localhost:8080/api/status/{requestId}`
     - **Headers:** None required.
     - **Path Parameter:**
       - `requestId`: The unique ID returned by the Upload API, used to track the image processing status.
         ```bash
         curl --location 'http://localhost:8080/api/status/e889c8ae-0cc5-4104-8a0e-0c311f6b65ab'
         ```
   
   - **Response:**
     - **Status Code:** `200 OK` (if the request ID is valid and processing status is available)
     - **Body:**
       - A JSON object containing the status of the processing request, for example:
         ```json
         {
           "requestId": "e889c8ae-0cc5-4104-8a0e-0c311f6b65ab",
           "status": "in-progress"
         }
         ```
     - **Error Handling:**
       - If the `requestId` is not found, a `404 Not Found` status is returned with an error message.
       - If there’s an internal error processing the request, a `500 Internal Server Error` status will be returned.
