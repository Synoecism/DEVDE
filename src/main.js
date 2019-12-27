// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuex from 'vuex'

Vue.use(require('vue-moment'));
Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.config.productionTip = false


//User are not handled in store considering using Okta (use Vue.$prototype.auth.getUser() instead)

const store = new Vuex.Store({
  state : {
    production: ''
  },
  mutations : {
    changeProduction (state, payload){
      state.production = payload
    },
    resetStore(state){
      state.production = ''
    }
  },
  getters : {
    getProduction(state){
      return state.production
    }
  }
})

/* eslint-disable no-new */
//ref: https://forum.vuejs.org/t/what-does-render-h-h-app-mean/53313/4
new Vue({
  el: '#app',
  router,
  store,
  render(h) { return h(App) }
})