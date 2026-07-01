const { StatusCodes } = require('http-status-codes');
const { FlightRepository } = require('../repositories');
const AppError = require('../utils/errors/app.errors');
const { Op } = require('sequelize');

const flightRepository = new FlightRepository();

async function createFlight(data) {
    try {
        const flight = await flightRepository.create(data);
        return flight;
    } catch (error) {
        console.log(error);
        if(error.name == 'SequelizeValidationError') {
            let explanation = [];
            error.errors.forEach(err => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }

        throw new AppError('Cannot create a new Flight object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllFlights(query) {
    let customFilter = {};
    let sortFilter = [];
    if(query.trips) {
        [ departureAirportId, arrivalAirportId ] = query.trips.split('-');
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId; 
    }
    if(query.price) {
        [ minPrice, maxPrice ] = query.price.split('-');
        console.log(minPrice, maxPrice);
        customFilter.price = {
            [Op.between]: [minPrice, (maxPrice || 20000)]
        }
    }
    if(query.travellers) {
        customFilter.totalSeats = {
            [Op.gte]: query.travellers
        }
    }
    if (query.tripDate) {
        const startDate = new Date(query.tripDate);
        const endDate = new Date(query.tripDate);

        endDate.setDate(endDate.getDate() + 1);

        customFilter.departureTime = {
            [Op.gte]: startDate,
            [Op.lt]: endDate
        };
    }
    if(query.sort) {
        const params = query.sort.split(',');
        const sortFilters = params.map((param) => param.split('_'));
        sortFilter = sortFilters;
    }
    try {
        const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    } catch (error) {
        console.log(error);
        throw new AppError('Cannot fetch data of all flights', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function destroyFlight(id) {
    try {
        const response = await flightRepository.destroy(id);
        return response;
    } catch(error) {
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError('Flight not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError('Cannot destroy the flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateFlight(id, data) {
    try{
        const response = await flightRepository.update(id, data);
        return response;
    } catch(error) {
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError('Flight not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError('Cannot update the flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createFlight,
    destroyFlight,
    updateFlight,
    getAllFlights
}