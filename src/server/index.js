const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
var oktaJwtVerifier = require('@okta/jwt-verifier')
const application_keys = require('../application-keys')
const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const uri = application_keys.getKeys.connection_string
const db_name = application_keys.getKeys.database_name

var client;

oktaJwtVerifier = new oktaJwtVerifier({
    issuer: `${application_keys.getKeys.okta_domain}/oauth2/default`,
    client_id: application_keys.getKeys.client_id
})

let app = express()
app.use(cors())
app.use(bodyParser.json())

// verify JWT token middleware
app.use((req, res, next) =>{
    //require every request to have an authorization header
    if(!req.headers.authorization){
        return next(new Error('Authorization header is required'))
    }

    let parts = req.headers.authorization.trim().split(' ')
    let accessToken = parts.pop()

    //api:default is the expected audience
    oktaJwtVerifier.verifyAccessToken(accessToken,'api://default')
        .then(jwt => {
            req.user = {
                uid: jwt.claims.uid,
                email: jwt.claims.sub
            }
            next()
        })
        .catch((e)=>{
            console.log(e)
        })
})

var mongoClient = new MongoClient(uri, { 
    useUnifiedTopology: true})

mongoClient.connect((err,db) => {
    //returns db connection
    if(err != null){
        console.log(err)
        return
    }
    client = db
})

app.get('/reservations', (req,res)=> {
    const collection = client.db(db_name).collection("Reservations")
    collection.find().toArray(function (err, results){
        if (err) {
            console.log(err)
            res.send([])
            return
        }
        res.send(results)
    })
})

// IMPORT STUFF FROM ANOTHER FILE FOR HANDLING SERVER REQUEST TO DATABASE
app.get('/productions',(req,res)=>{
    res.send([
        'Production1',
        'Production2'
    ])
})

//PRINT SOME STUFF REGARDING SETTING UP THE SERVER SIDE 
app.listen(application_keys.getKeys.port)
