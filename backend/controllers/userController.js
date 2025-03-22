const User = require('../models/userModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const sendToken = require('../utils/sendToken');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Register User
exports.registerUser = asyncErrorHandler(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const { name, email, gender, password } = req.body;

    const user = await User.create({
        name, 
        email,
        gender,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    sendToken(user, 201, res);
});

// Login User
exports.loginUser = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorHandler("Please Enter Email And Password", 400));
    }

    const user = await User.findOne({ email}).select("+password");

    if(!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 201, res);
});


// Logout User
exports.logoutUser = asyncErrorHandler(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});


// Get User Details
exports.getUserDetails = asyncErrorHandler(async (req, res, next) => {
    
    try {
        const user = await User.findById(req.user.id); // Assuming req.user is set by isAuthenticated middleware
        res.status(200).json({ success: true, user });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
});


// Forgot Password
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    const resetToken = await user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `http://localhost:3000/api/v1/password/reset/${resetToken}`;

    // Define the email message
    const message = `
        <h1>Password Reset Request</h1>
        <p>You have requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetPasswordUrl}" target="_blank">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    `;

    try {
        // Send the email using Nodemailer
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message: message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        // Reset the token and expire fields if the email fails to send
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});


// Reset Password
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    // Hash the token from the request parameters
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    // Find the user with the matching token and ensure the token is not expired
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    // If no user is found, return an error
    if (!user) {
        return next(new ErrorHandler('Invalid or expired reset password token', 400));
    }

    // Update the user's password and clear the reset token fields
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save the updated user document
    await user.save();

    // Send a success response with the JWT token
    sendToken(user, 200, res);
});



// Update Password
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is Invalid", 400));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 201, res);
});


// Update User Profile
exports.updateProfile = asyncErrorHandler(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    if(req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    });

    res.status(200).json({
        success: true,
    });
});



// ADMIN DASHBOARD //

// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

// Get Single User Details --ADMIN
exports.getSingleUser = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// Update User Role --ADMIN
exports.updateUserRole = asyncErrorHandler(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        role: req.body.role,
    }

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

// Delete Role --ADMIN
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404));
    }

    await user.remove();

    res.status(200).json({
        success: true
    });
});