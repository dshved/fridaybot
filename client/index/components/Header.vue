<template>
  <header class="header">
    <div class="logo">
      <img src="./../assets/parrot.svg" alt="" class="logo__img">
      <h1 class="logo__text">#friday</h1>
    </div>
  </header>
</template>
<script>
export default {
  data () {
    return {
      button: {
        signIn: {
          show: true,
          state: 'success',
          line: false,
          loading: false
        },
        signUp: {
          show: true,
          state: 'success',
          line: true,
          loading: false
        }
      }
    }
  },
  computed: {
    HeaderNav () {
      return this.$store.getters.HeaderNav
    },
    User () {
      return this.$store.getters.User
    }
  },
  mounted () {
    window.addEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile () {
      if (window.innerWidth > 800) {
        this.$store.dispatch('hideHeaderNav')
      }
    },
    toggleMNav () {
      if (this.HeaderNav.show) {
        this.$store.dispatch('hideHeaderNav')
      } else {
        this.$store.dispatch('showHeaderNav')
      }
    }
  }
}
</script>

<style>
.logo {
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: center;
}

img.logo__img {
  width: 227px;
}

.logo__text {
  margin: 0;
  font-size: 72px;
}
</style>
