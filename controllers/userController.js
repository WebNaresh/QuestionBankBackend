const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/cathchAsyncError");
const { User } = require("../models/UserModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is a sample id",
            url: "profile pic url"
        }
    });
    sendToken(user, 200, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    // checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email and Password ", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    const ispasswordMatched = await user.comparePassword(password);
    if (!ispasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

// Logout user 
exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "logget out successfully",
    });

});

// Forgot Password 
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not found", 404));
    }

    // GEt ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    console.log(resetPasswordUrl);

    const message = ` Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n if You have not requested this email then, Please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Question Bank Password Recovery`,
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });

    } catch (error) {
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});


// reset ResetPassword token 
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // creating token hash 
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    console.log(resetPasswordToken);
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password TOken is invalid or has been expired", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not password", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);

});

// Get User Detail

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

// update User Password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const ispasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!ispasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
    res.status(200).json({
        success: true,
        user,
    });
});

// update User Profile

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        name: req.body.email,
    };
    // add cloudanary
    const user = User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFIndAndModify: false
    });
    res.status(200).json({
        success: true,

    });
});


// Create a new Paper set 

exports.createPaperset = catchAsyncErrors(async (req, res, next) => {
    const questionSet = req.body;
    smallUser = req.user;
    console.log(req.user);


    const user = await smallUser.questionPaperSet.push(questionSet);
    await smallUser.save();
    res.status(200).json({
        success: true,
        smallUser,
    });
});
