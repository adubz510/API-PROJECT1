const { Sequelize } = require('./db/models');

Sequelize.showAllSchemas({ logging: false }).then(async (data) => {
  if (!data.includes(process.env.SCHEMA)) {
    await Sequelize.createSchema(process.env.SCHEMA);
  }
});