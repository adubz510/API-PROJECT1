'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
    {
      spotId: 1,
      url: "https://spotimage1.com",
      preview: true,
    },
    {
      spotId: 2,
      url: "https://spotimage2.com",
      preview: true,
    },
    {
      spotId: 3,
      url: "https://spotimage3.com",
      preview: false,
    },
  
  ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [ 1, 2, 3] }
    }, {});
  }
};
