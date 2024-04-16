
const Location = require('./../models/locationModel');
const catchAsync = require('./../utils/catchAsync');
const request = require('request');

exports.getAllLocations = catchAsync (async (req, res, next) => {
    const locations = await Location.find();
    res.status(200).json({
        status: 'success',
        results: locations.length,
        data: {
            locations,
        }
    })
});

exports.addLocation =  catchAsync(async (req, res, next) => {
    const locationObject = req.body;
    const url = `https://api.radar.io/v1/geocode/reverse?coordinates=${locationObject.latitude},${locationObject.longitude}`;
    let formattedAddress = '';
    await request(
    {
        url: url,
        json: true,
        headers: {
            'Authorization': 'prj_live_pk_1dc764b95abd147f555ebdadcbf35ae6f0c06ea8',
        },        
    }, async (error, response) => {
        if (response?.body?.addresses?.[0]?.formattedAddress) {
            console.log(response.body.addresses);
            formattedAddress = response?.body?.addresses?.[0]?.formattedAddress;
            const userLocation = await Location.create({
                userId: req.user[0].userId,
                locationTagTiming: locationObject.locationTagTiming,
                latitude: locationObject.latitude,
                longitude: locationObject.longitude,
                formattedAddress: formattedAddress,
            });
            res.status(201).json({
                status: 'success',
                data: {
                    location: userLocation,
                }
            })
        } else {
            const userLocation = await Location.create({
                userId: req.user[0].userId,
                locationTagTiming: locationObject.locationTagTiming,
                latitude: locationObject.latitude,
                longitude: locationObject.longitude,
            });
            res.status(201).json({
                status: 'success',
                data: {
                    location: userLocation,
                }
            })
        }
    });
});

exports.getLocationById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}

exports.updateLocation = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}

exports.deleteLocation = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}

exports.getLocationByUserId = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}
