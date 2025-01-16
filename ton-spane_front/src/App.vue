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

    // Auth Modal State
    const showAuthModal = ref(false);
    const authModalTargetRoute = ref(null);

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

    // Auth Modal Handlers
    const handleShowAuthModal = (event) => {
      showAuthModal.value = true;
      authModalTargetRoute.value = event.detail.targetRoute;
    };

    const closeAuthModal = () => {
      showAuthModal.value = false;
      authModalTargetRoute.value = null;
    };

    const goToAuth = () => {
      router.push('/auth');
      closeAuthModal();
    };

    // Initial mount setup
    onMounted(() => {
      // Initial check of session storage
      handleStorageChange();
      
      // Add storage event listener
      window.addEventListener('storage', handleStorageChange);

      // Add global event listener for logout
      window.addEventListener('logout', clearSession);

      // Add global event listener for auth modal
      window.addEventListener('show-auth-modal', handleShowAuthModal);
    });

    // Clean up event listeners
    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', clearSession);
      window.removeEventListener('show-auth-modal', handleShowAuthModal);
    });

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
      logout,
      showAuthModal,
      closeAuthModal,
      authModalTargetRoute
    };
  }
}
</script>

<template>
  <router-view />
  
  <div v-if="showAuthModal" class="auth-modal-overlay">
    <div class="auth-modal-content">
      <div class="auth-modal-header">
        <h2>Необходима авторизация</h2>
        <button @click="closeAuthModal" class="close-modal-btn">
          <el-icon><Close /></el-icon>
        </button>
      </div>
      <div class="auth-modal-body">
        <p style="color: aliceblue;">Для доступа к этой странице и многим другим функциям вам нужно войти в аккаунт</p>
        <div class="auth-modal-icon">
          <el-icon :size="48" color="#4b7bec"><UserFilled /></el-icon>
        </div>
        <div class="auth-features">
          <p style="color: aliceblue;">После авторизации вам будут доступны:</p>
          <ul>
            <li><el-icon><BellFilled /></el-icon> Уведомления</li>
            <li><el-icon><VideoCamera /></el-icon> Клипы</li>  
            <li><el-icon><ChatDotRound /></el-icon> Сообщения</li>
            <li><el-icon><Wallet /></el-icon> Покупки</li>
            <li><el-icon><MoreFilled /></el-icon> Дополнительные функции</li>
          </ul>
        </div>
      </div>
      <div class="auth-modal-actions">
        <el-button type="primary" @click="goToAuth" class="auth-modal-login" round>
          <template #icon>
            <el-icon><Right /></el-icon>  
          </template>
          Войти
        </el-button>
        <el-button @click="closeAuthModal" class="auth-modal-cancel" round>Отмена</el-button>
      </div>
    </div>
  </div>


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
  color: #333;
  width: 100%;
}

.statusMessage {
  position: fixed;
  right: 20px;
  top: 200px;
  z-index: 1000;
}

.modelStatus, 
.authStatus {
  padding: 10px 20px;
  border-radius: 50px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.modelStatus {
  background: linear-gradient(135deg, #ee9ca7, #ffdde1);
  color: #333;
}

.authStatus {
  background: linear-gradient(135deg, #56ccf2, #2f80ed);
  color: white;
  cursor: pointer;
}

.authStatus:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.modelStatus i,
.authStatus i {  
  font-size: 16px;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {  
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Media queries */  
@media screen and (max-width: 768px) {
  .statusMessage {
    right: 10px;
    top: 20px;
  }
  
  .modelStatus,
  .authStatus {
    padding: 8px 16px;  
    font-size: 12px;
    border-radius: 40px;  
  }

  .modelStatus i,
  .authStatus i {
    font-size: 14px;
  }
}

/* Dark theme styles */
html.dark .modelStatus {  
  background: linear-gradient(135deg, #434343, #000000);
  color: white;
}

html.dark .authStatus {
  background: linear-gradient(135deg, #000428, #004e92);  
}  
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.auth-modal-content {
  background: linear-gradient(145deg, #1a1f2e, #242936);
  border-radius: 20px;
  padding: 32px;
  width: 400px;
  max-height: 85vh;
  overflow: auto;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.auth-modal-header {
  margin-bottom: 32px;
  position: relative;
}

.auth-modal-header h2 {
  margin: 0;
  font-size: 25px;
  color: rgb(255, 195, 195);

}

.close-modal-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 24px;
  height: 24px;
  transition: color 0.3s;
}

.close-modal-btn:hover {
  color: #ff4757;
  transform: rotate(90deg);
}

.auth-modal-body {
  margin-bottom: 40px;
}

.auth-modal-icon {
  margin: 24px 0;
  color: #34d399;
  font-size: 48px;
}

.auth-features {
  text-align: left;
  margin-top: 24px;
}

.auth-features ul {
  list-style: none;
  padding: 0;
  margin: 12px 0;
}

.auth-features li {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}

.auth-features .el-icon {
  font-size: 20px;
  color: #34d399; 
}

.auth-modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.auth-modal-login,
.auth-modal-cancel {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: none; 
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.auth-modal-login {
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(52, 211, 153, 0.3);
}

.auth-modal-login:hover {
  opacity: 0.85;
  transform: translateY(-2px);
}

.auth-modal-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.auth-modal-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.auth-modal-login:active,
.auth-modal-cancel:active {
  opacity: 0.7;
  transform: translateY(1px);  
}

/* Responsive Styles */
@media screen and (max-width: 480px) {
  .auth-modal-content {
    width: 90%;
    padding: 24px;
  }
}
</style>