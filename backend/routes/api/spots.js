// backend/routes/api/spots.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, SpotImage, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


router.get('/:spotId', async (req, res) => {
    try{
        const { spotId } = req.params
        const findSpot = await Spot.findByPk(spotId, {
            include: [
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview'],
                },
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                }
            ]
        })
        res.json(findSpot);
    }
    catch(error){
        console.error(error)
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

        const spotsWithPreviewAndRating = allSpots.map((spot) => {
            const previewImage = spot.SpotImages.find(image => image.preview === true);

            if (previewImage) {
                spot.dataValues.previewImage = previewImage.url;  
            } else {
                spot.dataValues.previewImage = null;  
            }

            delete spot.dataValues.SpotImages;

            if (spot.Reviews && spot.Reviews.length > 0) {
                const totalRating = spot.Reviews.reduce((sum, review) => sum + review.stars, 0);
                const avgRating = totalRating / spot.Reviews.length;
                spot.dataValues.avgRating = avgRating;
            } else {
                spot.dataValues.avgRating = 0;  
            }

            delete spot.dataValues.Reviews;

            return spot;
        });
        
        res.json({Spots: allSpots})
}
    catch(error){
      console.error(error)  
    }
}
)







module.exports = router;