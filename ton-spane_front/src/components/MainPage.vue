<template>
    <div class="common-layout main-container-style">
      <el-container>
        <el-aside class="left-menu">
          <MenuComponent />
        </el-aside>
        <el-container class="container-content-style">
          <!-- Динамическое содержимое -->
          <router-view />
        </el-container>
      </el-container>
    </div>
  </template>
  
  <script>
  import MenuComponent from './MenuComponent.vue';
  
  export default {
    name: 'MainPage',
    components: {
      MenuComponent,
    },
  };
  </script>
  
  <style scoped>
  .main-container-style {
    width: 810px;
    margin: 0 auto;
  }
  
  .left-menu {
    width: 20%;
  }
  .container-content-style {
    width: 80%;
  }
  </style>
  