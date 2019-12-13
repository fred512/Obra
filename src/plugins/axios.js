import Vue from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://www.netshake.net.br/obra/asp/'

var local = location.host
if (local == 'localhost:8082') axios.defaults.baseURL = 'http://www.gigovvt.es.caixa/obra/asp/'
if (local == 'www.gigovvt.des.es.caixa') axios.defaults.baseURL = 'http://www.gigovvt.es.caixa/obra/asp/'
if (local == 'www.gigovvt.es.caixa') axios.defaults.baseURL = 'http://www.gigovvt.es.caixa/obra/asp/'

Vue.use({
  install(Vue) {
    Vue.prototype.$http = axios
    Vue.prototype.$local = local
  }
})