<template>
    <div class="thankyou-wrapper">
      <div class="thankyou-container">
        <!-- Header -->
        <div class="header">
          <button class="back-button" @click="$router.go(-1)">
            <el-icon><ArrowLeftBold /></el-icon>
          </button>
          
          <div class="message-section">
            <div class="success-animation">
              <div class="success-circle">
                <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
              </div>
            </div>
            <h1 class="title">СПАСИБО ЗА ПОДДЕРЖКУ!</h1>
            <h2 class="subtitle">Мы ценим каждого из вас</h2>
          </div>
        </div>
  
        <!-- Message -->
        <div class="message-container">
          <div class="message-card">
            <div class="sparkle-icon">✨</div>
            <p class="message-text">Спасибо что вы с нами!</p>
          </div>
        </div>
  
        <!-- Features -->
        <div class="features-container">
          <div 
            v-for="(item, index) in featureItems" 
            :key="index"
            class="feature-card"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <div class="feature-content">
              <div class="feature-icon-wrapper">
                <el-icon class="feature-icon">
                  <component :is="item.icon"></component>
                </el-icon>
                <div class="icon-glow"></div>
              </div>
              <span class="feature-text">{{ item.text }}</span>
            </div>
          </div>
        </div>
  
        <!-- Action Button -->
        <button class="action-button" @click="$router.push('/')">
          Вернуться на главную
          <div class="button-sparkle"></div>
        </button>
      </div>
    </div>
  </template>
  
<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { 
  ArrowLeftBold, 
  CircleCheckFilled,
  StarFilled
} from '@element-plus/icons-vue'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const userId = ref(store.getters.getSub)

// Определяем элементы функционала
const featureItems = ref([
  {
    icon: StarFilled,
    text: 'Ваша поддержка помогает нам становиться лучше'
  },
  {
    icon: StarFilled,
    text: 'Вместе мы создаём нечто особенное'
  },
  {
    icon: StarFilled,
    text: 'Впереди вас ждёт много интересного'
  },
  {
    icon: StarFilled,
    text: 'Мы всегда рады общению с вами'
  }
])

// Добавляем флаг для отслеживания, что страница была посещена
onMounted(async () => {
  await sendPaymentData()
  // Устанавливаем флаг в sessionStorage
  sessionStorage.setItem('thanksPageVisited', 'true')
})

// Перехватываем попытку возврата на страницу
const handleBackNavigation = () => {
  // Если пользователь пытается вернуться назад, перенаправляем на главную
  if (window.history.state?.current === '/thanks-for-payment') {
    router.push('/')
  }
}

// Слушаем событие popstate
onMounted(() => {
  window.addEventListener('popstate', handleBackNavigation)
})

const sendPaymentData = async () => {
  try {
    const ipResponse = await axios.get('https://api.ipify.org?format=json')
    const ipAddress = ipResponse.data.ip

    const paymentData = {
      ipAddress,
      userId: userId.value
    }

    await axios.post(
      'https://ton-back-e015fa79eb60.herokuapp.com/api/Payments/completed',
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        }
      }
    )
  } catch (error) {
    console.error('Error recording payment:', error.message)
  }
}
</script>
  
  <style scoped>
  .thankyou-wrapper {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(135deg,rgb(63, 38, 100),rgb(10, 2, 18));
    border-radius: 24px;
  }
  
  .thankyou-container {
    width: 100%;
    max-width: 800px;
    padding: 2rem;
    border-radius: 24px;
    position: relative;
    animation: fadeIn 0.6s ease-out;
  }
  
  :deep(.dark) .thankyou-container {
    background: linear-gradient(135deg, #2a1945, #3d2665);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  :deep(:not(.dark)) .thankyou-container {
    background: linear-gradient(135deg, #f0e6ff, #e6d0ff);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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
    z-index: 1;
  }
  
  .message-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-top:-100px;
  }
  
  .success-animation {
    position: relative;
    animation: bounce 1s ease;
  }
  
  .success-circle {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
    border-radius: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
  }
  
  .success-icon {
    font-size: 60px;
    color: white;
    animation: fadeIn 0.5s ease 0.5s backwards;
  }
  
  .title {
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    margin: 0;
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: slideIn 0.8s ease;
  }
  
  .subtitle {
    font-size: 20px;
    color: #f2e1ff;
    margin: 0;
    opacity: 0.9;
    animation: slideIn 0.8s ease 0.2s backwards;
  }
  
  .message-container {
    margin: 2rem 0;
  }
  
  .message-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    position: relative;
    animation: fadeIn 0.8s ease;
  }
  
  .sparkle-icon {
    font-size: 24px;
    margin-bottom: 0.5rem;
    animation: sparkle 2s infinite;
  }
  
  .message-text {
    font-size: 18px;
    color: #f2e1ff;
    margin: 0;
  }
  
  .features-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .feature-card {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    transition: all 0.3s ease;
    animation: slideUp 0.8s ease backwards;
  }
  
  .feature-card:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 107, 107, 0.5);
  }
  
  .feature-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.2rem;
  }
  
  .feature-icon-wrapper {
    position: relative;
  }
  
  .feature-icon {
    font-size: 24px;
    padding: 12px;
    background: rgba(255, 107, 107, 0.2);
    border-radius: 12px;
    position: relative;
    z-index: 1;
    color: #ff6b6b;
  }
  
  .icon-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(255,107,107,0.3) 0%, transparent 70%);
    animation: pulse 2s infinite;
  }
  
  .feature-text {
    font-size: 16px;
    color: #f2e1ff;
    font-weight: 500;
  }
  
  .action-button {
    display: block;
    width: 100%;
    max-width: 300px;
    margin: 2rem auto;
    padding: 1rem 2rem;
    border: none;
    border-radius: 16px;
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
    color: white;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .action-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  }
  
  .button-sparkle {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
    animation: rotate 10s linear infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-30px); }
    60% { transform: translateY(-15px); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 0.5; }
  }
  
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes sparkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .thankyou-wrapper {
      padding: 0rem;
      padding-top: 2rem;
      margin-top: -30px;
    }
    
    .thankyou-container {
      padding: 1.5rem;
    }
  
    .success-circle {
      width: 100px;
      height: 100px;
    }
  
    .success-icon {
      font-size: 50px;
    }
  
    .title {
      font-size: 24px;
    }
  
    .subtitle {
      font-size: 18px;
    }
  
    .message-text {
      font-size: 16px;
    }
  
    .feature-text {
      font-size: 14px;
    }
  
    .action-button {
      font-size: 16px;
      padding: 0.875rem 1.5rem;
    }
  }

  
  </style>