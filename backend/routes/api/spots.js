// backend/routes/api/spots.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, SpotImage, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


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

router.delete('/:spotId', requireAuth, async(req, res) => {
    const { spotId } = req.params;
    
    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot){
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }
        
            spot.destroy();
            return res.json({
                message: "Successfully deleted"
            });
    }
    catch(error) {
        return res.status(404).json({message: "Spot couldn't be found"});
    }
})


module.exports = router;