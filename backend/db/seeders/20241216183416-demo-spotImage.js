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
      url: "https://cdn.landsearch.com/listings/4FZVN/large/guilford-vt-132418800.jpg",
      preview: true,
    },
    {
      spotId: 1,
      url: "https://spotimage11.com",
      preview: false,
    },
    {
      spotId: 2,
      url: "https://l.icdbcdn.com/oh/60907f50-c4d6-4044-9422-b536a7fdabfa.jpg",
      preview: true,
    },
    {
    spotId: 2,
      url: "https://spotimage22.com",
      preview: false,
    },
    {
      spotId: 3,
      url: "https://dongardner.com/cdn/shop/articles/706-front-1.jpg?v=1713538108&width=1100", 
      preview: true,
    },
    {
      spotId: 3,
      url: "https://spotimage33.com",
      preview: false,
    },
    {
      spotId: 4,
      url: "https://www.bhg.com/thmb/3Vf9GXp3T-adDlU6tKpTbb-AEyE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
      preview: true,
    },
    {
      spotId: 4,
      url: "https://spotimage33.com",
      preview: false,
    },
    {
      spotId: 5,
      url: "https://webberstudio.com/wp-content/uploads/2023/02/Stunning-House-Design.jpg",
      preview: true,
    },
    {
      spotId: 5,
      url: "https://spotimage33.com",
      preview: false,
    },
    {
      spotId: 6,
      url: "https://preview.redd.it/this-is-my-new-tiny-house-you-love-this-if-you-interest-i-v0-zh97zgo2lz2a1.png?auto=webp&s=a70ba458a409097c3ae320850c152a39263fc2df",
      preview: true,
    },
    {
      spotId: 6,
      url: "https://spotimage33.com",
      preview: false,
    },
    {
      spotId: 7,
      url: "https://cdn.houseplansservices.com/content/6mo1qge8201lmhkqvup0ec8ldg/w991x660.jpg?v=9",
      preview: true,
    },
    {
      spotId: 7,
      url: "https://spotimage33.com",
      preview: false,
    },
    {
      spotId: 8,
      url: "https://www.mightysmallhomes.com/uploads/image5.jpg",
      preview: true,
    },
    {
      spotId: 8,
      url: "https://spotimage33.com",
      preview: false,
    },
    {
      spotId: 9,
      url: "https://markstewart.com/wp-content/uploads/2023/01/NARROW-MODERN-REAR-GARAGE-HOUSE-PLAN-MM-1163-ARROW-FRONT-VIEW-scaled.jpg",
      preview: true,
    },
    {
      spotId: 9,
      url: "https://spotimage33.com",
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
