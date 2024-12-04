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
  import MenuComponent from '../MenuComponent.vue';
  
  export default {
    name: 'MainPage',
    components: {
      MenuComponent,
    },
  };
  </script>
  
  <style scoped>
.main-container-style {
    width: 100%;
    max-width: 1200px; /* или другое подходящее значение */
    margin: 0 auto;
    display: flex;
    justify-content: center;
    padding: 0 20px; /* отступы по краям */
    box-sizing: border-box;
}

.left-menu {
    width: 240px; /* фиксированная ширина для меню */
}

.container-content-style {
    width: calc(100% - 260px); /* вычитаем ширину меню + немного для отступа */
    margin-left: 20px; /* отступ от меню */
}
  </style>
  