'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(
        models.User, {
          as: 'Owner',
          foreignKey: 'ownerId',
        }
      )
      Spot.hasMany(
        models.SpotImage, {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true
        }
      )
      Spot.hasMany(
        models.Booking, {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true,
        }
      )
      Spot.hasMany(
        models.Review, {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true,
        }
      )
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 80],
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 20],
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 80],
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isLat(value){
          if(value < -90 || value > 90) {
            throw new Error('Latitude must be within -90 and 90')
          }
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isLng(value){
          if(value < -180 || value > 180) {
            throw new Error('Longitude must be within -180 and 180')
          }
      },
    },
  },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isName(value){
          if(value.length > 50){
            throw new Error('Name must be less than 50 characters')
          }
      },
    },
  },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0,100],
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isPrice(value){
          if(value <= 0) {
            throw new Error('Price per day must be a positive number')
          }
        }
        }
      },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};