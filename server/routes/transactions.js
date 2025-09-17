const express = require('express');
const router = express.Router();
const { getAllTransactions, getTransactionsBySchool, checkTransactionStatus } = require('../controllers/transactionController');
const {auth, trustee} = require('../midlewares/auth');

router.get('/getAllTransactions', auth, getAllTransactions);
router.get('/getTransactionsBySchool/:schoolId', auth, getTransactionsBySchool);
router.get('/transaction-status/:customOrderId', auth, checkTransactionStatus);

module.exports = router;