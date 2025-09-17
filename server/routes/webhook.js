const express = require('express');
const router = express.Router();
const { processWebhook } = require('../controllers/webhookController');
const { validateBody, webhookSchema } = require('../midlewares/validation');

router.post('/processWebhook', validateBody(webhookSchema), processWebhook);

module.exports = router;