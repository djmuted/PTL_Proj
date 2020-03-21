import Vue from 'vue'

import App from './App.vue'
import Login from './components/Login'
import HelloWorld from './components/HelloWorld'
import VueRouter from 'vue-router'
import store from './stores/store'

Vue.config.productionTip = false

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login'
  },

  {
    path: '/hello',
    component: HelloWorld,
    name: 'hello'
  }
];

const router = new VueRouter({
  mode: 'history',
  routes,
  base: '/'
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
