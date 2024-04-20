
const User = require('./../models/userModal');
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory');
const multer = require("multer");
const bcrypt = require('bcryptjs');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user[0].userId}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb (null, true);
    } else {
        cb(new AppError ('Not an image', 404), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('profilePhoto');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(ele => {
        if (allowedFields.includes(ele)) {
            newObj[ele] = obj[ele];
        }
    });
    return newObj;
}
exports.getAllUsers = catchAsync (async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        }
    })
});

exports.createUser = (req, res) => {
    // const users = await User.find();
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}
exports.getUserById = catchAsync (async (req, res, next) => {
    let queryObj = {
        userId: req.params.id,
    };
    const user = await User.find(queryObj);
    res.status(200).json({
        status: 'success',
        results: user.length,
        data: {
            user,
        }
    })
});

exports.getUser = factory.getOne(User);
exports.updateUser = catchAsync (async (req, res, next) => {
    let queryObj = {
        userId: req.params.id,
    };
    const user = await User.find(queryObj);
    if (!user) {
        return next(new AppError ('No document find with that ID', 404))
    }
    if (req.body?.password) {
        user[0].password = user[0].confirmPassword = req.body.password;
    }
    const password = await bcrypt.hash(user[0].password, 12);
    console.log(password);
    res.status(200).json({
        status: 'success',
        data: {
            data: user,
        }
    })
});
exports.deleteUser = factory.deleteOne(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user[0]._id;
    next();
};
exports.updateMe = catchAsync (async (req, res, next) => {
    const filteredBody = filterObj(req.body, 'userName', 'password');
    if (req.file) {
        filteredBody.profilePhoto = req.file.filename;
    }
    if (filteredBody.password) {
        filteredBody.password = await bcrypt.hash(filteredBody.password, 12);
    }
    const updatedUser = await User.findByIdAndUpdate(req.user[0].id, filteredBody, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        }
    })
});