// backend/routes/api/reviews.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, SpotImage, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// create new image review by review Id
router.post('/:reviewId/reviewImages', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    try{
        const review = await Review.findByPk(reviewId)

        if(!review) {
            return res.status(404).json({"message": "Review couldn't be found"})
        }

        if(review.userId !== req.user.id) {
            return res.status(403).json({
                message: "Require proper authorization: Spot must belong to the current user"
            })
        }

        const reviewImages = await ReviewImage.count({
            where: { reviewId: review.id },
        });

        if (reviewImages >= 10) {
            return res.status(403).json({
                message: "Maximum number of images for this review has been reached",
            });
        }

        const addImageReviewById = await ReviewImage.create({
            reviewId: review.id,
            url,
        })

        res.json(addImageReviewById)
    }
    catch(error){
        next(error)
    }
})


// edit an existing review
router.put('/:reviewId', requireAuth, async(req, res) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    try {
    const existingReview = await Review.findByPk(reviewId);

    if(!existingReview) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (existingReview.userId !== req.user.id) {
        return res.status(403).json({
            message: "Require proper authorization: Spot must belong to the current user"
        });
    }

    const editReview = await existingReview.update({
        review,
        stars,
    })

    res.json(editReview)
}
catch(error) {
    return res.status(400).json({message: "Bad Request",
  "errors": {
    "review": "Review text is required",
    "stars": "Stars must be an integer from 1 to 5",
  }})
}
});


//Delete a review by reviewId
router.delete('/:reviewId', requireAuth, async(req, res, next) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        };

        if (review.userId !== req.user.id) {
            return res.status(403).json({
                message: "Require proper authorization: Spot must belong to the current user"
            });
        }

        review.destroy();
        return res.json({
            message: "Successfully deleted"
        })
    }
catch(error){
    next(error)
}
})


module.exports = router;