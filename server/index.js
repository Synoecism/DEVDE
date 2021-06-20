
//Get all backend running services
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
var oktaJwtVerifier = require("@okta/jwt-verifier");

//Settings
require("dotenv").config(); // required to be able to fetch env values
const app = express();
app.use(bodyParser.json());
app.use(express.json()); // make sure it will be in json format
app.use(cors()); // enable cross-origin resource sharing

var productionsController = require("./routes/productions");
var usersController = require("./routes/users");
var groupsController = require("./routes/groups");

//Get keys
const username = process.env.MONGODB_ATLAS_USERNAME;
const password = process.env.MONGODB_ATLAS_PASSWORD;
const database = process.env.MONGODB_ATLAS_DATABASE_NAME;

const uri = `mongodb+srv://${username}:${password}@devde-01-vglve.mongodb.net/${database}?retryWrites=true&w=majority`;

//Setup of Okta JWTVerifier
oktaJwtVerifier = new oktaJwtVerifier({
  issuer: `${process.env.OKTA_DOMAIN_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID
});

/* Connect to MongoDB Atlas Cloud Server
@ useNewUrlParser : required to be able to parse connection strings
@ useUnifiedTopology : required for mongoose to be able to monitor server
@ useFindAndModify : required to be able to use methods update methods such as findByIdAndUpdate
*/
function connect() {
  setTimeout(function() {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      connectTimeoutMS: 10000 //give up initial connection after 10 seconds
    });
  }, 10000);
}
//call connect
connect();

//Connection handling
var connection = mongoose.connection;
connection.on("error", function() {
  //triggered when an error is found
  //console.error.bind(console,`- Status: Failed to connected to MongoDB! @ ${new Date().toString()}`)
  console.log("- Status: Failed to connect to MongoDB!");
  console.log(`  @ ${new Date().toString()}`);

  //reconnect
  connect();
});
connection.once("open", function() {
  //triggerd when connection is open (final state)
  console.log('- Status: Successfully opened connection to MongoDB!');
  console.log(`  @ ${new Date().toString()}`);
});
connection.on("connecting", function() {
  console.log('- Status: Connecting to MongoDB!');
  console.log(`  @ ${new Date().toString()}`);
});
connection.on("connected", function() {
  console.log('- Status: Connected to MongoDB!');
  console.log(`  @ ${new Date().toString()}`);
});
connection.on("reconnected", function() {
  console.log('- Status: Reconnected to MongoDB!');
  console.log(`  @ ${new Date().toString()}`);
});
connection.on("disconnected", function() {
  //triggered before error
  console.log('- Status: Disconnected to MongoDB!');
  console.log(`  @ ${new Date().toString()}`);
});

// verify JWT token middleware
app.use((req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error("Authorization header is required"));
  }
  let parts = req.headers.authorization.trim().split(" ");
  let accessToken = parts.pop();
  oktaJwtVerifier
    .verifyAccessToken(accessToken, "api://default")
    .then(jwt => {
      //add user info to all request
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub
      };
      next();
    })
    .catch(next); // jwt did not verify!
});

//Setup of routes
app.use("/productions", productionsController);
app.use("/users", usersController);
app.use("/groups", groupsController);

//Setup of server error handler
app.use(function(err, req, res, next) {
  console.log(err.stack);
  var err_res = {
    message: err.message
  };
  res.status(err.status || 500);
  res.json(err_res);
});

//Setup of backend server
app.listen(process.env.SERVER_PORT, function(err) {
  if (err) throw err;
  console.log(`DEVDE Backend-server`);
  console.log(``);
  console.log(`Express server listening on port ${process.env.SERVER_PORT}.`);
  console.log(`Backend: http://localhost:${process.env.SERVER_PORT}`);
});
