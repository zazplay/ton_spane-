<template>
  <div class="common-layout main-container-style">
    <el-container>
      <el-aside class="left-menu">
        <MenuComponent />
      </el-aside>
      <el-container class="container-content-style">
        <!-- Динамическое содержимое -->
        <router-view />
        <HorizontalMenu class="horizontal-menu"/>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import HorizontalMenu from '../HorizontalMenu.vue';
import MenuComponent from '../MenuComponent.vue';

export default {
  name: 'MainPage',
  components: {
    MenuComponent,
    HorizontalMenu
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
  transition: all 0.3s ease;
}

.horizontal-menu{
  display: none;
}

/* Медіа-запити для екранів менше 1200px */
@media screen and (max-width: 1199px) {
  .main-container-style {
    width: 100%;
  }

  .left-menu {
    display: none !important;
  }

  .horizontal-menu{
    display: flex;
  }
  .container-content-style {
    width: 100%;
    /* Розтягуємо контейнер */
    margin: 0 auto;
    /* Центруємо його */
    text-align: center;
    /* Додаємо центрування тексту */
  }
}
</style>
