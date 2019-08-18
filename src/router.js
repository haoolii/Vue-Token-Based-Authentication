import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import RegisterUser from './views/RegisterUser.vue'
import LoginUser from './views/LoginUser.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      // 自定義meta
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterUser
    },
    {
      path: '/login',
      name: 'login',
      component: LoginUser
    }
  ]
})

// 所有路由執行前會在這
router.beforeEach((to, from, next) => {
  // 取得本地端user判斷有沒有登陸
  const loggedIn = localStorage.getItem('user')

  // 如果在要去的router設定內有找到requiresAuth就要進去
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果有需要auth而且又沒登陸
    if (!loggedIn) {
      // 倒回'/'
      next('/')
    } else {
      // 有登陸就進去
      next()
    }
  } else {
  // 不需要auth就直接進去吧
    next()
  }
})

export default router
