// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var fs             = require('fs');
var redis = require('redis');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var cluster = require('cluster');
var client = redis.createClient(); //CREATE REDIS CLIENT



// configuration ===========================================
    
// config files
//var db = require('./config/db');  //uncomment to connect to database

// set our port
var port = process.env.PORT || 8080;


// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 



/*app.use(cookieParser());
app.use(expressSession({
  secret: '7acaa0fb-8b28-4e75-a95b-0ae7ca3f4b98',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))*/

//Redis session
app.use(cookieParser());
app.use(expressSession({
      store: new RedisStore({
        host: "localhost",
        port:"6379",
        pass: "h8TXL7]z",
        client: client,
        ttl: 1800
      }),
      secret: "6acaa0fb-2b40-4e75-a85b-0ae7ca3f6b96",
      duration: "30 * 60 * 1000",
      activeDuration:"5 * 60 * 1000",
      saveUninitialized:false,
      resave:true,
      rolling:true,
      cookie: { 
        maxAge: 1800000
      }
}));


// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/frontend'));

// routes ==================================================
// Load up the routers
var routers = require('./routes');
routers.set(app, fs);

// start app ===============================================
// startup our app at http://localhost:8888
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;         