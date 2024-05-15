const express = require('express');
const attendanceController = require('./../controllers/attendanceController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/')
    .get(authController.protect, authController.restrtictTo('admin'), attendanceController.getAllAttendances)
    .post(authController.protect, attendanceController.addAttendance);

router.route('/getmyattendance')
    .post(authController.protect, attendanceController.getMyAttendance)

router.route('/getAttendanceByUserId')
    .post(authController.protect, authController.restrtictTo('admin'), attendanceController.getAttendanceByUserId)

router.route('/:id')
    .get()
    .patch()
    .delete();

router.route('/:userId')
    .patch();

module.exports = router;
