// backend/routes/api/bookings.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, SpotImage, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//edit an existing booking
router.put('/:bookingId', requireAuth, async(req, res, next) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
try{
    const existingBooking = await Booking.findByPk(bookingId);

    if(!existingBooking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }

    if(existingBooking.userId !== req.user.id) {
        return res.status(403).json({
            message: "Require proper authorization: Booking must belong to the current user"
        });
    }

    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if(startDate < today || end <= start) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                startDate: "startDate cannot be in the past",
                endDate: "endDate cannot be on or before startDate"
            }
        })
    }

        if(existingBooking.endDate < today) {
            return res.status(404).json({
                message: "Past bookings can't be modified"
            })
        }

        const existingBookings = await Booking.findAll({
            where: { 
                spotId: existingBooking.spotId 
            }
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

          const editBooking = await existingBooking.update({
            startDate,
            endDate
          })

          res.json(editBooking)
}
catch(error){
    next(error)
}
})



module.exports = router;