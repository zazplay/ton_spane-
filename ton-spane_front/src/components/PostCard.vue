<script setup>
import { ref, defineProps, defineEmits, computed, onMounted } from 'vue'
import ShareModal from './ShareModal.vue' 
import TipsModal from './TipsModal.vue'
import SubscriptionModal from '../components/Page/SubOnCardModal/SubCardModal.vue'
import { useStore } from 'vuex'
import { Lock, Share, Money } from '@element-plus/icons-vue'

const S3_BASE_URL = 'https://tonimages.s3.us-east-1.amazonaws.com/'

const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
    const cleanUrl = imageUrl.replace(new RegExp(S3_BASE_URL, 'g'), '');
  if (cleanUrl.startsWith('http')) {
    return cleanUrl;
  }
    return `${S3_BASE_URL}${cleanUrl}`;
}

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  user: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      username: '',
      profilePicture: '',
      profileHeader: '',
      profileDescription: ''
    })
  },
  caption: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isBlurred: {
    type: Boolean,
    default: false
  },
  price: {
    type: [String, Number],
    default: '0'
  },
  createdAt: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String,
    required: true
  },
  comments: {
    type: Array,
    default: () => []
  },
  likes: {
    type: Array,
    default: () => []
  },
  isLikedByCurrentUser: {
    type: Boolean,
    default: false
  },
  isSubscribed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['like', 'share', 'donate', 'subscribe'])

onMounted(() => {
  // console.log('Card props:', {
  //   id: props.id,
  //   isLikedByCurrentUser: props.isLikedByCurrentUser
  // })
})

const subscriptionModalRef = ref(null)
const isLiked = ref(props.isLikedByCurrentUser)
const likes = ref(props.likes.length)
const isSubscribed = ref(props.isSubscribed)
const isShared = ref(props.initialShared)
const isDonated = ref(props.initialDonated)
const isShareModalVisible = ref(false)
const isTipsModalVisible = ref(false)

const formattedImageUrl = computed(() => formatImageUrl(props.imageUrl))

const handleImageClick = () => {
  if (props.isBlurred && subscriptionModalRef.value) {
    subscriptionModalRef.value.openDialog()
  }
}

const store = useStore()
const userId = computed(() => store.getters.getSub)

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

const handleLike = async () => {
  if (sessionStorage.getItem("userType").toString() == "user"){
  try {
    const endpoint = isLiked.value ? 'unlike' : 'like'
    const method = isLiked.value ? 'DELETE' : 'POST'
    isLiked.value = !isLiked.value
    likes.value = isLiked.value ? likes.value + 1 : likes.value - 1
    const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/likes/${userId.value}/${endpoint}/${props.id}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    })
    if (!response.ok) {
      throw new Error('Failed to update like')
    }
    emit('like', isLiked.value)
  } catch (error) {
    console.error('Error updating like:', error)
  }
}
}

const checkSubscriptionStatus = async () => {
  if (sessionStorage.getItem("userType").toString() == "user"){

  try {
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/${userId.value}/following`,
      {
        method: 'GET',
        headers: {
          'accept': '*/*'
        }
      }
    );

    if (response.ok) {
      const followingList = await response.json();
      return followingList.some(user => user.id === props.user.id);
    }
    return false;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}
};

const handleSubscribe = async () => {
  if (sessionStorage.getItem("userType").toString() == "user"){

  try {
    // Сразу меняем визуальное состояние
    isSubscribed.value = !isSubscribed.value;
    
    // Отправляем событие для обновления UI
    emit('subscribe', isSubscribed.value);

    // Проверяем текущий статус подписки
    const currentStatus = await checkSubscriptionStatus();
    
    if (currentStatus) {
      // Отписка
      await fetch(
        `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/${userId.value}/unfollow/${props.user.id}`, 
        {
          method: 'DELETE',
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
          }
        }
      );
    } else {
      // Подписка
      await fetch(
        `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/${userId.value}/follow/${props.user.id}`, 
        {
          method: 'POST',
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
          },
          body: ''
        }
      );
    }
    
  } catch (error) {
    console.error('Error while subscribing/unsubscribing:', error);
    // В случае ошибки возвращаем предыдущее состояние
    isSubscribed.value = !isSubscribed.value;
    emit('subscribe', isSubscribed.value);
  }
}
};

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

// console.log('Original Image URL:', props.imageUrl)
// console.log('Formatted Image URL:', formattedImageUrl.value)
</script>

<template>
  <ShareModal v-model:dialogVisible="isShareModalVisible" />
  <TipsModal v-model:dialogDonateVisible="isTipsModalVisible" />
  <SubscriptionModal 
    ref="subscriptionModalRef"
    :userId="props.user.id"  
  />
  <el-card class="post-card">
    <div class="header">
      <el-avatar :size="50" class="avatar" :src="props.user.profilePicture" />
      <div class="user-info">
        <router-link 
          :to="`/app/user/${user.id}`" 
          class="username"
        >
          {{ user.username }}
        </router-link>
        <el-text></el-text>
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
      <div 
        class="image-container" 
        @click="handleImageClick"
      >
        <el-image
          class="post-image"
          :class="{ 'blurred': isBlurred }"
          :src="formattedImageUrl"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="isBlurred ? [] : [formattedImageUrl]"
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
          <span style="margin-left: 5px">{{ likes }}</span>
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
        <el-check-tag 
          :checked="isDonated"
          @change="handleDonate"
          class="action-tag comment"
        >
        <el-icon size="25px"><Comment /></el-icon>
      </el-check-tag>

      </div>
      <el-text class="description" tag="b" emphasis>
        {{ caption.length > 100 ? caption.slice(0, 100) + '...' : caption }}
      </el-text>
    </div>
  </el-card>
  <el-card class="preview-card" shadow="always">
    <div class="preview-content">
      <el-avatar 
        :size="36"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        class="preview-avatar"
      />
      <div class="preview-text">
        <div class="preview-author">John Doe</div>
        <div class="preview-message">This is a preview of the comment message...</div>
      </div>
    </div>
  </el-card>  
</template>

<style scoped>
.preview-card {
  width: 99.5%;
  height: fit-content;
  margin: 0 auto 30px;
  margin-top: 5px;
  border-radius: 15px;
  background: linear-gradient(135deg, #1a1f2c 0%, #121620 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.preview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(41, 98, 255, 0.25);
}

.preview-card :deep(.el-card__body) {
  padding: 10px 12px;
  height: 100%;
  background: linear-gradient(to right, rgba(26, 32, 44, 0.95), rgba(17, 24, 39, 0.95));
  border-radius: 15px;
  border: 1px solid rgba(66, 153, 225, 0.1);
}

.preview-content {
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  padding: 8px;
}

.preview-avatar {
  flex-shrink: 0;
  margin-right: 16px;
  border: 2px solid #2962ff;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(45deg, #2962ff, #1e88e5);
  box-shadow: 0 0 10px rgba(41, 98, 255, 0.3);
}

.preview-text {
  flex-grow: 1;
  overflow: hidden;
  padding: 4px 0;
}

.preview-author {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: linear-gradient(90deg, #63b3ed, #2962ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(41, 98, 255, 0.1);
}

.preview-message {
  font-size: 13px;
  color: #a0aec0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.preview-card:hover .preview-message {
  color: #63b3ed;
}
/* Базовые стили карточки */
.post-card {
  width: auto;
  margin-bottom: 0px;
  border-radius: 16px;
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

.subBtn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
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
  max-height: 800px;
  width: 80%;
  object-fit: contain;
  object-position: center center;
  border-radius: 12px;
  
  @media (max-width: 480px) {
    max-height: 400px;
    min-height: 300px;
    width: 100%;
  }
}

.blurred {
  filter: blur(30px);
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

.description {
  width: 500px;
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 180, 219, 0.1);
  transition: all 0.3s ease;
  margin-left: auto;
  font-size: 16px;

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
  padding: 20px;
  border-radius: 50%;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.lock-text {
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
}

/* Темная тема */
html.dark .post-card {
  background: #161b22;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

html.dark .header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark .username {
  color: #e6edf3;
}

html.dark .date {
  color: #8b949e;
}

html.dark .description {
  background: rgba(22, 27, 34, 0.8);
  color: #e6edf3;
  border: 1px solid rgba(0, 180, 219, 0.2);
}

html.dark .post-image {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

html.dark .action-tag.heart { 
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #ff4d4d;
}

html.dark .action-tag.share {
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid rgba(255, 152, 0, 0.3);
  color: #ffa726;
}

html.dark .action-tag.donate {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  color: #66bb6a;
}

html.dark .action-tag.comment {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(112, 174, 255, 0.481);
  color: #5783a4;
}

html.dark .lock-icon {
  color: #e6edf3;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

html.dark .lock-text {
  color: #e6edf3;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Светлая тема */
html:not(.dark) .post-card {
  background: #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

html:not(.dark) .header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

html:not(.dark) .username {
  color: #1f2937;
}

html:not(.dark) .date {
  color: #6b7280;
}

html:not(.dark) .description {
  background: rgba(255, 255, 255, 0.9);
  color: #1f2937;
  border: 1px solid rgba(0, 180, 219, 0.15);
}

html:not(.dark) .post-image {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

html:not(.dark) .action-tag.heart { 
  background: rgba(244, 67, 54, 0.05);
  border: 1px solid rgba(244, 67, 54, 0.2);
  color: #ff4d4d;
}

html:not(.dark) .action-tag.share {
  background: rgba(255, 152, 0, 0.05);
  border: 1px solid rgba(255, 152, 0, 0.2);
  color: #ffa726;
}

html:not(.dark) .action-tag.donate {
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.2);
  color: #66bb6a;
}

html:not(.dark) .lock-icon {
  color: #1f2937;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

html:not(.dark) .lock-text {
  color: #1f2937;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

@media (max-width: 480px) {
  .subBtn {
    width: 40% !important;
    height: 30px !important; 
    font-size: 12px !important;
    padding: 0 10px !important;
  }
  
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