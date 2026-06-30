const { StatusCodes } = require('http-status-codes');
const { ErrorResponse, SuccessResponse } = require('../utils/common');
const AppError = require('../utils/errors/app.errors');
const { compareTime } = require('../utils/helpers/datetime-helper');


function validateCreateRequest(req, res, next) {
    if(!req.body.flightNumber) {
        ErrorResponse.error = new AppError( ['Flight number not found in the incoming request body'], StatusCodes.BAD_REQUEST);
        ErrorResponse.message = 'Something went wrong while creating flight';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.airplaneId) {
        ErrorResponse.error = new AppError( ['Airplane ID not found in the incoming request body'], StatusCodes.BAD_REQUEST);
        ErrorResponse.message = 'Something went wrong while creating flight';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.departureAirportId) {
        ErrorResponse.error = new AppError( ['Departure airport ID not found in the incoming request body'], StatusCodes.BAD_REQUEST);
        ErrorResponse.message = 'Something went wrong while creating flight';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.arrivalAirportId) {
        ErrorResponse.error = new AppError( ['Arrival airport ID not found in the incoming request body'], StatusCodes.BAD_REQUEST);
        ErrorResponse.message = 'Something went wrong while creating flight';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.arrivalTime) {
        ErrorResponse.error = new AppError( ['Arrival time not found in the incoming request body'], StatusCodes.BAD_REQUEST);
        ErrorResponse.message = 'Something went wrong while creating flight';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.departureTime) {
        ErrorResponse.error = new AppError( ['Departure time not found in the incoming request body'], StatusCodes.BAD_REQUEST);
        ErrorResponse.message = 'Something went wrong while creating flight';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.price) {
        ErrorResponse.error = new AppError( ['Price not found in the incoming request body'], StatusCodes.BAD_REQUEST);
        ErrorResponse.message = 'Something went wrong while creating flight';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.totalSeats) {
        ErrorResponse.error = new AppError( ['Total seats not found in the incoming request body'], StatusCodes.BAD_REQUEST);
        ErrorResponse.message = 'Something went wrong while creating flight';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    if(compareTime(req.body.departureTime, req.body.arrivalTime)){
        ErrorResponse.error = new AppError( ['Departure time cannot be greater than arrival time'], StatusCodes.BAD_REQUEST);
        ErrorResponse.message = 'Something went wrong while creating flight';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
}

function validateUpdateRequest(req, res, next) {
    if(!req.body || Object.keys(req.body).length == 0){
        ErrorResponse.error = new AppError(['Can not update with empty data'], StatusCodes.BAD_REQUEST);
        ErrorResponse.message = 'Something went wrong while updating flight';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

module.exports = {
    validateCreateRequest,
    validateUpdateRequest
}