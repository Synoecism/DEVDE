import axios from 'axios'
const application_keys = require('../application-keys')

const client = axios.create({
    baseURL: `${application_keys.getKeys.okta_domain}`,
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization' : `SSWS ${application_keys.getKeys.okta_token}`
    }
})

//Centralizing API integrations
export default {
    async execute (method, resource, data) {

        return client({
            method,
            url: resource,
            data
        }).then(req => {
            return req.data
        })
    },

    //HERE ARE THE CALLS FROM CLIENT TO SERVER
    getAllOktaUsers(){
        // this works
        return this.execute('get','/api/v1/users/me')

        // this doesnt work
        //return this.execute('get','/api/v1/users')
    }
}

