import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Productions from '@/components/Productions'
import Auth from '@okta/okta-vue'
//import {application_keys} from '../application-keys.js'

Vue.use(Auth, {
  //issuer: `https://${application_keys.okta_domain}/oauth2/default`,
  issuer: 'https://dev-125361.okta.com/oauth2/default',
  client_id: '0oa2atzibaBF77WfY357',
  redirect_uri: 'http://localhost:8080/implicit/callback',
  scope: 'openid profile email'
})

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      //called after being logged in to Octa
      path: '/implicit/callback',
      component: Auth.handleCallback()
    },
    {
      path: '/productions',
      name: 'Productions',
      component: Productions,
      meta: {
        //Needs to be logged in to be accessible
        requiresAuth: true
      }
    }
  ]
})

//Implements checking before routing
router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router