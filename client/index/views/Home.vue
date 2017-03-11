<template>
  <div>
    <comp-a></comp-a>
    <tabs></tabs>
  </div>
</template>

<script>
import compA from '../components/compA.vue'
import tabs from '../components/tabs.vue'
export default {
  name: 'Home',
  serverCacheKey: () => 'home',
  data () {
    return {
      list: ['test', '233']
    }
  },
  components: {
    compA,
    tabs
  },
  methods: {
    addOne () {
      this.list.push('233')
    }
  }
}
</script>
