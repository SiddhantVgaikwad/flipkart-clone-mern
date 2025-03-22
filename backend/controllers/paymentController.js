const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Payment = require('../models/paymentModel');
const ErrorHandler = require('../utils/errorHandler');
const Order = require('../models/orderModel');


exports.processPayment = asyncErrorHandler(async (req, res, next) => {
    const { paymentMethod, paymentDetails, amount, shippingInfo, items, user } = req.body;

    const paymentInfo = {
        status: paymentMethod === 'cod' ? 'Pending (COD)' : 'Completed',
        id: paymentMethod === 'cod' ? 'COD-' + Date.now() : `TX${Math.random().toString(36).substr(2, 9)}`
    };
    if (paymentMethod === 'upi' && !paymentDetails.upiId) {
        return next(new ErrorHandler("UPI ID is required", 400));
    }
    
    if (paymentMethod === 'netbanking' && !paymentDetails.bank) {
        return next(new ErrorHandler("Bank selection is required", 400));
    }

    // Create order
    const order = await Order.create({
        user,
        items,
        totalPrice: amount,
        shippingInfo,
        paymentMethod,
        paymentInfo,  // Add this field
        paymentDetails,
        paidAt: Date.now()
    });



   
    
      res.status(200).json({
        success: true,
        order
      });
    });


exports.getPaymentStatus = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});