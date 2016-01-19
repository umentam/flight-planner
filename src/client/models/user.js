/* Copyright G. Hemingway, 2014 - All rights reserved */
"use strict";


module.exports = Backbone.Model.extend({
    defaults: {
        username:               '',
        password:               '',
        first_name:             '',
        last_name:              '',
        dob:                    '',
        address_street:         '',
        address_city:           '',
        address_zip:            '',
        primary_phone:          '',
        primary_email:          '',
        flighplans:             [],
        created:                ''
    },

    urlRoot: "/v1/user"

    //url: function() {
    //    var path = '/v1/user';
    //    if (this.get('id')) {
    //        path += '/' + this.get('id');
    //    }
    //    return path;
    //}

});