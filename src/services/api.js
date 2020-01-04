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
    changeProduction(id,payload){
        return this.execute('put',`/productions/${id}`,payload)
    },
    getProduction(id){
        return this.execute('get',`/productions/${id}`)
    },
    getAllUsers(){
        return this.execute('get','/users')
    },
    getCurrentUser(){
        return this.execute('get','/users/me')
    },
    updateUserLevel(id,payload){
        return this.execute('put',`/productions/users/${id}`,payload)
    },
    getReservations(production_id){
        /*eslint-disable*/
        console.log(production_id)
        var response = this.execute('get',`/reservations/${production_id}`)
        console.log(response)
        return [
            {name: 'Solange'},
            {name: 'Michael Jackson'}
        ]
    },
    createReservation(production_id){
        return this.execute('post',`/reservations/${production_id}`)
    },
    //change later
    sendMail(subject,text){
        /* eslint-disable */
        console.log(subject,text)
        return this.execute('post','/sendMail')
    }
}