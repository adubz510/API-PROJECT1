// backend/routes/api/reviewImages.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, SpotImage, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//delete an existing spot image
router.delete('/:reviewImageId', requireAuth, async(req, res, next) => {
    const { reviewImageId } = req.params;

    try{
        const existingReviewImage = await ReviewImage.findByPk(reviewImageId)

        if(!existingReviewImage) {
            return res.status(404).json({
                message: "Review Image couldn't be found"
            })
        }
        existingReviewImage.destroy();
        res.json({
            message: "Successfully deleted"
        })
    }
    catch(error){
        next(error)
    }
})



module.exports = router;