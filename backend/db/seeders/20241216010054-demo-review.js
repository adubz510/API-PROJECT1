'use strict';

const { Review } = require('../models');
// const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 1,
        review: "This place is nice!",
        stars: 3
      },
      {
        userId: 2,
        spotId: 1,
        review: "This place is cool!",
        stars: 4
      },
      {
        userId: 3,
        spotId: 1,
        review: "This place is not good!",
        stars: 2
      },
      {
        userId: 2,
        spotId: 2,
        review: "Wish this place had a nicer bedroom and bathroom. Kitchen was dirty...",
        stars: 1
      },
      {
        userId: 1,
        spotId: 2,
        review: "Wish this place had a nicer bedroom and bathroom.",
        stars: 2
      },
      {
        userId: 3,
        spotId: 2,
        review: "This place was not good.",
        stars: 1
      },
      {
        userId: 1,
        spotId: 3,
        review: "This place is awesome!",
        stars: 5
      },
      {
        userId: 2,
        spotId: 3,
        review: "This place is sweet! Thank you!",
        stars: 5
      },
      {
        userId: 3,
        spotId: 3,
        review: "This place is nice! Has everything I would ever want in an Airbnb house! Thank you!",
        stars: 5
      },
    
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [ 1, 2, 3] }
    }, {});
  }
};
