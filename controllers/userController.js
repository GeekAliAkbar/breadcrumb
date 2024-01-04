
const User = require('./../models/userModal');
const catchAsync = require('./../utils/catchAsync')

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
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}
exports.getUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}