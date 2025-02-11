'use strict';

const { Spot } = require('../models');
// const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "34 River Ridge Rd",
        city: "Plymouth",
        state: "New Hampshire",
        country: "United States",
        lat: 43.766855566049685,
        lng: -71.7068948807088,
        name: "College Climbers House",
        description: "Where students/climbers stay for access to Rumney and Plymouth",
        price: 69.00,
      },
      {
        ownerId: 1,
        address: "255 Main St",
        city: "Rumney",
        state: "New Hampshire",
        country: "United States",
        lat: 43.8018803859422, 
        lng: -71.8143102535692,
        name: "Rumney Climbing House",
        description: "Where the Garden Man lives",
        price: 99.00,
      },
      {
        ownerId: 1,
        address: "61 Central Ave",
        city: "Burlington",
        state: "Vermont",
        country: "United States",
        lat: 44.45921666527921,
        lng:  -73.22103495840227,
        name: "Burlington Sweet Spot",
        description: "Right next to farmers market and beautiful square in southend and next to lake!",
        price: 500.00,
      },
      {
        ownerId: 2,
        address: "1234 E Elm Street",
        city: "Springfield",
        state: "Missouri",
        country: "United States",
        lat: 37.24903906125925,
        lng:  -93.26792742006079,
        name: "Murder Mystery House",
        description: "Get a nice spooky and exciting stay!",
        price: 39.00,
      },
      {
        ownerId: 2,
        address: "123 Elm Street",
        city: "Henderson",
        state: "Nevada",
        country: "United States",
        lat: 36.045840666933834,
        lng:  -114.97086290370231,
        name: "Hendy Wendy",
        description: "Sweet, nice, and cozy stay in Henderson!",
        price: 99.99,
      },
      {
        ownerId: 2,
        address: "11812 Bussero Ct",
        city: "Las Vegas",
        state: "Nevada",
        country: "United States",
        lat: 36.16160458268151,
        lng: -115.35306687417955,
        name: "Corner House",
        description: "Nice and comfy stay in West Summerlin!",
        price: 120.00,
      },
      {
        ownerId: 3,
        address: "7 Prospect St",
        city: "New Paltz",
        state: "New York",
        country: "United States",
        lat: 89.74856294913664, 
        lng: -74.0824567838634,
        name: "Single White House",
        description: "Tight little spacious house. Right next to the Burger Box!",
        price: 59.00,
      },
      {
        ownerId: 3,
        address: "80 Spencer St",
        city: "Winsted",
        state: "Connecticut",
        country: "United States",
        lat: 41.92931415377457, 
        lng: -73.07545287698692,
        name: "Silver House",
        description: "This is a nice place to get away from city life and enjoy the nice woods of Connecticut!",
        price: 39.00,
      },
      {
        ownerId: 3,
        address: "11020 Wind Court",
        city: "El Paso",
        state: "Texas",
        country: "United States",
        lat: 31.797185115585528, 
        lng: -106.31751124547206,
        name: "Windy El Paso house",
        description: "Nice getaway in East El Paso. Closer to the state park and more!",
        price: 19.00,
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["College Climbers House", "Rumney Climbing House", "Burlington Sweet Spot", "Murder Mystery House", "Hendy Wendy", "Corner House", "Single White House", "Silver House", "Windy El Paso house"] }
    }, {});
  }
};