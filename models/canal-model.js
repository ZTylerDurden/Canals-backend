const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var integerValidator = require('mongoose-integer');

// create geolocation Schema
const GeoSchema = new Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});

const CanalSchema = new Schema({
        canalName: { 
        type: String 
        },
        location: {
        type: String
        },
        lat: {
            type: Number, 
            integer: true
        },
        lng: {
            type: Number,
            integer: true
        },
        description: {
            type: String,
        },
        fishTypes: { 
            type: Number,
            integer: true
        },
        image: { 
            type: String 
        },
        owner: { 
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        observations: [String],
        // add in maps location 
        geometry: GeoSchema
        // add in images to Schema
    },
    {
        timestamps: true
    }
);



const Canal =mongoose.model('Canal', CanalSchema);

module.exports = Canal;
