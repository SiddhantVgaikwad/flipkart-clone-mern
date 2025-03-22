const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');

// Create New Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return next(new ErrorHandler("No order items found", 400));
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    // Simple email template
    const message = `
    <h2>Order Confirmation #${order._id}</h2>
    <p>Thank you for your order, ${req.user.name}!</p>
    
    <h3>Order Details:</h3>
    <ul>
        ${orderItems.map(item => `
            <li>
                ${item.name} - 
                Quantity: ${item.quantity} - 
                Price: ₹${item.price}
            </li>
        `).join('')}
    </ul>
    
    <h3>Shipping Address:</h3>
    <p>${shippingInfo.address}<br>
    ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}</p>
    
    <h3>Total Amount: ₹${totalPrice}</h3>
    
    <p>View your order details here: 
        <a href="${process.env.FRONTEND_URL}/order_details/${order._id}">
            Order Details
        </a>
    </p>
    
    <p>We'll send another email when your order ships.</p>
`;

    try {
        await sendEmail({
            email: req.user.email,
            subject: `Order Confirmation #${order._id}`,
            message
        });
    } catch (emailError) {
        console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
        success: true,
        order,
    });
});


// Get Single Order Details
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});


// Get Logged In User Orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name price image'); ;

    if (!orders) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        orders,
    });
});


// Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {

    const orders = await Order.find();

    if (!orders) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
});

// Update Order Status ---ADMIN
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Already Delivered", 400));
    }

    if (req.body.status === "Shipped") {
        order.shippedAt = Date.now();
        order.orderItems.forEach(async (i) => {
            await updateStock(i.product, i.quantity)
        });
    }

    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

// Delete Order ---ADMIN
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    });
});

exports.getOrderDetails = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email') // Populate user details
      .populate({
        path: 'orderItems.product',
        select: 'name price images stock', // Add any other product fields you need
    }); 
  
    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }
  
    res.status(200).json({
      success: true,
      order
    });
  });