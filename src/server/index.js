'use strict';

var express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    _               = require('underscore'),
    session         = require('express-session'),
    mongoose        = require('mongoose'),
    models          = require("./models/user"),
    airModel        = require("./models/airport"),
    geolib          = require("geolib"),
    redis           = require("redis"),
    User            = models.userModel,
    FlightPlan      = models.flightPlanModel,
    Airport         = airModel.airportModel;


mongoose.connect('mongodb://192.168.99.100:32768/umentam');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Mongo Connected");
});

// Establish connection to Redis
var redisClient = redis.createClient('32769', '192.168.99.100');
redisClient.on('ready', function() {
    console.log('Redis Connected.');
}).on('error', function() {
    console.log('Not able to connect to Redis.');
    process.exit(-1);
});

var app = express();
app.set('view engine', 'jade');
app.set('views', './src/server/views');
app.use(express.static('public'));
app.use(logger('combined'));
app.use(session({
    secret: 'musessions',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 2592000000
    }
}));

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

var users = [
    { username: 'tumbler', password: 'WBush', first_name: 'George', last_name: 'Bush', primary_email: 'decider@bush2.com' },
    { username: 'eagle', password: 'BlueDress', first_name: 'William', last_name: 'Clinton', primary_email: 'slickwilly@clinton.com' },
    { username: 'renegade', password: 'yeswecan', first_name: 'Barak', last_name: 'Obama', primary_email: 'nearly.done@potus.gov' },
    { username: 'timberwolf', password: 'nobroccoli', first_name: 'George', last_name: 'Bush', primary_email: 'nogonnadoit@bush1.com' },
    { username: 'rawhide', password: 'lovenancy', first_name: 'Ronald', last_name: 'Reagan', primary_email: 'gipper@reagan.com' }
];

var plans = [];


// Handle POST to create a user session
app.post('/v1/session', function(req, res) {
    var data = req.body;
    if (!req.body || !req.body.username || !req.body.password) {
        res.status(400).send({ error: 'username and password required' });
    } else {
        User.findOne({username: data.username, password: data.password}, function(err, data1){
            if(err){
                res.status(400).send({ error: err });
            } else
            {
                if (!data1) {
                    res.status(401).send({ error: 'Username or password incorrect' });
                } else {
                    res.status(201).send({
                        username:       data1.username,
                        primary_email:  data1.primary_email
                    });
                }
            }
        });

    }
});


// Handle POST to create a new user account
//app.post('/v1/user', function(req, res) {
//    var data = req.body;
//    if (!data || !data.username || !data.password || !data.first_name || !data.last_name || !data.primary_email) {
//        res.status(400).send({ error: 'username, password, first_name, last_name and primary_email required' });
//    } else {
//        data.created = Date.now();
//        var newUser = new User(data);
//        newUser.save(function(err) {
//            if(err) {
//                res.status(400).send({ error: 'Username is taken, select a new username'});
//            } else {
//                redisClient.set('USER:' + newUser.username, JSON.stringify(data));
//                res.status(201).send({
//                    username: newUser.username,
//                    primary_email: newUser.primary_email
//                });
//            }
//        });
//    }
//});

//app.post('/v1/user/:id', function(req, res) {
//    var data = req.body;
//    if (!data || !data.username || !data.password || !data.first_name || !data.last_name || !data.primary_email) {
//        res.status(400).send({ error: 'username, password, first_name, last_name and primary_email required' });
//    } else {
//        data.created = Date.now();
//        var users = _.findWhere(users, { username: data.username.toLowerCase() });
//        if (user) {
//            res.status(400).send({ error: 'username already in use' });
//        } else {
//            var newUser = _.pick(data, 'username', 'first_name', 'last_name', 'password', 'dob', 'address_street', 'address_city', 'address_state', 'address_zip', 'primary_phone', 'primary_email');
//            users.push(newUser);
//            res.status(201).send({
//                username:       data.username,
//                primary_email:  data.primary_email
//            });
//        }
//    }
//});

app.post('/v1/user/', function(req, res) {
    console.log("COMMUNICATION HAS BEEN REACHED");
    var data = req.body;
    if (!data || !data.username || !data.password || !data.first_name || !data.last_name || !data.primary_email) {
        res.status(400).send({ error: 'username, password, first_name, last_name and primary_email required' });
    } else {
        data.created = Date.now();
        var newUser = new User(data);
        console.log(newUser);
        newUser.save(function(err) {
            if(err) {
                //res.status(400).send({ error: 'Username is taken, select a new username'});
                console.log(err);
                res.status(400).send({ error: err });
            } else {
                redisClient.set('USER:' + newUser.username, JSON.stringify(data));
                res.status(201).send({
                    username: newUser.username,
                    primary_email: newUser.primary_email
                });
            }
        });
    }
});

// Handle GET to fetch user information
app.get('/v1/user/:username', function(req, res) {
    // Attempt to search with Mongoose for this item
    redisClient.get('USER:' + req.params.username, function(err, data) {
        if (err) {
            res.status(404).send({ error: 'redis error' });
        } else if (!data) {
            User.findOne({ username: req.params.username }, function(err, user) {
                redisClient.set('USER:' + req.params.username, JSON.stringify(user));
                res.status(200).send(user);
            });
        } else {
            res.status(200).send(JSON.parse(data));
        }
    });
});

// Handle POST to edit user information
app.post('/v1/user/:username/edit', function(req, res) {
    var data = req.body;
    for(var key in data)
    {
        if(data[key]) {
            var object = {};
            object[key] = data[key];
            User.update({username: req.params.username},
                {
                    $set: object
                },
                function(err, results){
                    if(err){
                        res.status(404).send({ error: 'Error editing the profile' });
                    }
                    else {
                        console.log("recaching the user profile");
                        recacheUser(req.params.username);
                    }
                });
        }
    }
    res.status(201).send('');
});

// Handle GET to fetch the map tile information
app.get('/v1/tiles', function(req, res) {
    var z = req.query.z,
    x = req.query.x,
    y = req.query.y;

    //redisClient.get('MAP:' + z + '/' + x  + '/' + y, function(err, data) {
       // if (err) {
         //   res.status(400).send({ error: err });
        //} else {
          //  if(!data){
                var file = '/Users/michaelumenta/WebstormProjects/Michael_Umenta_HW_6/data/map_images/' + z + '/' + x  + '/' + y + '.png';
               // var file  = __dirname + './../../data/map_images/' + z + '/' + x  + '/' + y + '.png';
                var file_data = {file: file};
                redisClient.set('MAP:' + z + '/' + x  + '/' + y, file);
                res.sendFile(file);
           // } else {
              //  res.sendFile(data);
            //}
        //}
    //});
});

app.get('/v1/airport/:lat/:long/:maxDist', function(req, res) {
    var lat = req.params.lat;
    var long = req.params.long;
    var maxDist = req.params.maxDist;

    Airport.find({pos: {$near: {$geometry: {type: "Point" , coordinates: [long, lat]},
    $maxDistance: maxDist}}},
        function (err, data) {
        if (err) {
            res.status(404).send({ error: err });
        } else {
            if(data.length == 0){
                var result = "No airports within a 2000 meter radius of your click."
                res.status(404).send({error: result});
            }
            else {
                var distance = geolib.getDistance({latitude: lat, longitude: long}, {latitude: data[0].pos[1], longitude: data[0].pos[0]});
                var miles = distance * 0.000621371;
                var result = "Closest Airport: " + data[0].ident + " Miles Away: " + miles;
                res.status(201).send({result: result});
            }
        }
    });
});


// Flight plan fields:
//  1. TYPE as type
//  2. AIRCRAFT IDENTIFICATION as ident
//  3. AIRCRAFT TYPE / SPECIAL EQUIPMENT as special_equip
//  4. TRUE AIRSPEED as true_airspeed
//  5. DEPARTURE POINT as departure
//  6a. DEPARTURE TIME PROPOSED as dept_time_proposed
//  6b. DEPARTURE TIME ACTUAL as dept_time_actual
//  7. CRUISING ALTITUDE as cruise_alt
//  8. ROUTE OF FLIGHT as route
//  9. DESTINATION (Name of airport and city) as dst
//  10. EST. TIME ENROUTE as ete
//  11. REMARKS as remarks
//  12. FUEL ON BOARD as fuel
//  13. ALTERNATE AIRPORT(S) as alt_airports
//  14. PILOT'S NAME, ADDRESS & TELEPHONE NUMBER & AIRCRAFT HOME BASE as name
//  15. NUMBER ABOARD as num_aboard
//  16. COLOR OF AIRCRAFT as color
//  17. DESTINATION CONTACT/TELEPHONE (OPTIONAL) as dst_contact

// Handle POST to create a new flight plan
app.post('/v1/plan', function(req, res) {
    var data = req.body;
    var username = data.param;
    if (!data ||
        !data.type ||
        !data.ident ||
        !data.special_equip ||
        !data.true_airspeed ||
        !data.departure ||
        !data.dept_time_proposed ||
        !data.dept_time_actual ||
        !data.cruise_alt ||
        !data.route ||
        !data.dst ||
        !data.ete ||
        !data.remarks ||
        !data.fuel ||
        !data.alt_airports ||
        !data.name ||
        !data.num_aboard ||
        !data.color ||
        !data.dst_contact) {
        res.status(400).send({ error: 'all form fields required' });
    } else {
        data.date = Date.now();
        var newPlan = new FlightPlan(data);
        newPlan.active = true;
        newPlan.user = username;
        newPlan = _.extend(newPlan, { id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) });
        User.update({username: username},
            {
                $push: {flight_plans: newPlan}
            },
            function(err, results){
                if(err){
                    console.log(err);
                }
                else {
                    recacheUser(username);
                }
            });
        newPlan.save(function(err) {
            if(err) {
                console.log(err);
            } else {
                redisClient.set('PLAN:' + newPlan.id, JSON.stringify(newPlan));
                console.log("New Flight Plan Cached");
            }
        });
        res.status(201).send({
            planid: newPlan.id
        });
    }
});

// Handle GET to fetch flight plan information corresponding to a user
app.get('/v1/user/:username/plans', function(req, res) {
    redisClient.get('USER:' + req.params.username, function(err, data) {
        console.log(data);
        if (err) {
            res.status(404).send({ error: 'redis error' });
        } else if (!data.flight_plans) {
            FlightPlan.find({user: req.params.username, active: true}, function(err, plans){
                if(err){
                    res.status(400).send({ error: err });
                } else
                {
                    if (!plans) {
                        console.log({ error: 'unknown user' });
                    } else {
                        res.status(201).send(plans);
                    }
                }
            });
        } else {
            res.status(200).send(JSON.parse(data));
        }
    });
});


// Handle GET to fetch flight plan information
app.get('/v1/user/:username/plans/:id', function(req, res) {
    redisClient.get('PLAN:' + req.params.id, function(err, data) {
        if (err) {
            res.status(404).send({ error: 'redis error' });
        } else if (!data) {
            FlightPlan.findById('' + req.params.id, function(err, plan){
                if(err){
                    res.status(400).send({ error: err });
                } else
                {
                    if (!plan) {
                        res.status(404).send({ error: 'unknown flight plan' });
                    } else {
                        redisClient.set('PLAN:' + req.params.id, JSON.stringify(plan));
                        res.status(201).send(plan);
                    }
                }
            });
        } else {
            res.status(200).send(JSON.parse(data));
        }
    });
});

app.post('/v1/user/:username/plans/:id/edit', function(req, res) {

    var data = req.body;
    for(var key in data)
    {
        if(data[key]) {
            var object = {};
            object[key] = data[key];
            FlightPlan.update({_id: req.params.id},
                {
                    $set: object,
                },
                function(err, results){
                    if(err){
                        res.status(404).send({ error: 'Error editing flight plan' });
                    }
                    else {
                        recacheUser(req.params.username);
                        recachePlanId(req.params.id);
                    }
                });
        }
    }
    res.status(201).send('');
});

app.get('/v1/user/:username/plans/:id/delete', function(req, res) {
    FlightPlan.remove({_id: req.params.id},
        function(err, results){
            if(err){
                res.status(404).send({ error: 'Error removing flight plan' });
            }
            else {
                recacheUser(req.params.username);
                recachePlanId(req.params.id);
            }
        });
    res.status(201).send('');
});

// Render the base HTML document

app.get('*', function(req, res) {
    res.render('base', {
        title: 'Flight Scheduler'
    });
});

var server = app.listen(8080, function () {
    console.log('Example app listening on ' + server.address().port);
});

function getFlightPlans(username) {
    var flightPlans;
    User.findOne({username: username}, function (err, data) {
        if (err) {
            console.log({error: err});
        } else {
            if (!data) {
                console.log({error: 'Username incorrect'});
            } else {
                flightPlans = data.flight_plans;
            }
        }
        return flightPlans;
    });
}

function recacheUser(username){
    redisClient.del('USER:' + username);
    User.findOne({ username: username}, function(err, user) {
        // Stuff this into redis
        redisClient.set('USER:' + username, JSON.stringify(user));
    });
}

function recachePlanId(id) {
    redisClient.del('PLAN:' + id);
    FlightPlan.findById('' + id, function(err, plan) {
        if (err) {
            res.status(400).send({error: err});
        } else {
            redisClient.set('PLAN:' + id, JSON.stringify(plan));
        }
    });
}
