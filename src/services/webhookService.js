const axios = require('axios');
require('dotenv').config();

const triggerWebhook = async (data) => {
  try {
    const webhookUrl = process.env.WEBHOOK_URL;

    const response = await axios.post(webhookUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Webhook triggered successfully:', response.status);
  } catch (error) {
    console.error('Error triggering webhook:', error.message);
  }
};

module.exports = { triggerWebhook };
