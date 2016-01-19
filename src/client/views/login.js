/* Copyright G. Hemingway, 2014 - All rights reserved */
"use strict";


var content         = require('ejs!../templates/login.html'),
    User            = require('../models/user');

/*************************************************************************/

module.exports = Backbone.View.extend({
    id: 'login',
    className: 'login',
    events: {
    },
    initialize: function(options) {
        this.router = options.router;
    },
    render: function() {
        this.$el.html(content());
        return this;
    }
});