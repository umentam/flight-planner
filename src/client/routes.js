/* Copyright G. Hemingway, 2015 - All rights reserved */
"use strict";

import React from                     'react';
import ReactDOM from                  'react-dom';

var LandingView             = require('./views/landing'),
    LoginView               = require('./views/login');
    //MapView                 = require('./views/map');


import RegisterView from    './views/register.jsx';
import ProfileView from    './views/profile.jsx';
import MapView from        './views/mapyy.jsx';
import PlanView from       './views/plan.jsx';
import ReviewPlanView from       './views/reviewplan.jsx';


/*************************************************************************/

module.exports = Backbone.Router.extend({
    routes: {
        '':                             '_landing',
        'login':                        '_login',
        'signup':                       '_register',
        'profile/:username':            '_profile',
        'profile':                      '_profiledef',
        'map':                          '_map',
        'plan':                         '_plan',
        'reviewplan':                   '_review_plan',
        '*path':                        '_default'
    },
    initialize: function(options) {
        this.app = options.app;
    },

    _login: function() {
        console.log('Login path');
        if(this.view) this.view.remove();
        this.view = new LoginView({
            router: this
        });
        $('#mainDiv').html(this.view.render().el);
    },

    _register: function() {
        ReactDOM.render(<RegisterView router={this} dispatcher={this.app} />, document.getElementById('mainDiv'));
    },
    _profile: function() {
        ReactDOM.render(<ProfileView router={this} dispatcher={this.app} />, document.getElementById('mainDiv'));
    },

    _profiledef: function() {
        var username = sessionStorage.getItem("username");
        console.log(username);
        this.navigate('profile/' + username);
    },
    _map: function() {
        ReactDOM.render(<MapView router={this} dispatcher={this.app} />, document.getElementById('mainDiv'));
        //console.log('Map path');
        //if(this.view) this.view.remove();
        //this.view = new MapView({
        //    router: this
        //});
        //$('#mainDiv').html(this.view.render().el);
    },
    _plan: function() {
        ReactDOM.render(<PlanView router={this} dispatcher={this.app} />, document.getElementById('mainDiv'));
    },
    _review_plan: function() {
        ReactDOM.render(<ReviewPlanView router={this} dispatcher={this.app} />, document.getElementById('mainDiv'));
    },

    _landing: function() {
        console.log('Landing path');
        if (this.view) this.view.remove();
        this.view = new LandingView({
            router: this
        });
        $('#mainDiv').html(this.view.render().el);
    },

    /************** Default Route ************************/

    _default: function(modelPath) {
        console.log('Default path taken!!!');
        this.navigate(modelPath, { trigger: false });
    }
});