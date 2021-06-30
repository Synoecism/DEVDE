/* eslint no-use-before-define: 0 */
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Productions from './views/Productions'
import Reservations from './views/Reservations'
import Groups from './views/Groups'
import Settings from './views/Settings'
import Auth from '@okta/okta-vue'

// get keys
const keys = require('../keys')
const OKTA_DOMAIN_URL = keys.OKTA_DOMAIN_URL;
const OKTA_CLIENT_ID = keys.OKTA_CLIENT_ID;

Vue.use(Auth, {
  issuer: `https://${OKTA_DOMAIN_URL}/oauth2/default`,
  client_id: OKTA_CLIENT_ID,
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
    },
    {
      path: '/reservations',
      name: 'Reservations',
      component: Reservations,
      meta: {
        //Needs to be logged in to be accessible
        requiresAuth: true
      }
    },
    {
      path: '/groups',
      name: 'Groups',
      component: Groups,
      meta: {
        //Needs to be logged in to be accessible
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
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