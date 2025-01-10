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
        address: "123 Drury Lane",
        city: "Duloc",
        state: "Orinion",
        country: "Far Far Away",
        lat: 79.9999,
        lng: -169.9999,
        name: "Muffin Man",
        description: "Where the Muffin Man lives",
        price: 599,
      },
      {
        ownerId: 1,
        address: "1235 Drury Lane",
        city: "Duloc",
        state: "Orinion",
        country: "Far Far Away",
        lat: 79.999,
        lng: -169.999,
        name: "Muffin Man2",
        description: "Where the Muffin Man lives",
        price: 598.99,
      },
      {
        ownerId: 1,
        address: "1235 Drury Lane",
        city: "Duloc",
        state: "Orinion",
        country: "Far Far Away",
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
        description: "The Nightmare on Elm Street",
        price: 59.00,
      },
      {
        ownerId: 2,
        address: "1238 Elm Street",
        city: "Springwood",
        state: "Ohio",
        country: "United States",
        lat: -7.99,
        lng: 16.99,
        name: "Freddy Kreuger4",
        description: "The Nightmare on Elm Street",
        price: 159.99,
      },
      {
        ownerId: 3,
        address: "123 Swamp Road",
        city: "Duloc",
        state: "Orinion",
        country: "Far Far Away",
        lat: 1,
        lng: 1,
        name: "Shrek",
        description: "This is where Shrek lives",
        price: 99.00,
      },
      {
        ownerId: 3,
        address: "1234 Swamp Road",
        city: "Duloc",
        state: "Orinion",
        country: "Far Far Away",
        lat: 12,
        lng: 12,
        name: "Shrek2",
        description: "This is where Shrek lives",
        price: 999.00,
      },
      {
        ownerId: 3,
        address: "1235 Swamp Road",
        city: "Duloc",
        state: "Orinion",
        country: "Far Far Away",
        lat: -1,
        lng: -1,
        name: "Shrek3",
        description: "This is where Shrek lives",
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
