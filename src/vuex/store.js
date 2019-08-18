import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    // 收到設置User data
    SET_USER_DATA (state, userData) {
      // 設置state
      state.user = userData
      // 並設置在localstorage達到自動登入
      localStorage.setItem('user', JSON.stringify(userData))
      // 設置在每一次axoios的header Authorization 為 Bearer XXXXTOKEN
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    },
    CLEAR_USER_DATA (state) {
      // 清除本地端user資料防止loggedIn再讀取到
      localStorage.removeItem('user')
      // reload這個頁面 重置所有vue檔案
      location.reload()
    }
  },
  actions: {
    // 組建呼叫此register credentials就是我們帶入的data
    register ({ commit }, credentials) {
      // 回傳axios此一回傳 可用then串起來
      return axios.post('//localhost:3000/register', credentials).then(
        // 回來的資料就commit到mutations修改state
        ({ data }) => {
          commit('SET_USER_DATA', data)
        }
      )
    },
    login ({ commit }, credentials) {
      // 回傳axios此一回傳 可用then串起來
      return axios.post('//localhost:3000/login', credentials).then(
        // 回來的資料就commit到mutations修改state
        ({ data }) => {
          commit('SET_USER_DATA', data)
        }
      )
    },
    // 登出方法
    logout ({ commit }) {
      commit('CLEAR_USER_DATA')
    }
  },
  // 創造一個Getter取值
  getters: {
    loggedIn: state => {
      // 判斷是否有user 確定是否為登入狀態
      return !!state.user
    }
  }
})
