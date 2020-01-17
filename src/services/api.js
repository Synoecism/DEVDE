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
    getGroups(production_id){
        return this.execute('get',`/groups/${production_id}`)

    },
    addGroup(production_id,payload){
        return this.execute('post',`/groups/${production_id}`,payload)
    }
}