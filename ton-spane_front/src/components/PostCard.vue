<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import ShareModal from './ShareModal.vue' 
import TipsModal from './TipsModal.vue'
import { useStore } from 'vuex'
import { Lock } from '@element-plus/icons-vue' // добавляем импорт иконки



const props = defineProps({
  id: { type: String, required: true },
  caption: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  isBlurred: { type: Boolean, default: false },
  price: { type: String, default: '0' },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  user: {
    type: Object,
    default: () => ({
      id: '',
      username: '',
      email: '',
      password: '',
      profilePicture: null,
      profileHeader: null,
      profileDescription: '',
      createdAt: '',
      updatedAt: ''
    })
  },
  comments: {
    type: Array,
    default: () => []
  },
  likes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['like', 'share', 'donate', 'subscribe'])


const isLiked = ref(props.initialLiked)
const likes = ref(props.likes.length); 

const isSubscribed = ref(props.initialSubscribed)
const isShared = ref(props.initialShared)
const isDonated = ref(props.initialDonated)

const isShareModalVisible = ref(false)
const isTipsModalVisible = ref(false)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин назад`
  } else if (diffInHours < 24) {
    return `${diffInHours} ч назад`
  } else if (diffInDays < 7) {
    return `${diffInDays} дн назад`
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
}

const store = useStore()
const userId = computed(() => store.getters.getSub)

const handleLike = async () => {
  try {
    // Определяем URL в зависимости от текущего состояния
    const endpoint = isLiked.value ? 'unlike' : 'like';
    const method = isLiked.value ? 'DELETE' : 'POST';
    
    const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/likes/${userId.value}/${endpoint}/${props.id}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to update like');
    }

    // Переключаем состояние и обновляем счетчик только после успешного ответа
    isLiked.value = !isLiked.value;
    likes.value = isLiked.value ? likes.value + 1 : likes.value - 1;
    
    emit('like', isLiked.value);

  } catch (error) {
    console.error('Error updating like:', error);
  }
};
const handleSubscribe = () => {
  isSubscribed.value = !isSubscribed.value
  emit('subscribe', isSubscribed.value)
}

const handleShare = () => {
  isShared.value = !isShared.value
  isShareModalVisible.value = true
  emit('share', isShared.value)
}

const handleDonate = () => {
  isDonated.value = !isDonated.value
  isTipsModalVisible.value = true
  emit('donate', isDonated.value)
}
</script>

<template>
  <ShareModal v-model:dialogVisible="isShareModalVisible" />
  <TipsModal v-model:dialogDonateVisible="isTipsModalVisible" />

  <el-card class="post-card">
    <div class="header">
      
      <el-avatar :size="50" class="avatar" :src="user.profilePicture" />
      <div class="user-info">
        <router-link 
                    :to="`/app/user/${user.id}`" 
                    class="username"                >
                {{ user.username }}
                </router-link>
        <el-text ></el-text>
        <el-text class="date">{{ formatDate(createdAt) }}</el-text>
      </div>
      <el-button 
        :type="isSubscribed ? 'success' : 'primary'" 
        @click="handleSubscribe"
        plain
        class="subBtn"
      >
        {{ isSubscribed ? 'Вы подписаны' : 'Подписаться' }}
      </el-button>
    </div>

    <div class="demo-image__preview">
  <div class="image-container">
    <el-image
      class="post-image"
      :class="{ 'blurred': isBlurred }"
      :src="imageUrl"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="isBlurred ? [] : [imageUrl]"
      :initial-index="4"
      fit="cover"
      @error="() => {}"
      :preview-teleported="true"
    >
      <template #error>
        <div class="image-slot">
        </div>
      </template>
    </el-image>
    
    <!-- Добавить этот блок -->
    <div v-if="isBlurred" class="lock-overlay">
      <el-icon :size="50" class="lock-icon">
        <Lock />
      </el-icon>
      <span class="lock-text">{{ price }}$</span>
    </div>
  </div>
</div>

    <div class="actions">
      <div class="action-buttons">
        <el-check-tag 
          :checked="isLiked"
          @change="handleLike"
          class="action-tag heart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            :fill="isLiked ? 'red' : 'none'"
            stroke="red"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span style="margin-left: 5px"> {{ likes }}</span>

        </el-check-tag>
        
        <el-check-tag 
          :checked="isShared"
          @change="handleShare"
          class="action-tag share"
        >
          <el-icon size="25px"><Share /></el-icon>
        </el-check-tag>

        <el-check-tag 
          :checked="isDonated"
          @change="handleDonate"
          class="action-tag donate"
        >
          <el-icon size="25px"><Money /></el-icon>
        </el-check-tag>
      </div>
      <el-text class="description" tag="b" emphasis>
        {{ caption.length > 100 ? caption.slice(0, 100) + '...' : caption }}
      </el-text>
    </div>
  </el-card>
</template>

<style scoped>
.post-card {
  width: auto;
  margin-bottom: 30px;
  background: #161b22;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  
  @media (max-width: 480px) {
    width: 95%;
    align-self: center;
  }
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  margin-right: auto;
}

.username {
  font-size: 20px;
  line-height: 1.2;
  color: #e6edf3;
  text-decoration: none;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  padding-bottom: 2px;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg, #00b4db 0%, #0083b0 100%);
    transition: width 0.3s ease;
    border-radius: 2px;
  }
  
  &:hover {
    color: #00b4db;
    transform: translateY(-1px);
    
    &::after {
      width: 100%;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    font-size: 14px !important;
  }
}

.date {
  font-size: 12px;
  margin-left: -10px;
  color: #8b949e;
  @media (max-width: 480px) {
    font-size: 12px !important;
  }
}

.subBtn {
  width: auto !important;
  font-size: 16px !important;
  border: none !important;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
}

/* Стиль для неподписанного состояния */
.subBtn.el-button--primary {
  background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%) !important;
  box-shadow: 0 4px 15px rgba(0, 180, 219, 0.3);
  color: white !important;
}

.subBtn.el-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 180, 219, 0.4);
  background: linear-gradient(135deg, #00d2ff 0%, #00b4db 100%) !important;
}

/* Стиль для подписанного состояния */
.subBtn.el-button--success {
  background: linear-gradient(135deg, #34d399 0%, #059669 100%) !important;
  box-shadow: 0 4px 15px rgba(52, 211, 153, 0.3);
  color: white !important;
}

.subBtn.el-button--success:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(52, 211, 153, 0.4);
  background: linear-gradient(135deg, #10b981 0%, #047857 100%) !important;
}

/* Стиль для активного состояния (при нажатии) */
.subBtn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

@media (max-width: 480px) {
  .subBtn {
    width: 40% !important;
    height: 30px !important; 
    font-size: 12px !important;
    padding: 0 10px !important;
  }
}

.avatar {
  border: 2px solid rgba(0, 180, 219, 0.3);
  box-shadow: 0 0 20px rgba(0, 180, 219, 0.2);
  
  @media (max-width: 480px) {
    width: 40px !important;
    height: 40px !important;
  }
}

.post-image {
  min-height: 400px;
  width: 80%;
  object-fit: cover;
  object-position: center center;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 480px) {
    max-height: 400px;
    min-height: 300px;
    width: 100%;
  }
}

.blurred {
  filter: blur(30px);
}

.price-overlay {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: #e6edf3;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  padding: 0 15px;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 0px;
  }
}

.action-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: fit-content;
}

.action-tag {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  
}

.action-tag.heart { 
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #ff4d4d;
  
  &:hover {
    background: rgba(244, 67, 54, 0.2);
    transform: translateY(-1px);
  }
}

.action-tag.share {
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid rgba(255, 152, 0, 0.3);
  color: #ffa726;
  
  &:hover {
    background: rgba(255, 152, 0, 0.2);
    transform: translateY(-1px);
  }
}

.action-tag.donate {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  color: #66bb6a;
  
  &:hover {
    background: rgba(76, 175, 80, 0.2);
    transform: translateY(-1px);
  }
}

.description {
  width: 500px;
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 10px 15px;
  border-radius: 8px;
  background: rgba(22, 27, 34, 0.8);
  border: 1px solid rgba(0, 180, 219, 0.2);
  box-shadow: 0 4px 15px rgba(0, 180, 219, 0.1);
  transition: all 0.3s ease;
  margin-left: auto;
  font-size: 16px;
  color: #e6edf3;

  &:hover {
    border-color: rgba(0, 180, 219, 0.4);
    box-shadow: 0 6px 20px rgba(0, 180, 219, 0.2);
  }

  @media (max-width: 480px) {
    width: 100%;
    margin-left: 0;
    font-size: 12px;
    text-align: left;
    justify-content: flex-start;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 10px);
    padding: 5px;
  }
}

.image-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

.lock-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 2;
}

.lock-icon {
  color: #e6edf3;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 50%;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: scale(1.05);
  }
}

.lock-text {
  color: #e6edf3;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 480px) {
  .lock-icon {
    font-size: 30px;
    padding: 10px;
  }

  .lock-text {
    font-size: 18px;
    padding: 3px 10px;
  }
}
</style>