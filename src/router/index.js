import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Productions from '@/components/Productions'
import Reservations from '@/components/Reservations'
import Groups from '@/components/Groups'
import Settings from '@/components/Settings'
import Auth from '@okta/okta-vue'
import application_keys from '../application-keys'

Vue.use(Auth, {
  issuer: `${application_keys.getKeys.okta_domain}/oauth2/default`,
  client_id: application_keys.getKeys.client_id,
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