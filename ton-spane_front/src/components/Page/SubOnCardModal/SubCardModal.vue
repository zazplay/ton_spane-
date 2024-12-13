<template>
    <el-dialog
      v-model="dialogVisible"
      :show-close="true"
      custom-class="sp-modal"
      width="450px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :align-center="true"
      :append-to-body="true"
    >
      <div class="sp-container">
        <el-container>
          <el-main class="sp-content">
            <div class="sp-header">
              <el-image :src="userImg" class="sp-user-avatar" />
            </div>
            
            <h1 class="sp-title">Спонсорская подписка на {{ userNickname }}</h1>
            
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
            <el-button type="success" class="bottom-fixed" @click="showPaymentModal">
              Купить подписку
            </el-button>
          </el-footer>
        </el-container>
      </div>
      <PaymentModal ref="paymentModalRef" />
    </el-dialog>
  </template>
  
  
<script setup>
import { ref, defineProps, defineExpose } from 'vue'
import PaymentModal from '../PaymentPage/PaymantPage.vue'
  
// Импорт иконок
import fireIcon from '@/assets/fire-svgrepo-com.svg?url'
import hotPepper from '@/assets/hot-pepper-chili-svgrepo-com.svg'
import message from '@/assets/message-svgrepo-com.svg'
import bonus from '@/assets/plus-add-svgrepo-com.svg'
  
const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})
  
// Refs
const dialogVisible = ref(false)
const userImg = ref("")
const userNickname = ref("")
const paymentModalRef = ref(null)
  
// Methods
const openDialog = async () => {
  await fetchUserData()
  dialogVisible.value = true
}
  
const showPaymentModal = () => {
  paymentModalRef.value.openDialog()
}
  
const fetchUserData = async () => {
  try {
    const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/users/${props.userId}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    userImg.value = data.profilePicture
    userNickname.value = data.username.split('@')[0]
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error)
  }
}
  
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
  
// Expose methods
defineExpose({
  openDialog
})
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  background: rgb(255, 255, 255);
  backdrop-filter: blur(20px);
}

.sp-modal {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(240, 245, 255, 0.97));
}

.sp-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 0px 5px;
}

.sp-content {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.sp-header {
  margin-bottom: 0px;
  position: relative;
}

.sp-user-avatar {
  height: 90px;
  border-radius: 10px;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.1),
    0 0 0 2px rgba(255, 255, 255, 0.7),
    0 0 0 4px rgba(142, 178, 255, 0.3);
  transition: all 0.3s ease;
}

.sp-user-avatar:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.12),
    0 0 0 2px rgba(255, 255, 255, 0.8),
    0 0 0 4px rgba(142, 178, 255, 0.4);
}

.sp-title {
  width: auto;
  font-size: 18px;
  padding: 8px 20px;
  margin: 0 0 5px 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  text-align: center;
  box-shadow: 
    0 4px 15px rgba(79, 70, 229, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.sp-title:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(79, 70, 229, 0.4),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.sp-subscription-item {
  width: 90%;
  height: auto;
  padding: 12px;
  margin-bottom: 6px;
  background: linear-gradient(145deg, 
    rgba(19, 25, 35, 0.8),
    rgba(25, 32, 45, 0.7)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.sp-item-text {
  position: relative;
  margin-left: 35px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  letter-spacing: 0.2px;
}

.sp-item-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  margin-right: 12px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.bottom-fixed {
  width: 70%;
  padding: 12px 25px;
  font-size: 16px;
  margin: 8px auto;
  border-radius: 14px;
  height: auto;
  background: linear-gradient(-45deg, #4338ca, #6d28d9, #7c3aed, #4f46e5);
  background-size: 300% 300%;
  animation: gradient 15s ease infinite;
  border: none;
  color: white;
  font-weight: 500;
  letter-spacing: 0.3px;
  box-shadow: 
    0 4px 15px rgba(79, 70, 229, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  display: block;
  position: relative;
  left: 34%;
  transform: translateX(-50%);
}


.sp-footer {
  padding: 0;
  margin-top: 5px;
}

.sp-subscription-item:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.sp-subscription-item:hover .sp-item-icon {
  transform: scale(1.1) rotate(5deg);
}

.bottom-fixed:hover {
  transform: translateX(-50%) translateY(-2px);
  background-size: 400% 400%;
  box-shadow: 
    0 8px 25px rgba(79, 70, 229, 0.4),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

@media (max-width: 480px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 10px auto !important;
  }

  .sp-container {
    padding: 3px;
  }

  .sp-user-avatar {
  height: 80px;
  width: auto;
  aspect-ratio: 1;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

  .sp-title {
    font-size: 15px;
    padding: 6px 12px;
  }

  .sp-subscription-item {
    padding: 10px;
  }

  .sp-item-text {
    font-size: 13px;
  }

  .bottom-fixed {
    padding: 10px 20px;
    font-size: 14px;
  }
}

@keyframes gradient {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}
</style>