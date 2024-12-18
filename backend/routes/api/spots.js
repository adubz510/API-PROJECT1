// backend/routes/api/spots.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, SpotImage, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allSpots = await Spot.findAll();
        res.json(allSpots);
}
    catch(error){
      console.error(error)  
    }
}
)







module.exports = router;