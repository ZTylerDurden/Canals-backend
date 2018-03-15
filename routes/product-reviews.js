const express = require('express');
const mongoose= require('mongoose');
const Canal = require('../models/canal-model');
const Review = require('../models/review');
const reviewRoutes = express.Router();

// Route to Handle New Review Form
// router.get('/workouts/:workoutId/reviews/new', (req, res, next) => {
//     let workoutId = req.params.workoutId;

//     Workout.findById(workoutId, (err, workout) => {
//         if (err) { next(err); }
//         res.render('workout-reviews/new', { workout: workout });
//     });
// });

// Route to Handle Review Form Submission
reviewRoutes.post('/api/canals/:id/reviews', (req, res, next) =>{
    // Load the Workout from the Database
    // let id = req.params.id;
    // console.log(id)
console.log("req.params.id:  ", req.params.id)
    Canal.findById(req.params.id, (err, canal) => {
        // Create the Schema Object to Save the Review
        const newReview = new Review ({
            content: req.body.content,
            stars: req.body.stars,
            author: req.body.author
        });

        // Add Review to Workout Reviews Array
        canal.reviews.push(newReview);

        // Save the workout to the Database
        canal.save((err) =>{
            if (err) {return next(err)}

        res.status(200).json(canal); 
        });
    });
});

module.exports = reviewRoutes;