const express = require("express");
const router = express.Router();

const { createPayment } = require("../controllers/PaymentController");

const {auth, trustee} = require("../midlewares/auth");
const {validateBody, createPaymentSchema} = require("../midlewares/validation");

router.post('/createPayment', auth, trustee, validateBody(createPaymentSchema), createPayment);

module.exports = router;