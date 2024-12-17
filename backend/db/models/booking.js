'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(
        models.User, {
          foreignKey: 'userId',
        }
      )
      Booking.belongsTo( 
        models.Spot, {
          foreignKey: 'spotId',
        }
      )
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isStartDate(value){
          if(new Date(value) < new Date()) {
            throw new Error("startDate cannot be in the past")
          }
        },
        isDate: true,
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isEndDate(value){
        if(new Date(value) <= new Date(this.startDate)) {
          throw new Error("endDate cannot be on or before startDate")
          }
        },
        isDate: true,
      },
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};