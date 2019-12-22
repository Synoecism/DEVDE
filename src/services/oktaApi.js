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
        return this.execute('get','/api/v1/users')
    },
    testOktaCall(){
        var baseUrl = application_keys.getKeys.okta_domain;
        var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
             xhr.onerror = function() {
                alert('Invalid URL or Cross-Origin Request Blocked.  You must explicitly add this site (' + window.location.origin + ') to the list of allowed websites in the administrator UI');
            }
            xhr.onload = function() {
                alert(this.responseText);
            };
            xhr.open('GET', baseUrl + '/api/v1/users/me', true);
            xhr.withCredentials = true;
            xhr.send();
        } else {
            alert("CORS is not supported for this browser!")
        }
    }
}

