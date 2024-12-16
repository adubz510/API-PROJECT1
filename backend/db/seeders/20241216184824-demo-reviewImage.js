'use strict';

const { ReviewImage } = require('../models')

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
