/**
 * Created by michaelumenta on 11/8/15.
 */

var mongoose        = require('mongoose'),
    models          = require("./../src/server/models/airport"),
    Airport         = models.airportModel;

mongoose.connect('mongodb://192.168.99.100:32768/umentam');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Mongo Connected");
    editedLatLong.forEach(addAirportsToMongo);
    console.log("All done loading airports to the database");
});

var airports = require('./../data/apt.json');

function isAnAirport(element){
    return element.type == "AIRPORT";
}

var filteredAirports = airports.filter(isAnAirport);

var editedLatLong = filteredAirports.map(function(airport){
    airport.pos = [(airport.longitudeSec / 3600) * -1, airport.latitudeSec / 3600];
    return airport;

});

function addAirportsToMongo(element, index, array) {
    var newAp = new Airport(element);
    newAp.save(function(res, err) {
        if(err) {
             res.status(400).send({ error: 'Error with loading airport into the database'});
        } else {
        }
    });
}
