<template>
  <div class="main-container">
    <div class="left-container">
      <MenuComponent />
    </div>
    <div class="right-container">
      <!--Динамическое содержимое-->
      <router-view />
      
    </div>
    <HorizontalMenu class="horizontal-menu" />
  </div>
</template>

<script>
import HorizontalMenu from '../HorizontalMenu.vue';
import MenuComponent from '../MenuComponent.vue';

export default {
  name: "ResponsiveContainers",
  components:{
    MenuComponent,
    HorizontalMenu
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  /* Центрирует правый контейнер */
  position: relative;
  width: 100%;
  /* height: 100vh; */
  /* Высота экрана */
}

.horizontal-menu {
  display: none;
}

.left-container {
  width: 300px;
  /* Ширина левого контейнера */
  /* height: 100%; */
  /* background-color: lightblue; */
  position: absolute;
  right: 50%;
  /* Совмещаем правую границу с центром экрана */
  transform: translateX(-105%);
  /* Сдвигаем левый контейнер к правому */
}

.right-container {
  width: 800px;
  /* Ширина правого контейнера */
  /* height: 100%; */
  /* background-color: lightgreen; */
  font-size: 14px;
  position: absolute;
  left: 50%;
  /* Центрируем правый контейнер по горизонтали экрана */
  transform: translateX(-50%);
}

@media (max-width: 1200px) {
  .left-container {
    display: none;
    /* Скрываем левый контейнер при ширине экрана < 1200px */
  }

  .horizontal-menu {
  display: flex;
}

.right-container {
  width: 105%;
  /* Ширина правого контейнера */
  /* height: 100%; */
  position: absolute;
  left: 50%;
  /* Центрируем правый контейнер по горизонтали экрана */
  transform: translateX(-50%);
}
}


</style>
