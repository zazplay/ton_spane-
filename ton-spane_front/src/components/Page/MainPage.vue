<template>
  <div class="main-container">
    <div class="left-container">
      <MenuComponent />
    </div>
    <div class="right-container">
      <!--Динамическое содержимое-->
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
    <HorizontalMenu class="horizontal-menu" />
  </div>
</template>

<script>
import HorizontalMenu from '../HorizontalMenu.vue';
import MenuComponent from '../MenuComponent.vue';

export default {
  name: "ResponsiveContainers",
  components: {
    MenuComponent,
    HorizontalMenu
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.horizontal-menu {
  display: none;
}

.left-container {
  width: 300px;
  position: absolute;
  right: 50%;
  transform: translateX(-105%);
}

.right-container {
  width: 800px;
  font-size: 14px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* Add a wrapper for the content */
.content-wrapper {
  padding-bottom: 90px; /* Base padding for the menu height */
}

@media (max-width: 1200px) {
  .left-container {
    display: none;
  }

  .horizontal-menu {
    display: flex;
  }

  .right-container {
    width: 105%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  
  /* Adjust padding for devices with safe-area-inset-bottom */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .content-wrapper {
      padding-bottom: calc(90px + env(safe-area-inset-bottom));
    }
  }
}
</style>