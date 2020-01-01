const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
var oktaJwtVerifier = require('@okta/jwt-verifier')
const application_keys = require('../application-keys')
var mongoose = require('mongoose')
const uri = application_keys.getKeys.connection_string

var productionsController = require('./routes/productions')
var usersController = require('./routes/users')


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

/* Connect to MongoDB Atlas Cloud Server
@ useNewUrlParser : required to be able to parse connection strings
@ useUnifiedTopology : required for mongoose to be able to monitor server
@ useFindAndModify : required to be able to use methods update methods such as findByIdAndUpdate
*/
mongoose.connect(uri,{useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false});
//https://stackoverflow.com/questions/16226472/mongoose-autoreconnect-option

//Connection handling
var db = mongoose.connection;
db.on('error',console.error.bind(console,'- Status: Failed to connect to MongoDB Atlas'))
db.once('open', function(){
    console.log('- Status: Succesfully connected to MongoDB Atlas')
})

// verify JWT token middleware
app.use((req, res, next) => {
    // require every request to have an authorization header
    if (!req.headers.authorization) {
      return next(new Error('Authorization header is required'))
    }
    let parts = req.headers.authorization.trim().split(' ')
    let accessToken = parts.pop()
    oktaJwtVerifier.verifyAccessToken(accessToken,'api://default')
      .then(jwt => {
          //add user info to all request
        req.user = {
          uid: jwt.claims.uid,
          email: jwt.claims.sub
        }
        next()
      })
      .catch(next) // jwt did not verify!
  })

//Setup of production routes
app.use('/productions',productionsController)

//Setup of user routes
app.use('/users',usersController)

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