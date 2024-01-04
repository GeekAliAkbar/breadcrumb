const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');

const User = require('./../models/userModal');
const catchAsync = require('./../utils/catchAsync');

const signToken = id => {
    return jwt.sign({
        id: id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    });
}

exports.signup =  catchAsync(async (req, res, next) => {
    const estimate = await User.estimatedDocumentCount();
    const userObject = req.body;
    userObject.userId = estimate + 1;
    const newUser = await User.create({
        userId: userObject.userId,
        userName: userObject.userName,
        email: userObject.email,
        phone: userObject.phone,
        profilePhoto: userObject.profilePhoto,
        dob: userObject.dob,
        gender: userObject.gender,
        password: userObject.password,
        confirmPassword: userObject.confirmPassword,
        passwordChangedAt: userObject.passwordChangedAt,
        role: userObject.role,
    });
    const token = signToken(newUser.userId);
    res.status(201).json({
        status: 'success',
        token: token,
        data: {
            user: newUser,
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || ! (await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password!', 401));
    }
    const token = signToken(user.userId);
    res.status(200).json({
        status: 'success',
        token,
    });
})

exports.protect = catchAsync(async (req, res, next) => {
    // 1. Get the token and check if it exists
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    // 2. Verification the token
    if (!token) {
        return next(new AppError('You are not logged in. Please Login to get access', 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. If verification is success then will check if user still exists
    const freshUser = await User.find({userId: decoded.id})
    if (!freshUser) {
        return next(new AppError('The user belonging to this token does not exist', 401));
    }

    // 4. Check if user changed password after token was issued
    // if (freshUser.changedPasswordAfter(decoded.iat)) {
    //     return next(new AppError('User recently changed password!! Please log in again.', 401));
    // }
    req.user = freshUser;
    next();
})

exports.restrtictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array ['admin', 'hr']
        console.log(req.user);
        if (!roles.includes(req.user[0].role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
}