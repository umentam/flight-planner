/**
 * Created by michaelumenta on 10/12/15.
 */
"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var flightPlanSchema = new Schema({
    type: String,
    ident: String,
    special_equip: String,
    true_airspeed: String,
    departure: String,
    dept_time_proposed: String,
    dept_time_actual: String,
    cruise_alt: String,
    route: String,
    dst: String,
    ete: String,
    ete_min: String,
    remarks: String,
    fuel: String,
    fuel_min: String,
    alt_airports: String,
    name: String,
    num_aboard: String,
    color: String,
    dst_contact: String,
    active: Boolean,
    user: String,
    date: Date

});

var userSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
    first_name: String,
    last_name: String,
    dob: String,
    address_street: String,
    address_city: String,
    address_zip: String,
    primary_phone: String,
    primary_email: String,
    created: String,
    flight_plans: [flightPlanSchema]
    //slimdown version of the flight plans that the user can
    //see.
});

userSchema.pre('save', function(next) {
    //add the date created at this point
    next();
});
module.exports.userModel = mongoose.model('User', userSchema);
module.exports.flightPlanModel = mongoose.model('FlightPlan', flightPlanSchema);