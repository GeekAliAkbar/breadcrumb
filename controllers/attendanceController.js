
const Attendance = require('./../models/attendanceModel');
const catchAsync = require('./../utils/catchAsync')

exports.getAllAttendances = catchAsync (async (req, res, next) => {
    const attendances = await Attendance.find();
    res.status(200).json({
        status: 'success',
        results: attendances.length,
        data: {
            attendances,
        }
    })
});

exports.getAttendanceByUserId = catchAsync (async (req, res, next) => {
    let queryObj = { };
    if (req.body.userId) {
        queryObj = {
            userId: req.body.userId,
        }
    }
    const attendances = await Attendance.find(queryObj);
    res.status(200).json({
        status: 'success',
        results: attendances.length,
        data: {
            attendances,
        }
    })
});

exports.addAttendance =  catchAsync(async (req, res, next) => {
    const attendanceObject = req.body;
    console.log(req.body);
    const userAttendance = await Attendance.create({
        userId: req.user[0].userId,
        attendenceTiming: new Date(),
        activity: attendanceObject.activity,
        latitude: attendanceObject.latitude,
        longitude: attendanceObject.longitude,
    });
    res.status(201).json({
        status: 'success',
        data: {
            attendance: userAttendance,
        }
    })
});
exports.getAttendanceById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}
exports.updateAttendance = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}
exports.deleteAttendance = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}

exports.getMyAttendance = catchAsync (async (req, res, next) => {
    let queryObj = {
        userId: req.user[0].userId,
    };
    if (req.body.startDate && req.body.endDate) {
        queryObj = {
            ...queryObj,
            attendenceTiming: {
                $gte: new Date(req.body.startDate), 
                $lt: new Date(req.body.endDate)
            }
        }
    }
    const attendances = await Attendance.find(queryObj);
    res.status(200).json({
        status: 'success',
        results: attendances.length,
        data: {
            attendances,
        }
    })
});