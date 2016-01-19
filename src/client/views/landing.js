/* Copyright G. Hemingway, 2014 - All rights reserved */
"use strict";


var content         = require('ejs!../templates/landing.html');

/*************************************************************************/

module.exports = Backbone.View.extend({
    id: 'landing',
    className: 'landing',
    events: {
        'click button#btn-register':          '_reg'
    },
    initialize: function(options) {
        this.router = options.router;
    },
    _reg: function() {
        console.log('Going to Register View');
        this.router.navigate('register', { trigger: true });
    },
    render: function() {
        this.$el.html(content());
        return this;
    }
});