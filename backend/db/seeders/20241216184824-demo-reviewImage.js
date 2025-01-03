'use strict';

const { ReviewImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "https://reviewimage1.com",
      },
      {
        reviewId: 2,
        url: "https://reviewimage2.com",
      },
      {
        reviewId: 3,
        url: "https://reviewimage3.com",
      },
      {
        reviewId: 4,
        url: "https://reviewimage4.com",
      },
      {
        reviewId: 5,
        url: "https://reviewimage5.com",
      },
      {
        reviewId: 6,
        url: "https://reviewimage6.com",
      },
      {
        reviewId: 7,
        url: "https://reviewimage7.com",
      },
      {
        reviewId: 8,
        url: "https://reviewimage8.com",
      },
      {
        reviewId: 9,
        url: "https://reviewimage9.com",
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [ 1, 2, 3] }
    }, {});
  }
};
