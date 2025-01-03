'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(
        models.User, {
          // as: 'Owner',
          foreignKey: 'userId',
        }
      )
      Review.belongsTo(
        models.Spot, {
          foreignKey: 'spotId',
        }
      )
      Review.hasMany(
        models.ReviewImage, {
          foreignKey: 'reviewId',
          onDelete: 'CASCADE',
          hooks: true,
        }
      )
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    spotId: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100],
        isReview(value) {
          if (value === null) {
            throw new Error("Review text is required")
          }
        }
      },
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isStars(value) {
          if (value < 1 || value > 5) {
            throw new Error("Stars must be an integer from 1 to 5")
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};