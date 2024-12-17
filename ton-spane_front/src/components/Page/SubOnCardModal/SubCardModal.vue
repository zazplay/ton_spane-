<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="true"
    custom-class="modal"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :align-center="true"
    :append-to-body="true"
  >
    <div class="container">
      <!-- Аватар и заголовок -->
      <div class="header">
        <el-image 
          :src="userImg" 
          class="avatar"
          fit="cover"
        />
        <h2 class="title">Подписка на {{ userNickname }}</h2>
      </div>

      <!-- Список преимуществ -->
      <div class="benefits-list">
        <div 
          v-for="(item, index) in subscriptionItems" 
          :key="index"
          class="benefit-item"
        >
          <img :src="item.icon" class="benefit-icon" />
          <span class="benefit-text">{{ item.text }}</span>
        </div>
      </div>

      <!-- Кнопка подписки -->
      <div class="actions">
        <el-button 
          class="subscribe-btn"
          @click="showPaymentModal"
        >
          Оформить подписку
        </el-button>
      </div>
    </div>

    <!-- Модальное окно оплаты -->
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
    const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/models/${props.userId}`)
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
.modal {
 border-radius: 16px;
 overflow: hidden;
}

:deep(.el-dialog) {
 border-radius: 16px;
 background: #ffffff;
}

:deep(.el-dialog__headerbtn) {
 top: 16px;
 right: 16px;
}

:deep(.el-dialog__close) {
 font-size: 20px;
 color: #666;
}

:deep(.el-dialog__close:hover) {
 color: #4f46e5;
}

.container {
 padding: 24px;
 display: flex;
 flex-direction: column;
 gap: 24px;
}

.header {
 display: flex;
 flex-direction: column;
 align-items: center;
 gap: 16px;
}

.avatar {
 width: 80px;
 height: 80px;
 border-radius: 12px;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
 font-size: 18px;
 font-weight: 600;
 color: #ffffff;
 background: #4f46e5;
 padding: 8px 20px;
 border-radius: 10px;
 margin: 0;
 box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.benefits-list {
 display: flex;
 flex-direction: column;
 gap: 12px;
}

.benefit-item {
 display: flex;
 align-items: center;
 gap: 12px;
 background: linear-gradient(145deg, 
   rgba(19, 25, 35, 0.8),
   rgba(25, 32, 45, 0.7)
 );
 padding: 14px 16px;
 border-radius: 12px;
 border: 1px solid rgba(255, 255, 255, 0.1);
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.benefit-icon {
 width: 24px;
 height: 24px;
 flex-shrink: 0;
}

.benefit-text {
 color: #ffffff;
 font-size: 15px;
 font-weight: 500;
 line-height: 1.4;
}

.actions {
 margin-top: 8px;
 text-align: center;
}

.subscribe-btn {
 width: 100%;
 max-width: 280px;
 height: 48px;
 background: linear-gradient(135deg, #22c55e 0%, #059669 100%);
 color: #ffffff;
 font-size: 16px;
 font-weight: 600;
 border: none;
 border-radius: 12px;
 box-shadow: 
   0 4px 12px rgba(34, 197, 94, 0.2),
   inset 0 1px 0 rgba(255, 255, 255, 0.1);
 text-transform: uppercase;
 letter-spacing: 0.5px;
}

@media (max-width: 480px) {
 .container {
   padding: 20px;
   gap: 20px;
 }

 .avatar {
   width: 64px;
   height: 64px;
 }

 .title {
   font-size: 16px;
   padding: 6px 16px;
 }

 .benefit-item {
   padding: 12px 14px;
 }

 .benefit-icon {
   width: 20px;
   height: 20px;
 }

 .benefit-text {
   font-size: 14px;
 }

 .subscribe-btn {
   height: 44px;
   font-size: 15px;
 }
}
</style>