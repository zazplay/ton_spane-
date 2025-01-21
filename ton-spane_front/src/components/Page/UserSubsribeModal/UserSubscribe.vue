<template>
  <div class="subscription-container">
    <!-- Header -->
    <div class="header">
      <button class="back-button" @click="handleGoBack">
        
        <el-icon><ArrowLeftBold /></el-icon>
      </button>
      <button class="subscribe-button" @click="showPaymentModal">
    Оформить подписку
    <div class="button-glow"></div>
  </button>
      <div class="profile-section">
        <el-image :src="USER_IMG" class="avatar" />
        <h1 class="title">Спонсорство {{ USER_NICKNAME }}</h1>
      </div>
    </div>

    <!-- Subscription Plans -->
    <div class="plans-container">
      <div 
        v-for="(item, index) in subscriptionItems" 
        :key="index"
        class="plan-card"
      >
        <div class="plan-content">
          <img :src="item.icon" class="plan-icon" />
          <span class="plan-text">{{ item.text }}</span>
        </div>
        
      </div>
      
    </div>
    
  </div>  
  <PaymentModal ref="paymentModalRef" />
</template>
  
  <script setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PaymentModal from '../PaymentPage/PaymantModal.vue'

// Импорт иконок
import fireIcon from '@/assets/fire-svgrepo-com.svg?url'
import hotPepper from '@/assets/hot-pepper-chili-svgrepo-com.svg'
import message from '@/assets/message-svgrepo-com.svg'
import bonus from '@/assets/plus-add-svgrepo-com.svg'

// Константы с использованием ref для реактивности
const USER_IMG = ref("")
const USER_NICKNAME = ref("")

// Router
const router = useRouter()
const route = useRoute()

// Ref для модального окна
const paymentModalRef = ref(null)

const showPaymentModal = () => {
  paymentModalRef.value.openDialog()
}

const fetchUserData = async () => {
  try {
    const response = await axios.get(`https://ton-back-e015fa79eb60.herokuapp.com/api/models/${route.params.id}`)
    
    // Обновляем данные
    USER_IMG.value = response.data.profilePicture
    USER_NICKNAME.value = response.data.username.split('@')[0]
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error)
  }
}

const handleGoBack = () => router.go(-1)

onMounted(() => {
  fetchUserData()
})

// Данные подписок
const subscriptionItems = [
  {
    icon: fireIcon,
    text: 'Эксклюзивный контент',
    shadow: 'always'
  },
  {
    icon: hotPepper,
    text: 'Самые жаркие фото',
    shadow: 'hover'
  },
  {
    icon: message,
    text: 'Личная переписка',
    shadow: 'never'
  },
  {
    icon: bonus,
    text: 'Уникальные бонусы',
    shadow: 'never'
  }
]
</script>
  
<style scoped>
/* Темная тема - .subscription-container */
html.dark .subscription-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(145deg, #1a1e2d, #242936);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 100px; /* Space for fixed button */
}

/* Светлая тема - .subscription-container */
html:not(.dark) .subscription-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(145deg, #f1f5f9, #e2e8f0);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 100px; /* Space for fixed button */
}

.header {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

/* Темная тема - .back-button */
html.dark .back-button {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
}

/* Светлая тема - .back-button */
html:not(.dark) .back-button {
  width: 44px;
  height: 44px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1f2937;
}

/* Темная тема - .back-button:hover */
html.dark .back-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Светлая тема - .back-button:hover */
html:not(.dark) .back-button:hover {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.2);
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.avatar {
  height: 120px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin: 0;
  background: linear-gradient(135deg, #60a5fa, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.plans-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Темная тема - .plan-card */
html.dark .plan-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Светлая тема - .plan-card */
html:not(.dark) .plan-card {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Темная тема - .plan-card:hover */
html.dark .plan-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(96, 165, 250, 0.3);
}

/* Светлая тема - .plan-card:hover */
html:not(.dark) .plan-card:hover {
  transform: translateY(-2px);
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(59, 130, 246, 0.3);
}

/* Темная тема - .plan-content */
html.dark .plan-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
}

/* Светлая тема - .plan-content */
html:not(.dark) .plan-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
}

/* Темная тема - .plan-icon */
html.dark .plan-icon {
  width: 32px;
  height: 32px;
  padding: 8px;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 12px;
}

/* Светлая тема - .plan-icon */
html:not(.dark) .plan-icon {
  width: 32px;
  height: 32px;
  padding: 8px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
}

/* Темная тема - .plan-text */
html.dark .plan-text {
  font-size: 16px;
  color: #fff;
  font-weight: 500;
}

/* Светлая тема - .plan-text */
html:not(.dark) .plan-text {
  font-size: 16px;
  color: #1f2937;
  font-weight: 500;
}

.subscribe-button {
  position: fixed;
  /* bottom: 4rem; */
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 1rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: gradientBG 10s ease infinite;
  z-index: 100;
  min-width: 250px;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  overflow: hidden;
  position: relative;
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
  animation: rotate 10s linear infinite;
  pointer-events: none;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.subscribe-button:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5);
}

@media (max-width: 768px) {
  .subscription-container {
    padding: 1.5rem;
    border-radius: 20px;
    margin: 1rem;
    margin-bottom: 100px;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .title {
    font-size: 20px;
  }

  .plan-text {
    font-size: 15px;
  }

  .subscribe-button {
    width: 80%;
    padding: 0.875rem 1.5rem;
    font-size: 16px;
    min-width: auto;
  }
}
</style>