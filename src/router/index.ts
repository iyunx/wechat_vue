import { createRouter, createWebHistory } from 'vue-router'
import { TOKEN } from '../libs/vuex'

const routes = [
  {path: '/', name: 'home', component: () => import('../views/index.vue')},
  {path: '/login', name: 'login', component: () => import('../views/login/index.vue')},
  {path: '/register', name: 'register', component: () => import('../views/login/register.vue')},
  
  {path: '/room/:id', name: 'room', component: () => import('../views/wechat/show.vue')},
  {path: '/room/launch', name: 'room.launch', component: () => import('../views/wechat/group/launch.vue')},
  {path: '/group/:id/uchange', name: 'group.uchange', component: () => import('../views/wechat/group/launch.vue')},
  {path: '/group/:id', name: 'group.show', component: () => import('../views/wechat/group.vue')},
  {path: '/group/:id/index', name: 'group.index', component: () => import('../views/wechat/group/index.vue')},
  {path: '/group/:id/list', name: 'group.list', component: () => import('../views/wechat/group/list.vue')},
  {path: '/group/:id/erwei', name: 'group.erwei', component: () => import('../views/wechat/group/erweima.vue')},
  {path: '/group/:id/join', name: 'group.join', component: () => import('../views/wechat/group/join.vue')},
  {path: '/group/:id/notice', name: 'group.notice', component: () => import('../views/wechat/group/notice.vue')},
  {path: '/manage', name: 'manage', component: () => import('../views/wechat/group/manage/index.vue')},
  {path: '/manage/adminer', name: 'manage.adminer', component: () => import('../views/wechat/group/manage/manager.vue')},
  {path: '/manage/list', name: 'manage.list', component: () => import('../views/wechat/group/manage/list.vue')},

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

// router.beforeEach((to, from) => {
//   if(!TOKEN.value) {
//     return router.push({name: 'login'})
//   }
//   // ...
//   // 返回 false 以取消导航
// })

export default router