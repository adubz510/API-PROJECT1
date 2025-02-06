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
        address: "123 Maple Lane",
        city: "Rumney",
        state: "New Hampshire",
        country: "United States",
        lat: 79.9999,
        lng: -169.9999,
        name: "Rumney Climbers House",
        description: "Where the climbers stay for easy access to Rumney",
        price: 599,
      },
      {
        ownerId: 1,
        address: "1235 Maple Lane",
        city: "Trenton",
        state: "New Jersey",
        country: "United States",
        lat: 79.999,
        lng: -169.999,
        name: "Jersey City Man2",
        description: "Where the Garden Man lives",
        price: 598.99,
      },
      {
        ownerId: 1,
        address: "1235 Maple Street",
        city: "Apple",
        state: "Vermont",
        country: "United States",
        lat: 79.99,
        lng: -169.99,
        name: "Muffin Man3",
        description: "Where the Muffin Man lives",
        price: 500,
      },
      {
        ownerId: 2,
        address: "1234 Elm Street",
        city: "Springwood",
        state: "Ohio",
        country: "United States",
        lat: -79.999,
        lng: 169.999,
        name: "Freddy Kreuger2",
        description: "The Nightmare on Elm Street",
        price: 509.00,
      },
      {
        ownerId: 2,
        address: "1236 Elm Street",
        city: "Springwood",
        state: "Ohio",
        country: "United States",
        lat: -79.99,
        lng: 169.99,
        name: "Freddy Kreuger3",
        description: "The House next to nightmare on elm street",
        price: 59.00,
      },
      {
        ownerId: 2,
        address: "123 Oak Street",
        city: "Springwood",
        state: "Ohio",
        country: "United States",
        lat: -7.99,
        lng: 16.99,
        name: "Freddy Kreuger5",
        description: "The Dream on Elm Street",
        price: 159.99,
      },
      {
        ownerId: 3,
        address: "123 Swamp Road",
        city: "Las Vegas",
        state: "Nevada",
        country: "United States",
        lat: 1,
        lng: 1,
        name: "Gold House",
        description: "This is where goldman is",
        price: 99.00,
      },
      {
        ownerId: 3,
        address: "1234 Swamp Road",
        city: "Las Vegas",
        state: "Nevada",
        country: "United States",
        lat: 12,
        lng: 12,
        name: "Silver House",
        description: "This is where silver house is",
        price: 999.00,
      },
      {
        ownerId: 3,
        address: "1235 Tenaya Road",
        city: "Las Vegas",
        state: "Mevada",
        country: "United States",
        lat: -1,
        lng: -1,
        name: "Oceans11",
        description: "This is where oceans11 filmed",
        price: 9.00,
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Muffin Man', 'Freddy Kreuger', 'Shrek'] }
    }, {});
  }
};
