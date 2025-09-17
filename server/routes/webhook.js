const express = require('express');
const router = express.Router();
const { processWebhook } = require('../controllers/WebhookController');
const { validateBody, webhookSchema } = require('../midlewares/validation');

router.post('/processWebhook', validateBody(webhookSchema), processWebhook);

module.exports = router;