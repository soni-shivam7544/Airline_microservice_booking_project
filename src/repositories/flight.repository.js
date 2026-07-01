const CrudRepository = require('./crud.repository');
const { Flight, Airplane, Airport, City} = require('../models');
const Sequelize = require('sequelize');


class FlightRepository extends CrudRepository {
    constructor() {
        super(Flight);
    }

    async getAllFlights(filter, sort) {
        const response = await Flight.findAll({
            where: filter,
            order: sort,
            include: [
                {
                    model: Airplane,
                    required: true,
                    as: 'airplaneDetails',
                },
                {
                    model: Airport,
                    as: 'departureAirport',
                    required: true,
                    on: {
                        col1: Sequelize.where(Sequelize.col("Flight.departureAirportId"), '=', Sequelize.col("departureAirport.code"))
                    },
                    include: {
                        model: City,
                        required: true,
                        as: 'cityDetails'
                    }
                },
                {
                    model: Airport,
                    required: true,
                    as : 'arrivalAirport',
                    on: {
                        col1: Sequelize.where(Sequelize.col("Flight.arrivalAirportId"), '=', Sequelize.col('arrivalAirport.code'))
                    },
                    include: {
                        model: City,
                        required: true,
                        as: 'cityDetails'
                    }
                }
            ]
        });
        return response;
    }
}

module.exports = FlightRepository;