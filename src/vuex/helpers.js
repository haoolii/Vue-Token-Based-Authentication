import { mapGetters } from 'vuex'
// help創一個介面讓外部取得
export const authComputed = {
  ...mapGetters(['loggedIn'])
}
