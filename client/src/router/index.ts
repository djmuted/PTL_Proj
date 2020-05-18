import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import VideoChat from "@/views/VideoChat.vue";

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/form',
    name: 'Nick Form',
    component: () => import(/* webpackChunkName: "about" */ '../views/NickForm.vue')
  },
  {
    path: '/',
    name: 'Video Call',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/VideoChat.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
