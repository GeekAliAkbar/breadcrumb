const express = require('express');
const attendanceController = require('./../controllers/attendanceController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/')
    // .get(authController.protect, attendanceController.getAttendanceByUserId)
    .post(authController.protect, attendanceController.addAttendance);

router.route('/getmyattendance')
    .post(authController.protect, attendanceController.getMyAttendance)

router.route('/:id')
    .get()
    .patch()
    .delete();

router.route('/:userId')
    .patch();

module.exports = router;
