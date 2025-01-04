<script>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const route = useRoute();
    const isAuthPage = computed(() => route.path === '/auth');

    // Безопасное получение userType
    const userType = ref(sessionStorage.getItem("userType") || '');

    // Обновление при монтировании
    onMounted(() => {
      const storedType = sessionStorage.getItem("userType");
      userType.value = storedType || '';
      console.log('Current user type:', userType.value);
    })

    // Следим за изменениями в sessionStorage
    window.addEventListener('storage', () => {
      userType.value = sessionStorage.getItem("userType") || '';
    });

    return {
      isAuthPage,
      userType // Возвращаем userType чтобы использовать в шаблоне
    };
  }
}
</script>

<template>
  <router-view />
  <div class="statusModelMessage" v-if="userType === 'model'">
    Аккаунт модели
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  caret-color: transparent;  /* Скрываем курсор выделения */
}

.statusModelMessage{
  position: fixed;
  right: 0;
  top:20%;
  background: rgba(255, 0, 0, 0.2);
    padding: 10px;
  border-radius: 10px;
  margin: 10px;
  color:white;
  font-size: 10px;
}

.floating-theme-switcher {
 position: fixed;
 top: 20px;
 right: 20px;
 z-index: 9999;
 pointer-events: auto;
 isolation: isolate;
}

.floating-theme-switcher .theme-button {
 box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.theme-button .el-icon {
 font-size: 20px;
}

/* Мобильные стили */
@media screen and (max-width: 768px) {
 html {
   font-size: 32px !important;
 }

 #app {
   transform-origin: top left;
   font-size: 1rem;
 }

 .floating-theme-switcher {
   top: 40px;
   right: 40px;
   transform: scale(2.5);
   transform-origin: top right;
 }

 .theme-button .el-icon {
   font-size: 24px !important;
 }

 /* Element Plus компоненты */
 .el-button {
   height: auto !important;
   padding: 20px 40px !important;
   font-size: 1rem !important;
 }

 .el-input__inner {
   height: 60px !important;
   line-height: 60px !important;
   font-size: 1rem !important;
 }

 .el-form-item {
   margin-bottom: 30px !important;
 }

 .el-form-item__label {
   font-size: 1rem !important;
   line-height: 2 !important;
 }

 .el-select,
 .el-dropdown,
 .el-menu-item {
   font-size: 1rem !important;
 }

 /* Отступы для компонентов */
 .el-form-item,
 .el-button,
 .el-input,
 .el-select {
   margin: 15px 0 !important;
 }

 /* Контейнеры и сетка */
 .el-container,
 .el-row,
 .el-col {
   width: 100% !important;
   margin: 0 !important;
   padding: 10px !important;
 }

 /* Таблицы */
 .el-table {
   font-size: 1rem !important;
 }

 .el-table th,
 .el-table td {
   padding: 20px !important;
 }
}
</style>

<style>
/* Стили для уведомлений Element Plus */
:root {
  --el-message-z-index: 10000;
}

.el-message {
  z-index: var(--el-message-z-index) !important;
  top: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

@media screen and (max-width: 768px) {
  .el-message {
    width: 90% !important;
  }
}
</style>