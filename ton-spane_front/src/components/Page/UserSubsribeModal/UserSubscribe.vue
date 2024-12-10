<template>
    <div class="sp-container">
      <el-container>
        <!-- Header Section -->
        <el-header class="sp-header">
          <el-button class="sp-back-btn" @click="handleGoBack" plain>
            <el-icon><ArrowLeftBold /></el-icon>
          </el-button>
          <el-image :src="USER_IMG" class="sp-user-avatar" />
        </el-header>
        
        <!-- Main Content Section -->
        <el-main class="sp-content">
          <h1 class="sp-title">Спонсорская подписка на {{ USER_NICKNAME }}</h1>
          
          <!-- Subscription Cards -->
          <el-card v-for="(item, index) in subscriptionItems" 
                  :key="index"
                  class="sp-subscription-item"
                  :shadow="item.shadow">
            <img :src="item.icon" class="sp-item-icon" />
            <span class="sp-item-text">
              {{ item.text }}
            </span>
          </el-card>
        </el-main>
        
        <el-footer class="sp-footer"> 
            <el-button type="success" class="bottom-fixed"  @click="showPaymentModal"            >Купить подписку</el-button>

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

// Ref для модального окна
const paymentModalRef = ref(null)

const showPaymentModal = () => {
  paymentModalRef.value.openDialog()
}

const fetchUserData = async () => {
  try {
    const response = await axios.get(`https://ton-back-e015fa79eb60.herokuapp.com/api/users/${route.params.id}`)
    
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
  
  <style>

.bottom-fixed {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 25px 145px;
  font-size: 30px;
  color: white;
  background: linear-gradient(-45deg, #b2583c, #e73c7e, #23a6d5, #126753);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite, float 6s ease-in-out infinite;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

}

.bottom-fixed:hover {
  transform: translateX(-50%) translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
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
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
  100% {
    transform: translateX(-50%) translateY(0px);
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
  background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00,  #002bff, #7a00ff, #ff00c8, #ff0000);
  background-size: 400%;
  border-radius: 15px;
  z-index: -1;
  animation: glowing 20s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
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
    position: fixed;
    top: 20px;
    left: 60% !important;
    transform: translateX(-50%);
    height: auto !important;
    padding: 15px !important;
    border-radius: 15px;
    margin: 0 !important;
    width:auto;
    max-width: 300px;
    height: 40px !important;
  }
  

}
  /* Container Styles */
  .sp-container {
    width: 95%;
    border: #8eb2ff;
    border-radius: 5%;
    border: solid;
    padding-left: 0px;
    padding: 20px;
    margin-left: 20px;
    border-color: rgba(0, 136, 255, 0.493);
    @media (max-width: 480px) {
      border-radius: 20px;
      padding: 0px !important;
      margin-left: 8px !important;
    }
  }
  
  /* Header Styles */
  .sp-header {
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0px;
    width: 100%;
    @media (max-width: 480px) {
      width: 100%;

    }

  }
  
  /* Main Content Styles */
  .sp-content {
    padding: 0;
    display: flex;
    width: 100%;
    padding-top: 20px;
    flex-direction: column;
    gap: 10px;
    justify-self: center;
    align-items: center;
  }
  
  /* Subscription Card Styles */
  .sp-subscription-item {
      color: rgb(205, 230, 255);
      font-size: 20px;
      border-color: rgb(75, 165, 255);
      display: flex;
      align-items: center;
      width: 90%;
      padding: 20px;
      background: linear-gradient(145deg, rgba(13, 23, 33, 0.692), rgba(32, 45, 58, 0.544));
      border-radius: 10px;
      transition: all 0.3s ease;
      cursor: pointer;
      height: 30px;
      @media (max-width: 480px) {
        width: 80%;
        font-size: 0.55rem;
        padding: 15px;
        padding-top: 12px;
        padding-bottom: 12px;
        font-size: 17px;


    }
  }
  
  .sp-subscription-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(75, 165, 255, 0.2);
      border-color: rgb(100, 180, 255);
  }
  
  /* Card Content Styles */
  .sp-item-text {
      color: rgb(205, 230, 255);
      font-weight: 500;
      letter-spacing: 0.5px;
      margin-left: 15px;
      position: absolute;
      margin-top: 8px;
      @media (max-width: 480px) {
        margin-left: 5px;

      }
  }
  
  .sp-item-icon {
      width: 25px;
      height: 25px;
      margin-right: 10px;
      background-color: rgba(110, 115, 122, 0);
      padding: 5px;
      border-radius: 10%;
      transition: all 0.3s ease;
  }
  
  .sp-subscription-item:hover .sp-item-icon {
      transform: scale(1.1);
  }
  
  /* Back Button Styles */
  .sp-back-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--el-color-primary);
    border: 2px solid var(--el-color-primary);
    background: rgba(64, 158, 255, 0.02);
    padding: 0px 0px;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.3px;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(8px);
    margin-left: 0px;
    width: 50px;
    @media (max-width: 480px) {
        width: 50px !important;
        height: 40px !important;
        margin-top: 10px !important;
        margin-left: 10px !important;


    }

  }
  
  .sp-back-btn:hover {
    background: rgba(64, 158, 255, 0.08);
    box-shadow: 0 0 20px rgba(64, 158, 255, 0.3), 
                0 0 0 1px rgba(64, 158, 255, 0.2);
    transform: translateY(-1px);
  }
  
  .sp-back-btn:active {
    transform: translateY(1px);
    box-shadow: 0 0 10px rgba(64, 158, 255, 0.2);
  }
  
  .sp-back-btn .el-icon {
    font-size: 16px;
    transition: transform 0.3s ease;
  }
  
  .sp-back-btn:hover .el-icon {
    transform: translateX(-3px);
  }
  
  .sp-back-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(64, 158, 255, 0.1),
      transparent
    );
    transition: 0.5s;
  }
  
  .sp-back-btn:hover::before {
    left: 100%;
  }
  
  /* User Avatar Styles */
  .sp-user-avatar {
      height: 150px;
      width: 150px;
      border-radius: 10px;
      align-self: center;
      @media (max-width: 480px) {
        width: 100px;
        height: 100px;

      }
  }
  
  /* Title Styles */
  .sp-title {
    width: 92% !important;
    
      font-weight: 800;
      font-size: 22px;
      color: rgb(0, 0, 0);
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 0 0 10px rgba(255,255,255,0.6),
                   0 0 20px rgba(142,178,255,0.4),
                   0 0 30px rgba(178,105,255,0.2);
      padding: 12px 10px;
      margin: 0;
      margin-top: 10px;
      display: flex;
      border-radius: 8px;
      box-shadow: 0 2px 15px rgba(142,178,255,0.3),
                  0 0 30px rgba(178,105,255,0.2);
      background: linear-gradient(135deg, #8eb2ff, #b269ff);
      overflow: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      align-self: center;
      width: 501px;
      transition: all 0.3s ease;
      display: flex !important;
    text-align: center !important;
    justify-content: center !important;
      @media (max-width: 480px) {
      width: 85% !important;
      font-size: 0.55rem;
      padding: 7px;
      font-size: 17px;

    }
  }
  
  .sp-title:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(142,178,255,0.4),
                  0 0 40px rgba(178,105,255,0.3);
      text-shadow: 0 0 15px rgba(255,255,255,0.8),
                   0 0 25px rgba(142,178,255,0.6),
                   0 0 35px rgba(178,105,255,0.4);
  }
  
  /* Animation */
  @keyframes glow {
      0% { box-shadow: 0 2px 15px rgba(142,178,255,0.3), 0 0 30px rgba(178,105,255,0.2); }
      50% { box-shadow: 0 2px 20px rgba(142,178,255,0.4), 0 0 40px rgba(178,105,255,0.3); }
      100% { box-shadow: 0 2px 15px rgba(142,178,255,0.3), 0 0 30px rgba(178,105,255,0.2); }
  }
  
  .sp-title {
      animation: glow 2s infinite ease-in-out;
  }
  
  .sp-title::-webkit-scrollbar {
      display: none;
  }
  </style>