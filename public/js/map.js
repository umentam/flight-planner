$('#map-container').mousedown(logDownPosition);
$('#map-container').mouseup(logUpPosition);
$('#map-container').mouseup(logDistance);

var downX,
    downY,
    upX,
    upY,
    lat,
    long;

function logDownPosition(e) {
    downX = e.clientX;
    downY = e.clientY;
    console.log("Mousedown X: " + downX + " Mousedown Y: " + downY);
}

function logUpPosition(e) {
    upX = e.clientX;
    upY = e.clientY;
    console.log("Mouseup X: " + upX + " Mouseup Y: " + upY);
}

function logDistance(e) {
    distance = Math.round(Math.sqrt(Math.pow(downY - upY, 2) + Math.pow(downX - upX, 2))) + 'px';
    console.log('Distance: ' + distance);

}

function findClosestAirport(){
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

window.onload = function(){
    var map = L.map('map').setView([36.147, -86.777], 3);
    map.on('click', function(e) {
        lat = e.latlng.lat;
        long = e.latlng.lng;
        console.log("Lat: " + lat + ", Long: " + long);
        findClosestAirport();
    });
    L.tileLayer('/v1/tiles/' + '?type=vfr&z={z}&x={x}&y={y}', {
        attribution: 'Graham Hemingway Productions',
        maxZoom: 10,
        id: 'umentam.cifhck3382e3iiulx5m2gck1w',
        accessToken: 'pk.eyJ1IjoidW1lbnRhbSIsImEiOiJjaWZoY2s0Ym05dWhvcjdseHUyZ21tZ3B4In0.GiA0z1Fj2KQaN_kH9r-DxQ',
        tms: true
    }).addTo(map);
}
