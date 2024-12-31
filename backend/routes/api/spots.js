// backend/routes/api/spots.js
const express = require('express')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, SpotImage, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//create a booking from spot based on spot id
router.post('/:spotId/bookings', requireAuth, async(req, res, next) => {
    const { spotId } = req.params;
    const {startDate, endDate} = req.body;
    try{
        const spot = await Spot.findByPk(spotId);

        if(!spot) {
            return res.status(404).json({ message: "Spot not found" });
        }
        if (spot.ownerId === req.user.id) {
            return res.status(403).json({
                message: "Spot must NOT belong to the current user"
            });
        }
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        if (start < today) {
          return res.status(400).json({
            message: "startDate cannot be in the past"
          });
        }
    
        if (end <= start) {
          return res.status(400).json({
            message: "endDate cannot be on or before startDate"
          });
        }
    
        const existingBookings = await Booking.findAll({
            where: { spotId }
          });
          
          const overlappingBookings = existingBookings.filter(booking => {
            const bookingStart = new Date(booking.startDate);
            const bookingEnd = new Date(booking.endDate);
          
            const isStartInRange = start >= bookingStart && start < bookingEnd;  // Check if the requested start date is within an existing booking's range
            const isEndInRange = end > bookingStart && end <= bookingEnd;        // Check if the requested end date is within an existing booking's range
            const isFullyContained = start <= bookingStart && end >= bookingEnd;  // Check if the requested booking fully contains the existing booking
          
            return isStartInRange || isEndInRange || isFullyContained;
          });
        
          if (overlappingBookings.length > 0) {
            return res.status(403).json({
              message: "Sorry, this spot is already booked for the specified dates",
              errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
              },
            });
          }

        const createBookingBySpotId = await Booking.create({
            spotId: spot.id,
            userId: req.user.id,
            startDate,
            endDate,
        })

        res.json(createBookingBySpotId)
    }
    catch(error){
       next(error)
    }
})

//get all bookings for a spot by spot id
router.get('/:spotId/bookings', requireAuth, async(req, res, next) => {
    const { spotId } = req.params;
    try{
        const spot = await Spot.findByPk(spotId)

        if(!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Require proper authorization: Spot must belong to the current user"
            });
        }

        const allBookingsBySpotId = await Spot.findByPk(spotId, {
            attributes: [],
            include: [
                {
                    model: Booking,
                    attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
                    include: [{
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }]
                }
            ]
        })

        res.json(allBookingsBySpotId)
    }
    catch(error){
        next(error)
    }
})

//get all reviews by spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
    try{
    
    const allReviewsBySpotId = await Spot.findByPk(spotId, {
        attributes: [],
        include: [
            {
                model: Review,
                include: [
                    {
                        model: ReviewImage,
                        attributes: ['id', 'url']
                    },
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    },
                ]
            },
        ]
    })

    res.json(allReviewsBySpotId)
}
catch(error){
    return res.status(404).json({ message: "Spot not found" });
}
})

//create new review by spotId
router.post('/:spotId/reviews', requireAuth, async(req, res, next) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;

    if(!review || (!stars || stars < 1 || stars > 5)){
        return res.status(400).json({ message: "Bad Request",
            "errors": {
              "review": "Review text is required",
              "stars": "Stars must be an integer from 1 to 5",
            }})
    }
    try {
        const spot = await Spot.findByPk(spotId);

        if(!spot) {
            return res.status(404).json({ message: "Spot not found" });
        }

        const existingReview = await Review.findOne({
            where: { userId: req.user.id, spotId: spot.id }
        });

        if (existingReview) {
            return res.status(500).json({
                message: "User already has a review for this spot"
            });
        }

        const newReview = await Review.create({
            userId: req.user.id,
            spotId: spotId,
            review,
            stars,
        })

            res.json(newReview)
    }
    catch(error){
        next(error)
    }
})

//create new spotImage by id
router.post('/:spotId/spotImages', requireAuth, async(req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot not found" });
        }

        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Require proper authorization: Spot must belong to the current user"
            });
        }
        
        const addImagetoSpot = await SpotImage.create({
            spotId: spot.id,
            url,
            preview,
        });

        res.json(addImagetoSpot);
    }
    catch(error){
        return res.status(404).json({ message: "Spot not found" });
    };
});


//get details of spot by id
router.get('/:spotId', async (req, res) => {
    try{
        const { spotId } = req.params
        const getDetailsBySpotId = await Spot.findByPk(spotId, {
            include: [
                {
                    model: Review,
                    attributes: ['stars', 'review'],
                  
                },
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview'],
                },
                {
                    model: User,
                    as: 'Owner',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ]
        })

        const spotsAvgRatingAndReviews = Object.values(getDetailsBySpotId).map((spot) => {
            console.log(spot)
            if (spot.Reviews && spot.Reviews.length > 0) {
                const totalRating = spot.Reviews.reduce((acc, review) => acc + review.stars, 0);
                const avgRating = totalRating / spot.Reviews.length;
                spot.avgRating = avgRating.toFixed(1);
                spot.numReviews = spot.Reviews.length;
            } else {
                spot.avgRating = 0;  
            }

            delete spot.Reviews;

            return spot;
        });
        res.json(getDetailsBySpotId);
    }
    catch(error){
        return res.status(404).json({ message: "Spot not found" });
    }
});


//edit a spot
router.put('/:spotId', requireAuth, async(req, res) => {
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        return res.status(404).json({ message: "Spot not found" });
    }
    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Require proper authorization: Spot must belong to the current user"
        });
    }

    try {
        const editSpot = await spot.update({
            ownerId: req.user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
        res.json(editSpot)
    }
    catch(error){
        return res.status(400).json({ message: "Bad Request",
            "errors": {
              "address": "Street address is required",
              "city": "City is required",
              "state": "State is required",
              "country": "Country is required",
              "lat": "Latitude must be within -90 and 90",
              "lng": "Longitude must be within -180 and 180",
              "name": "Name must be less than 50 characters",
              "description": "Description is required",
              "price": "Price per day must be a positive number"
            }});
    }
})


//create a new spot
router.post('/', requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    try {
        const createNewSpot = await Spot.create({
            ownerId: req.user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        })
        res.json(createNewSpot);
    }

    catch(error) {
        return res.status(400).json({ message: "Bad Request",
  "errors": {
    "address": "Street address is required",
    "city": "City is required",
    "state": "State is required",
    "country": "Country is required",
    "lat": "Latitude must be within -90 and 90",
    "lng": "Longitude must be within -180 and 180",
    "name": "Name must be less than 50 characters",
    "description": "Description is required",
    "price": "Price per day must be a positive number"
  }});
    }

})


//get all spots
router.get('/', async (req, res) => {
    try {
        const allSpots = await Spot.findAll({
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
        });

            const spotsAvgRating = allSpots.map((spot) => {

            if (spot.Reviews.length) {
                const totalRating = spot.Reviews.reduce((sum, review) => sum + review.stars, 0);
                const avgRating = totalRating / spot.Reviews.length;
                spot.dataValues.avgRating = avgRating.toFixed(1);
            } else {
                spot.dataValues.avgRating = 0;  
            }

            delete spot.dataValues.Reviews;

            return spot;
        });


        const spotsPreview = allSpots.map((spot) => {
            const previewImage = spot.SpotImages.find(image => image.preview === true);

            if (previewImage) {
                spot.dataValues.previewImage = previewImage.url;  
            } else {
                spot.dataValues.previewImage = null;  
            }

            delete spot.dataValues.SpotImages;

            return spot;
        });

        res.json({Spots: allSpots})
    }
    catch(error){
        return res.status(400).json({ message: "Bad Request",
            "errors": {
              "address": "Street address is required",
              "city": "City is required",
              "state": "State is required",
              "country": "Country is required",
              "lat": "Latitude must be within -90 and 90",
              "lng": "Longitude must be within -180 and 180",
              "name": "Name must be less than 50 characters",
              "description": "Description is required",
              "price": "Price per day must be a positive number"
            }});  
    }
}
)

//delete spot
router.delete('/:spotId', requireAuth, async(req, res, next) => {
    const { spotId } = req.params;
    
    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot){
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Require proper authorization: Spot must belong to the current user"
            });
        }
        
            spot.destroy();
            return res.json({
                message: "Successfully deleted"
            });
    }
    catch(error) {
        next(error);
    }
})


module.exports = router;