<!-- ลบ code เก่าออก และใส่ code ใหม่เข้าไป  โดย tag <router-view/> จะเปลี่ยนไปตาม router ที่ตั้งไว้  -->
<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  // components: {
  //   HelloWorld
  // }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
