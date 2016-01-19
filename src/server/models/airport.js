/**
 * Created by michaelumenta on 10/12/15.
 */
"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var airportSchema = new Schema({
    type:       {type: String},
    ident:      {type: String, unique: true, required: true},
    date:       {type: Date},
    region:     {type: String},
    pos:        {type: [Number], index: '2dsphere'}
});

airportSchema.pre('save', function(next) {
    //add the date created at this point
    next();
});
module.exports.airportModel = mongoose.model('Airport', airportSchema);