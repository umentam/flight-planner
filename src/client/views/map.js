/* Copyright G. Hemingway, 2014 - All rights reserved */
"use strict";


var content         = require('ejs!../templates/map.html');

/*************************************************************************/

module.exports = Backbone.View.extend({
    id: 'map',
    className: 'map',
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