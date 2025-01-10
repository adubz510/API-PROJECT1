// backend/routes/api/spot-images.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//delete an existing spot image
router.delete('/:spotImageId', requireAuth, async(req, res, next) => {
    const { spotImageId } = req.params;

    try{
        const existingSpotImage = await SpotImage.findByPk(spotImageId)

        if(!existingSpotImage) {
            return res.status(404).json({
                message: "Spot Image couldn't be found"
            })
        }
        existingSpotImage.destroy();
        res.json({
            message: "Successfully deleted"
        })
    }
    catch(error){
        next(error)
    }
})



module.exports = router;