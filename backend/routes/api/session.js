// backend/routes/api/session.js
const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, SpotImage, ReviewImage } = require('../../db/models');

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

//   //get all current user's bookings
//   router.get('/bookings', requireAuth, async(req, res, next) => {
//     try{
//       const currentUserBooking = await Booking.findAll({
//         where: { userId: req.user.id },
//         include: [
//           {
//             model: Spot,
//             attributes: ['ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', ],
//             include: [
//               {
//                   model: SpotImage,
//                   attributes: ['url', 'preview'], 
//                   where: {preview: true},
//                   required: false,
//               },
//             ],
//           }
//         ]
//       })

//      currentUserBooking.map((booking) => {
//         const spot = booking.Spot;

//           if (spot.ownerId !== req.user.id) {
//     return res.status(403).json({
//         message: "Require proper authorization: Spot must belong to the current user"
//     });
// }
        
//         let previewImage = null
//         if (spot.SpotImages && spot.SpotImages.length > 0) {
//             previewImage = spot.SpotImages[0].url;
//             }

//             spot.dataValues.previewImage = previewImage;

//             delete spot.dataValues.SpotImages;

//         return booking;
//       })

//       res.json({Bookings: currentUserBooking })
//     }
//     catch(error){
//       next(error)
//     }
//   })

//   //get all spots owned by current user
//   router.get('/spots', requireAuth, async (req, res) => {
//     try{
      
//       const currentUserSpots = await Spot.findAll(
//         {
//         where: { ownerId: req.user.id},
//         include: [
//         {
//             model: SpotImage,
//             attributes: ['url', 'preview'], 
//         },
//         {
//             model: Review,
//             attributes: ['stars'],  
//         },
//     ],
//   },
// );

// currentUserSpots.map((spot) => {
//   if (spot.Reviews && spot.Reviews.length > 0) {
//       const totalRating = spot.Reviews.reduce((acc, review) => acc + review.stars, 0);
//       const avgRating = totalRating / spot.Reviews.length;
//       spot.dataValues.avgRating = avgRating;
//   } else {
//       spot.dataValues.avgRating = 0;  
//   }

//   delete spot.dataValues.Reviews;

//   return spot;
// });

// currentUserSpots.map((spot) => {
//     const previewImage = spot.SpotImages.find(image => image.preview === true);

//     if (previewImage) {
//         spot.dataValues.previewImage = previewImage.url;  
//     } else {
//         spot.dataValues.previewImage = null;  
//     }

//     delete spot.dataValues.SpotImages;
//     return spot;
//   })

//       res.json({Spots: currentUserSpots})
//     }
//     catch(error){
//       console.error(error)
//     }
//   })

  // //get all reviews of current user
  // router.get('/reviews', requireAuth, async(req, res) => {
  //   try{
  //     const currentUserReviews = await Review.findAll(
  //       {
  //         where: {userId: req.user.id},
  //         include: [
  //           {
  //             model: User,
  //             attributes: ['id', 'firstName', 'lastName']
  //         },
  //         {
  //           model: ReviewImage,
  //           attributes: ['id', 'url']  
  //       },
  //           {
  //             model: Spot,
  //             attributes: [
  //               'id', 
  //               'ownerId', 
  //               'address', 
  //               'city', 
  //               'state', 
  //               'country', 
  //               'lat', 
  //               'lng', 
  //               'name', 
  //               'price',
  //           ],
  //           include: [
  //             {
  //               model: SpotImage,
  //               attributes: ['url', 'preview'] 
  //           },
  //           ]
  //            },

  //         ]
  //       })
  //       const processedReviews = currentUserReviews.map((review) => {
  //         const spot = review.Spot;
  //         const previewImage = spot.SpotImages.find(image => image.preview === true);

  //         if (previewImage) {
  //             spot.dataValues.previewImage = previewImage.url;  
  //         } else {
  //             spot.dataValues.previewImage = null; 
  //         }

  //         delete spot.dataValues.SpotImages; 

  //         return review;
  //       })   
    
  //     res.json({Reviews: processedReviews})
  //   }
  //   catch(error){
  //     console.error(error)
  //   }
  // })

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