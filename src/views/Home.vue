<template>
  <div class="home">
    <h1>Welcome to the App!</h1>
    <!-- 是否登入 登入了就不要顯示 -->
    <div v-if="!loggedIn">
      To user this app you'll need to 
      <router-link to="/login">
        Login
      </router-link>
      or
      <router-link to="/register">
        Register
      </router-link>
    </div>
  </div>
</template>

<script>
import { authComputed } from '../vuex/helpers.js'
export default {
  // 引入helper展開 authComputed
  computed:{
    ...authComputed
  }
}
</script>
