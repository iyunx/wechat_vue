import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {path: '/', name: 'home', component: () => import('../views/index.vue')},
  {path: '/login', name: 'login', component: () => import('../views/login/index.vue')},
  {path: '/register', name: 'register', component: () => import('../views/login/register.vue')},
  
  {path: '/room/:id', name: 'room', component: () => import('../views/wechat/show.vue')},
  {path: '/room/launch', name: 'room.launch', component: () => import('../views/wechat/launch.vue')},
  // {path: '/chat/:id', name: 'chat', component: () => import('../views/wechat/show.vue')},

  {path: '/user/:id(\\d+$)', name: 'user', component: () => import('../views/user/show.vue')},
  {path: '/user/search', name: 'user.search', component: () => import('../views/user/search.vue')},
  {path: '/user/:id/create', name: 'user.create', component: () => import('../views/user/add.vue')},
  {path: '/user/remind', name: 'user.remind.index', component: () => import('../views/user/remind/index.vue')},
  {path: '/user/:uid/remind/:id', name: 'user.remind.show', component: () => import('../views/user/remind/show.vue')},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router