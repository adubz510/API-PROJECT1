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
        ownerId: 2,
        address: "123 Elm Street",
        city: "Springwood",
        state: "Ohio",
        country: "United States",
        lat: -79.9999,
        lng: 169.9999,
        name: "Freddy Kreuger",
        description: "The Nightmare on Elm Street",
        price: 5.00,
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
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Muffin Man', 'Freddy Kreuger', 'Shrek'] }
    }, {});
  }
};
