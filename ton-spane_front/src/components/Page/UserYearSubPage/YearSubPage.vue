<template>
  <div class="ys-container">
    <el-container>
      <!-- Header Section -->
      <el-header class="ys-header">
        <el-button class="ys-back-btn" @click="handleGoBack" plain>
          <el-icon><ArrowLeftBold /></el-icon>
        </el-button>
        <el-image :src="USER_IMG" class="ys-user-avatar" />
      </el-header>
      
      <!-- Main Content Section -->
      <el-main class="ys-content">
        <h1 class="ys-title">Годовая подписка на {{ USER_NICKNAME }}</h1>
        
        <!-- Subscription Cards -->
        <el-card v-for="(item, index) in yearlySubscriptionItems" 
                :key="index"
                class="ys-subscription-item"
                :shadow="item.shadow">
          <img :src="item.icon" class="ys-item-icon" />
          <span class="ys-item-text">
            {{ item.text }}
          </span>
        </el-card>
      </el-main>
      
      <el-footer class="ys-footer"> 
        <el-button type="success" class="bottom-fixed" @click="showPaymentModal"  >Оформить годовую подписку</el-button>
      </el-footer>
    </el-container>
  </div>
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

const paymentModalRef = ref(null)

const showPaymentModal = () => {
  paymentModalRef.value.openDialog()
}

const fetchUserData = async () => {
  try {
    const response = await axios.get(`https://ton-back-e015fa79eb60.herokuapp.com/api/users/${route.params.id}`)
    
    USER_IMG.value = response.data.profilePicture
    USER_NICKNAME.value = response.data.username
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error)
  }
}

const handleGoBack = () => router.go(-1)

onMounted(() => {
  fetchUserData()
})

// Данные годовой подписки
const yearlySubscriptionItems = [
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

  <style>
.bottom-fixed {
  position: absolute;
  bottom: 10px;
  padding: 25px 145px;
  font-size: 30px;
  color: white;
  background: linear-gradient(-45deg, #1a1a1a, #2d1f3d, #1f2d3d, #263238);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite, float 6s ease-in-out infinite;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.bottom-fixed:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
  background-size: 200% 200%;
}

@keyframes gradient {
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

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Glowing effect */
.bottom-fixed::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #752c65, #3d5670, #221515, #473061, #742c64);
  background-size: 400%;
  border-radius: 15px;
  z-index: -1;
  animation: glowing 20s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.bottom-fixed:hover::before {
  opacity: 1;
}

@keyframes glowing {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}

@media (max-width: 480px) {
  .bottom-fixed {
    position: absolute;
    top: 16px;
    width: 220px;
    min-height: 40px !important;
    max-height: fit-content !important;
    height: fit-content !important;
    padding: 8px 15px !important;
    font-size: 15px !important;
    border-radius: 15px;
    margin-top: 0 !important;
    left: 130px !important;
    white-space: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.2;
    flex: 0 0 auto;
    box-sizing: border-box;
    height: 30px !important;
  }
  
  .bottom-fixed:hover {
    transform: translateY(-3px);
  }
}

/* Element Plus button text fix */
.bottom-fixed :deep(.el-button__text) {
  white-space: normal;
  height: auto !important;
}

.ys-container {
  width: 95%;
  border: solid 2px rgba(147, 51, 234, 0.3);
  border-radius: 20px;
  padding: 20px;
  margin-left: 20px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.1);
  @media (max-width: 480px) {
    border-radius: 20px;
    padding: 0 !important;
    margin-left: 8px !important;
  }
}

.ys-header {
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0;
  width: 100%;
  @media (max-width: 480px) {
    width: 100%;
    font-size: 20px !important;

  }
}

.ys-content {
  padding: 20px 0;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 15px;
  justify-self: center;
  align-items: center;
}

.ys-subscription-item {
  color: rgb(250, 245, 255);
  font-size: 20px;
  border: 1px solid rgba(147, 51, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  padding: 0px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
  height: auto;
  min-height: 30px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: relative;
  text-align: center;
}

.ys-container {
  width: 95%;
  border: solid 2px rgba(147, 51, 234, 0.3);
  border-radius: 20px;
  padding: 20px;
  margin-left: 20px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.1);
}

.ys-item-text {
  color: rgb(250, 245, 255);
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
  margin: 0;
  padding: 0;
  width: 100%;
  position: static;
}

.ys-item-icon {
  margin-right: 10px;
  width: 25px;
  height: 25px;
  flex-shrink: 0;
}

.ys-subscription-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(147, 51, 234, 0.2);
  border-color: rgba(147, 51, 234, 0.5);
  background: rgba(0, 0, 0, 0.25);
}

@media (max-width: 480px) {
  .ys-container {
    padding: 0 !important;
    margin-left: 8px !important;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .ys-subscription-item {
    width: 80%;
    font-size: 0.9rem;
    padding: 0px 15px;
    background-color: rgba(0, 0, 0, 0.2) !important;
    min-height: 25px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  
  .ys-item-text {
    color: rgb(250, 245, 255) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    margin: 0;
    
    margin-top: -50px !important;
  }
  
  .ys-item-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    margin-bottom: -10px;
  }

  .ys-subscription-item:hover {
    background-color: rgba(0, 0, 0, 0.25) !important;
  }
}

/* Добавляем поддержку для Safari и других браузеров */
@supports not (backdrop-filter: blur(8px)) {
  .ys-subscription-item,
  .ys-container {
    background-color: rgba(0, 0, 0, 0.7);
  }
}

.ys-item-icon {
  width: 25px;
  height: 25px;
  margin-right: 10px;
  background-color: transparent;
  padding: 5px;
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.ys-subscription-item:hover .ys-item-icon {
  transform: scale(1.15) rotate(5deg);
}

.ys-back-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgb(147, 51, 234);
  border: 2px solid rgba(147, 51, 234, 0.3);
  background: rgba(147, 51, 234, 0.02);
  padding: 0;
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
  margin-left: 0;
  width: 50px;
  @media (max-width: 480px) {
    width: 50px !important;
    height: 40px !important;
    margin-top: 10px !important;
    margin-left: 10px !important;

  }
}

.ys-back-btn:hover {
  background: rgba(147, 51, 234, 0.08);
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.2),
              0 0 0 1px rgba(147, 51, 234, 0.1);
  transform: translateY(-2px);
}

.ys-back-btn:active {
  transform: translateY(1px);
}

.ys-back-btn .el-icon {
  font-size: 16px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.ys-back-btn:hover .el-icon {
  transform: translateX(-4px);
}

.ys-back-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(147, 51, 234, 0.1),
    transparent
  );
  transition: 0.6s;
}

.ys-back-btn:hover::before {
  left: 100%;
}

.ys-user-avatar {
  height: 150px;
  width: 150px;
  border-radius: 20px;
  align-self: center;
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.15);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
    margin-top: 25px;
  }
}

.ys-user-avatar:hover {
  transform: scale(1.02);
}

.ys-title {
  font-weight: 800;
  font-size: 22px;
  color: rgb(255, 255, 255);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(147, 51, 234, 0.4),
               0 0 20px rgba(192, 132, 252, 0.3);
  padding: 12px 10px;
  margin: 10px 0 0;
  display: flex;
  border-radius: 16px;
  background: linear-gradient(135deg, rgb(147, 51, 234), rgb(192, 132, 252));
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  align-self: center;
  width: 92% !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  justify-content: center !important;
  text-align: center !important;
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.2);
  @media (max-width: 480px) {
    width: 85% !important;
    font-size: 0.9rem;
    padding: 7px;
  }
}

.ys-title:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(147, 51, 234, 0.3);
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.8),
               0 0 25px rgba(147, 51, 234, 0.6);
}

@keyframes glow {
  0% { 
    box-shadow: 0 8px 32px rgba(147, 51, 234, 0.2);
    text-shadow: 0 0 10px rgba(147, 51, 234, 0.4);
  }
  50% { 
    box-shadow: 0 12px 40px rgba(147, 51, 234, 0.3);
    text-shadow: 0 0 20px rgba(147, 51, 234, 0.6);
  }
  100% { 
    box-shadow: 0 8px 32px rgba(147, 51, 234, 0.2);
    text-shadow: 0 0 10px rgba(147, 51, 234, 0.4);
  }
}

.ys-title {
  animation: glow 3s infinite ease-in-out;
}

.ys-title::-webkit-scrollbar {
  display: none;
}
  </style>