const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
var oktaJwtVerifier = require('@okta/jwt-verifier')
const application_keys = require('../application-keys')

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

// IMPORT STUFF FROM ANOTHER FILE FOR HANDLING SERVER REQUEST TO DATABASE
app.get('/productions',(req,res)=>{
    res.send([
        'Production1',
        'Production2'
    ])
})

app.listen(application_keys.getKeys.port)
