import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/store'
import axios from 'axios'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created () {
    // 自動登錄 取出localstorage
    const userString = localStorage.getItem('user')
    // 如果有東西的話
    if (userString) {
      // 轉成json
      const userData = JSON.parse(userString)
      // 設置vuex store
      this.$store.commit('SET_USER_DATA', userData)
    }
    // axios 如果有任何錯誤發生 (更改自己的localstorage導致dashboard等等其他出錯)
    // 401是未授權
    axios.interceptors.response.use(
      response => response,
      error => {
        // 401就登出
        if (error.response.status === 401) {
          this.$store.dispatch('logout')
        }
        return Promise.reject(error)
      }
    )
  },
  render: h => h(App)
}).$mount('#app')
