/* Copyright G. Hemingway, 2015 - All rights reserved */
'use strict';

var User = require('../models/user');

import React from 'react';

/*************************************************************************/

export default class MapView extends React.Component {

    constructor(props) {
        super(props);
        this.logDistance = this.logDistance.bind(this);
        this.logDownPosition = this.logDownPosition.bind(this);
        this.logUpPosition = this.logUpPosition.bind(this);
        this.findClosestAirport = this.findClosestAirport.bind(this);
        this.state = {downX: 0, downY: 0, upX: 0, upY: 0, lat: 0, long: 0};
    }


    logDistance(e) {
        var distance = Math.round(Math.sqrt(Math.pow(this.state.downY - this.state.upY, 2) + Math.pow(this.state.downX - this.state.upX, 2))) + 'px';
        console.log('Distance: ' + distance);
    }

    logDownPosition(e) {
        this.state.downX = e.clientX;
        this.state.downY = e.clientY;
        console.log("Mousedown X: " + this.state.downX + " Mousedown Y: " + this.state.downY);
    }

    logUpPosition(e) {
        this.state.upX = e.clientX;
        this.state.upY = e.clientY;
        console.log("Mouseup X: " + this.state.upX + " Mouseup Y: " + this.state.upY);
    }

    findClosestAirport(){
        $.ajax({
            url: "/v1/airport/" + this.state.lat + "/" + this.state.long + "/" + 20000,
            type: "GET",
            success: function (result) {
                console.log(result.result);
            },
            error: function (err) {
                console.log('Error: ' + JSON.stringify(err.responseJSON));
            }
        });
    }

    componentDidMount(){
        var map = L.map('map').setView([36.147, -86.777], 10);
        var self = this;
        map.on('click', function(e) {
            self.state.lat = e.latlng.lat;
            self.state.long = e.latlng.lng;
            console.log("Lat: " + self.state.lat + ", Long: " + self.state.long);
            self.findClosestAirport();
        });
        L.tileLayer('/v1/tiles/' + '?type=vfr&z={z}&x={x}&y={y}', {
            attribution: 'Graham Hemingway Productions',
            maxZoom: 10,
            id: 'umentam.cifhck3382e3iiulx5m2gck1w',
            accessToken: 'pk.eyJ1IjoidW1lbnRhbSIsImEiOiJjaWZoY2s0Ym05dWhvcjdseHUyZ21tZ3B4In0.GiA0z1Fj2KQaN_kH9r-DxQ',
            tms: true
        }).addTo(map);

        document.getElementById('map').addEventListener('mousedown', this.logDownPosition);
        document.getElementById('map').addEventListener('mouseup', this.logUpPosition)
        document.getElementById('map').addEventListener('mouseup', this.logDistance)
    }


    render() {
        return <div id="map"></div>;
    }
}

MapView.propTypes = {
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};