<style src="./assets/_ionicicon.css"></style>
<style src="./assets/base.css"></style>
<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  color: #555459;
}
*,*:before, *:after {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
ul,li {
  margin: 0;
  padding: 0;
}
html,body {
  margin: 0;
  padding: 0;
}
body {
  background-color: #F9F9F9;
  font-size: 16px;
}
</style>

<template>
  <div id="app">
    <um-header></um-header>
    <router-view class="view"></router-view>
  </div>
</template>

<script>
import umHeader from './components/Header.vue'
export default {
  components: {
    umHeader
  }
}
</script>
