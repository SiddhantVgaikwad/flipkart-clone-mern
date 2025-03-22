const express = require('express');
const { processPayment, getPaymentStatus } = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router = express.Router();

router.route('/payment/process').post(isAuthenticatedUser, processPayment);
router.route('/payment/status/:id').get(isAuthenticatedUser, getPaymentStatus);

module.exports = router;