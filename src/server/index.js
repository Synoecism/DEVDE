const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
var oktaJwtVerifier = require('@okta/jwt-verifier')
const application_keys = require('../application-keys')
var mongoose = require('mongoose')
const uri = application_keys.getKeys.connection_string
const db_name = application_keys.getKeys.database_name

var productionsController = require('./routes/productions')

//Setup of Okta JWTVerifier
oktaJwtVerifier = new oktaJwtVerifier({
    issuer: `${application_keys.getKeys.okta_domain}/oauth2/default`,
    client_id: application_keys.getKeys.client_id
})

//Setup of express server
let app = express()

//Enable cross-origin resource sharing
app.use(cors())

//Enable parsing of JSON
app.use(bodyParser.json())

//Connect to MongoDB Atlas Cloud Server
mongoose.connect(uri,{useNewUrlParser:true, useUnifiedTopology:true});

//Connection handling
var db = mongoose.connection;
db.on('error',console.error.bind(console,'- Status: Failed to connect to MongoDB Atlas'))
db.once('open', function(){
    console.log('- Status: Succesfully connected to MongoDB Atlas')
})

//Setup of production routes
app.use('/productions',productionsController)

//Setup of server error handler
app.use(function(err, req, res, next){
    console.log(err.stack)
    var err_res = {
        message: err.message,
    };
    res.status(err.status || 500);
    res.json(err_res)
})

//Setup of backend server
app.listen(application_keys.getKeys.port, function(err){
    if (err) throw err;
    console.log(`Server running at:`)
    console.log(`- Backend: http://localhost:${application_keys.getKeys.port}`)
})