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
        <h1 class="title">ГОДОВОЕ СПОНСОРТВО {{ USER_NICKNAME }}</h1>
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

  <!-- Fixed Subscribe Button -->
  
  
  <PaymentModal ref="paymentModalRef" />
</template>
  
  <script setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PaymentModal from '../PaymentPage/PaymantPage.vue'

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
    text: 'Доступ к премиум контенту на целый год',
    shadow: 'always'
  },
  {
    icon: hotPepper,
    text: 'Эксклюзивные фото и видео материалы',
    shadow: 'hover'
  },
  {
    icon: message,
    text: 'Приоритетное общение в личных сообщениях',
    shadow: 'never'
  },
  {
    icon: bonus,
    text: 'Специальные бонусы для годовых подписчиков',
    shadow: 'never'
  }
]
</script>
  
<style scoped>
.subscription-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #2e1b4b, #432b6f);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  margin-bottom: 100px; /* Space for fixed button */
}

.header {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.back-button {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #f2e1ff;
}

.back-button:hover {
  transform: translateX(-4px);
  background: rgba(255, 255, 255, 0.2);
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
  background: linear-gradient(135deg, #e58f65, #f4b860);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.plans-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plan-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.plan-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(245, 133, 98, 0.5);
}

.plan-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
}

.plan-icon {
  width: 32px;
  height: 32px;
  padding: 8px;
  background: rgba(245, 133, 98, 0.2);
  border-radius: 12px;
}

.plan-text {
  font-size: 16px;
  color: #f2e1ff;
  font-weight: 500;
}

.subscribe-button {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 1rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #ff8a5c, #ffc95c, #ff5e78);
  background-size: 200% 200%;
  color: #2e1b4b;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: gradientBG 8s ease infinite;
  z-index: 100;
  min-width: 250px;
  box-shadow: 0 8px 25px rgba(255, 140, 88, 0.4);
  overflow: hidden;
  position: relative;
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
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
  box-shadow: 0 12px 30px rgba(255, 140, 88, 0.6);
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
