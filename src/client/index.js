/* Copyright G. Hemingway, 2015 - All rights reserved */
"use strict";


// Necessary modules
require('../../node_modules/leaflet/dist/leaflet.css');
var Router          = require('./routes');

/*************************************************************************/

// Primary App class
var App  = function() {
    var self = this;
    // Establish the global URL router
    this._router = new Router({ app: this });

    var startRouting = function() {
        Backbone.history.start({pushState: true});
    };
    startRouting();

    /*************************************************************************/
};

_.extend(App.prototype, Backbone.Events);

/*************************************************************************/

// Invoke the new app
module.exports = new App();