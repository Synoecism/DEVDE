import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
    baseURL: 'http://localhost:8081/',
    json:true
})

//Centralizing API integrations
export default {
    async execute (method, resource, data) {
        /* eslint-disable */
        console.log('inside execute')

        //inject the accessToken for each request
        let accessToken = await Vue.prototype.$auth.getAccessToken()

        /* eslint-disable */
        console.log(accessToken)

        return client({
            method,
            url: resource,
            data,
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(req => {
            /* eslint-disable */            
            console.log('inside then(Req=>)')
            console.log(req.data)
            return req.data
        })
    },
    getProductions(){
            /* eslint-disable */
            console.log('inside getproductions')
        return this.execute('get','/productions')
    }
}