import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  axios,
  VueAxios,
  render: function (h) { return h(App) }
}).$mount('#app')
