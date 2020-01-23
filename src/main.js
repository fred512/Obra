import Vue from "vue";
import App from "./App.vue";
import "font-awesome/css/font-awesome.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import BootstrapVue from "bootstrap-vue";
import store from "./store/store";
import "./plugins/axios";
import AsyncComputed from "vue-async-computed";
import { EmbedPlugin } from "bootstrap-vue";

import VueMq from "vue-mq";
Vue.use(VueMq, {
  breakpoints: {
    // default breakpoints - customize this
    sm: 1024,
    md: 1250,
    lg: Infinity
  },
  defaultBreakpoint: "sm" // customize this for SSR
});
Vue.use(EmbedPlugin);
Vue.use(AsyncComputed);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
