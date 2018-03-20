const express = require('express');
const mongoose= require('mongoose');
const Canal = require('../models/canal-model');
const Review = require('../models/review');
const User = require('../models/user-model');

const reviewRoutes = express.Router();


// Route to Handle Review Form Submission
reviewRoutes.post('/api/canals/:id/reviews', (req, res, next) =>{
    // Load the Workout from the Database
    // let id = req.params.id;
    // console.log(id)

    if (!req.user) {
        res.status(401).json({ message: "Log in to update the canal." });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          res.status(400).json({ message: "Specified id is not valid" });
          return;
      }
    console.log("req.params.id:  ", req.params.id)
    Canal.findById(req.params.id, (err, canal) => {
        if(err){
            res.status(500).json({message: "Some weird error from DB."});
            return;
        }
        // console.log("req.user._id", req.user._id)
        // console.log("canal is:", canal.owner)
        // if(req.user._id === canal.owner){
        //     res.status(400).json({ message: "You can't post review on your own canal sir!" });
        //     return;
        //   }
        // Create the Schema Object to Save the Review
        const newReview = new Review ({
            content: req.body.content,
            stars: req.body.stars,
            author: req.user.username
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

// get the reviews
// reviewRoutes.get('/api/canals/:id/allreviews', (req, res, next) => {
//     if (!req.user) {
//         res.status(401).json({ message: "Log in to update the canal." });
//         return;
//       }
//       if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//           res.status(400).json({ message: "Specified id is not valid" });
//           return;
//       }
//       Canal.findById(req.params.id, (err, foundCanal) => {
//         if(err){
//             res.status(500).json({message: "Some weird error from DB."});
//             return;
//         }

//       })
// })



module.exports = reviewRoutes;