import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueSSE from "vue-sse";

Vue.use(VueSSE);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
