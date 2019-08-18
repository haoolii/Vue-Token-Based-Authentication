<template>
  <div>
    <!-- 防止觸發真實submit -->
    <form @submit.prevent="register">
      <label for="name">
        Name:
      </label>
      <input v-model="name" type="text" name="name" value>

      <label for="email">
        Email:
      </label>
      <input v-model="email" type="email" name="email" value>

      <label for="password">
        Password:
      </label>
      <input v-model="password" type="password" name value>

      <button type="submit" name="button">
        Register
      </button>

      <ul>
        <!-- 顯示錯誤 -->
        <li v-for="(error,index) in errors" :key="index">
          <p>{{ error }}</p>
        </li>
      </ul>
      <router-link to="/login">
        Already have an account? Login.
      </router-link>
    </form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      errors: null
    }
  },
  methods: {
    register () {
      // 註冊時直接呼叫vuex內的register
      this.$store.dispatch('register', {
        name: this.name,
        email: this.email,
        password: this.password
      })
      // 然後跳轉到dashboard
        .then(() => {
          this.$router.push({ name: 'dashboard' })
        })
        // 抓取錯誤
        .catch(err => {
          this.errors = err.response.data.errors
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
