const express = require('express');
const Request = require('../models/Request');

const router = express.Router();

router.get('/:request_id', async (req, res) => {
  try {
    const { request_id } = req.params;
    const request = await Request.findOne({ request_id });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({
      request_id: request.request_id,
      status: request.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
