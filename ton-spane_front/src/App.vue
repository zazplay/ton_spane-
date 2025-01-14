<script>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const isAuthPage = computed(() => route.path === '/auth');
    
    // Reactive state for authentication
    const userType = ref(sessionStorage.getItem("userType") || '');
    const isAuthenticated = ref(!!sessionStorage.getItem("authToken"));

    // Comprehensive session clearing function
    const clearSession = () => {
      sessionStorage.removeItem("userType");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("refreshToken");
      
      // Immediately update reactive variables
      userType.value = '';
      isAuthenticated.value = false;
    };

    // Storage event handler
    const handleStorageChange = () => {
      const storedType = sessionStorage.getItem("userType");
      const storedToken = sessionStorage.getItem("authToken");
      
      userType.value = storedType || '';
      isAuthenticated.value = !!storedToken;
    };

    // Initial mount setup
    onMounted(() => {
      // Initial check of session storage
      handleStorageChange();
      
      // Add storage event listener
      window.addEventListener('storage', handleStorageChange);

      // Add global event listener for logout
      window.addEventListener('logout', clearSession);
    });

    // Clean up event listeners
    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', clearSession);
    });

    // Navigation to auth page
    const goToAuth = () => {
      router.push('/auth');
    };

    // Logout function
    const logout = () => {
      // Dispatch global logout event
      window.dispatchEvent(new Event('logout'));
      
      // Clear session data
      clearSession(); 
      
      // Redirect to home/landing page
      router.push('/'); 
    };

    return {
      isAuthPage,
      userType,
      isAuthenticated,
      goToAuth,
      logout
    };
  }
}
</script>

<template>
  <router-view />
  <div class="statusMessage" v-if="!isAuthPage">
    <transition name="fade">
      <div v-if="isAuthenticated && userType === 'model'" class="modelStatus">
        <i class="fas fa-crown"></i>
        <span>Аккаунт модели</span>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="!isAuthenticated" class="authStatus" @click="goToAuth">
        <i class="fas fa-user-lock"></i>
        <span>Войдите в аккаунт</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
#app {
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 color: #2c3e50;
 width: 100%;
}

.statusMessage {
 position: fixed;
 right: 20px;
 top: 20%;
 z-index: 1000;
}

.modelStatus, .authStatus {
 padding: 8px 15px;
 border-radius: 12px;
 margin-bottom: 8px;
 font-size: 12px;
 font-weight: 500;
 display: flex;
 align-items: center;
 gap: 6px;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
 backdrop-filter: blur(8px);
 transition: all 0.3s ease;
}

.modelStatus {
 background: linear-gradient(135deg, rgba(255, 99, 132, 0.9), rgba(255, 159, 64, 0.9));
 color: white;
}

.authStatus {
 background: linear-gradient(135deg, rgba(54, 162, 235, 0.9), rgba(75, 192, 192, 0.9));
 color: white;
 cursor: pointer;
}

.authStatus:hover {
 transform: translateY(-2px);
 box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.modelStatus i, .authStatus i {
 font-size: 14px;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
 transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
 opacity: 0;
 transform: translateX(20px);
}

/* Медиа запросы */
@media screen and (max-width: 768px) {
 html {
   font-size: 32px !important;
 }

 .statusMessage {
   right: 10px;
   top: 10px;
 }

 .modelStatus, .authStatus {
   padding: 6px 12px;
   font-size: 11px;
   border-radius: 8px;
 }

 .modelStatus i, .authStatus i {
   font-size: 12px;
 }

 #app {
   transform-origin: top left;
   font-size: 1rem;
 }
}

/* Стили для темной темы */
html.dark .modelStatus {
 background: linear-gradient(135deg, rgba(255, 99, 132, 0.8), rgba(255, 159, 64, 0.8));
}

html.dark .authStatus {
 background: linear-gradient(135deg, rgba(54, 162, 235, 0.8), rgba(75, 192, 192, 0.8));
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

/* Element Plus стили */
:root {
 --el-message-z-index: 10000;
}

.el-message {
 z-index: var(--el-message-z-index) !important;
 top: 20px !important;
 left: 50% !important;
 transform: translateX(-50%) !important;
}

/* Мобильные стили для Element Plus */
@media screen and (max-width: 768px) {
 .el-message {
   width: 90% !important;
 }

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

 /* Отступы */
 .el-form-item,
 .el-button,
 .el-input,
 .el-select {
   margin: 15px 0 !important;
 }

 /* Контейнеры */
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