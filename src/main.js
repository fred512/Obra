import Vue from 'vue'
import App from './App.vue'
import 'font-awesome/css/font-awesome.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import store from './store/store'
import './plugins/axios'
import AsyncComputed from 'vue-async-computed'
import { EmbedPlugin } from 'bootstrap-vue'

window.axios = require('axios');

Vue.use(EmbedPlugin)
Vue.use(AsyncComputed)
Vue.use(BootstrapVue)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
