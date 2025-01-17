<script setup>
import { ref, defineExpose } from 'vue'
import { Lock, Star, ChatRound, Collection } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const visible = ref(false)
const router = useRouter()

const handleClose = () => {
  visible.value = false
}

const handleAuth = () => {
  router.push('/auth')
  visible.value = false
}

const open = () => {
  visible.value = true
}

defineExpose({
  open
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="handleClose">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Требуется авторизация</h3>
          <button class="close-button" @click="handleClose">×</button>
        </div>
        
        <div class="modal-content">
          <div class="icon-container">
            <el-icon class="lock-icon"><Lock /></el-icon>
          </div>
          
          <p class="main-message">Для доступа к этой функции необходима авторизация</p>
          
          <div class="features-list">
            <div class="feature-item">
              <el-icon class="feature-icon"><Star /></el-icon>
              <span>Ставьте лайки любимому контенту</span>
            </div>
            <div class="feature-item">
              <el-icon class="feature-icon"><Collection /></el-icon>
              <span>Подписывайтесь на интересных авторов</span>
            </div>
            <div class="feature-item">
              <el-icon class="feature-icon"><ChatRound /></el-icon>
              <span>Участвуйте в обсуждениях</span>
            </div>
            <div class="feature-item">
              <el-icon class="feature-icon"><Collection /></el-icon>
              <span>Сохраняйте материалы в избранное</span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="auth-button" @click="handleAuth">
            Войти или зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: linear-gradient(145deg, #1a1f2e, #242936);
  width: 90%;
  max-width: 440px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-button:hover {
  color: #fff;
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.lock-icon {
  font-size: 48px;
  color: #a855f7;
  padding: 16px;
  background: rgba(168, 85, 247, 0.1);
  border-radius: 50%;
}

.main-message {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin-bottom: 24px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.2s;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.feature-icon {
  font-size: 20px;
  color: #a855f7;
}

.feature-item span {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.auth-button {
  background: linear-gradient(45deg, #6f42c1, #a855f7);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.auth-button:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .modal-container {
    padding: 20px;
  }

  .modal-title {
    font-size: 18px;
  }

  .main-message {
    font-size: 15px;
  }

  .feature-item {
    padding: 10px;
  }

  .feature-item span {
    font-size: 14px;
  }

  .auth-button {
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>