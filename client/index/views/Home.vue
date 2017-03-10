<template>
  <div>
    <comp-a></comp-a>
  </div>
</template>

<script>
import compA from '../components/compA.vue'
export default {
    name: 'Home',
    serverCacheKey: () => 'home',
    data () {
        return {
            list: ['test', '233']
        }
    },
    components: {
        compA
    },
    methods: {
        addOne () {
            this.list.push('233')
        }
    }
}
</script>
