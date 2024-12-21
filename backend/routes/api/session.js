// backend/routes/api/session.js
const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, SpotImage, ReviewImage } = require('../../db/models');
const { spotsWithPreviewAndRating } = require('./spots.js')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

  router.get('/spots', requireAuth, async (req, res) => {
    try{
      const currentUserSpots = await Spot.findAll(
        {
        where: { ownerId: req.user.id},
        include: [
        {
            model: SpotImage,
            attributes: ['url', 'preview'], 
        },
        {
            model: Review,
            attributes: ['stars'],  
        },
    ],
  },
);

const currentUserSpotsAvgRating = currentUserSpots.map((spot) => {
  if (spot.Reviews && spot.Reviews.length > 0) {
      const totalRating = spot.Reviews.reduce((acc, review) => acc + review.stars, 0);
      const avgRating = totalRating / spot.Reviews.length;
      spot.dataValues.avgRating = avgRating;
  } else {
      spot.dataValues.avgRating = 0;  
  }

  delete spot.dataValues.Reviews;

  return spot;
});

const currentUserSpotsPreview = currentUserSpots.map((spot) => {
    const previewImage = spot.SpotImages.find(image => image.preview === true);

    if (previewImage) {
        spot.dataValues.previewImage = previewImage.url;  
    } else {
        spot.dataValues.previewImage = null;  
    }

    delete spot.dataValues.SpotImages;
    return spot;
  })

      res.json({Spots: currentUserSpots})
    }
    catch(error){
      console.error(error)
    }
  })


  // Restore session user
  router.get(
    '/',
    (req, res) => {
      const { user } = req;
      if (user) {
        const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else return res.json({ user: null });
    }
  );

// Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;
  
      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
  
      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );




// Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );





module.exports = router;