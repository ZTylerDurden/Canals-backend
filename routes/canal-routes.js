const mongoose = require("mongoose");
const express = require("express");
const multer = require('multer');
const canalRoutes = express.Router();

const Canal = require('../models/canal-model');

// multer for photo, this is some module to use up to 5 photos, extra feature
const myUploader = multer({
  dest: __dirname + "/../public/uploads/"
});


// create new phone, can also use POSTMAN to create a new phone object
canalRoutes.post('/api/canals', myUploader.single('canalImage'), (req, res, next) => {
    if(!req.user){
        res.status(401).json({message: "Log in to create canal."});
        return;
    }
    const newCanal = new Canal({
      canalName: req.body.canalName,
      lat: req.body.lat,
      lng: req.body.lng,
      description: req.body.description,
      fishTypes: req.body.fishTypes,
      image: req.body.image,
      observations: req.body.observations,
      owner: req.user.username
    });
    if(req.file){
        newCanal.image = '/uploads/' + req.file.filename;
    }

    newCanal.save((err) => {
        if(err){
            res.status(500).json({message: "Some weird error from DB."});
            return;
        }
        // validation errors
        if (err && newCanal.errors){
            res.status(400).json({
                canalNameError: newCanal.errors.canalName,
            });
            return;
        }
        // Same as the previous example where POSTMAN won't show the user PW with this activated
        req.user.encryptedPassword = undefined;
        newCanal.user = req.user;

        res.status(200).json(newCanal);
    });
});

// list the phones

canalRoutes.get('/api/canals', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Log in to see canals." });
      return;
    }
    Canal.find()
      // retrieve all the info of the owners (needs "ref" in model)
      // don't retrieve "encryptedPassword" though
      .populate('user', { encryptedPassword: 0 })
      .exec((err, allTheCanals) => {
        if (err) {
          res.status(500).json({ message: "Canals find went bad." });
          return;
        }
        res.status(200).json(allTheCanals);
      });
});

// list single phone
canalRoutes.get("/api/canals/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to see THE canal." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Canal.findById(req.params.id, (err, theCanal) => {
    if (err) {
      // res.json(err);
      res.status(500).json({ message: "Canals find went bad." });
      return;
    }

    res.status(200).json(theCanal);
  });
});

// update the phone, USING PUT IN THIS CASE
canalRoutes.put('/api/canals/:id', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Log in to update the canal." });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }
console.log("===================")
    const updates = {
      canalName: req.body.canalName,
      lat: req.body.lat,
      lng: req.body.lng,
      description: req.body.description,
      fishTypes: req.body.fishTypes,
      observations: req.body.observations   
    };

    console.log("image is:", req.body.image)
    if (req.body.image){
        updates.image = req.body.image;
      }
  Canal.findByIdAndUpdate(req.params.id, updates, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Canal updated successfully."
    });
  });
});

// delete phone
canalRoutes.delete("/api/canals/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to delete the canal." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid." });
    return;
  }

  Canal.remove({ _id: req.params.id }, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Canal has been removed."
    });
  });
});


module.exports = canalRoutes;
