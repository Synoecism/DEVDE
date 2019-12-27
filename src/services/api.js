import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
    baseURL: 'http://localhost:8081/',
    json: true
})

//Centralizing API integrations
export default {
    async execute (method, resource, data) {
        //inject the accessToken for each request
        let accessToken = await Vue.prototype.$auth.getAccessToken()

        return client({
            method,
            url: resource,
            data,
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(req => {
            return req.data
        })
    },

    //Calls from client to server
    getProductions(){
        return this.execute('get','/productions')
    },
    addProduction(payload){
        return this.execute('post','/productions',payload)
    },
    getReservations(){
        return this.execute('get','/reservations')
    },

    //change later
    sendMail(subject,text){
        /* eslint-disable */
        console.log(subject,text)
        return this.execute('post','/sendMail')
    }
}