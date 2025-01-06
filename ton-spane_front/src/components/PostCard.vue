<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue'
import ShareModal from './ShareModal.vue' 
import TipsModal from './TipsModal.vue'
import SubscriptionModal from '../components/Page/SubOnCardModal/SubCardModal.vue'
import { useStore } from 'vuex'
import { Lock, Share, Money, Comment } from '@element-plus/icons-vue'

const S3_BASE_URL = 'https://tonimages.s3.us-east-1.amazonaws.com/'

const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  const cleanUrl = imageUrl.replace(new RegExp(S3_BASE_URL, 'g'), '')
  return cleanUrl.startsWith('http') ? cleanUrl : `${S3_BASE_URL}${cleanUrl}`
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

const emit = defineEmits(['like', 'share', 'donate', 'subscribe', 'comment'])
const store = useStore()

// Refs
const subscriptionModalRef = ref(null)
const localComments = ref([])
const isLiked = ref(props.isLikedByCurrentUser)
const likesCount = ref(props.likes.length)
const isSubscribed = ref(props.isSubscribed)
const isShared = ref(false)
const isDonated = ref(false)
const isShareModalVisible = ref(false)
const isTipsModalVisible = ref(false)
const showAllComments = ref(false)
const newComment = ref('')
const isSubmitting = ref(false)

// Watchers для синхронизации состояния
watch(() => props.comments, (newComments) => {
  localComments.value = [...newComments]
}, { immediate: true, deep: true })

watch(() => props.isLikedByCurrentUser, (newValue) => {
  isLiked.value = newValue
}, { immediate: true })

watch(() => props.likes.length, (newValue) => {
  likesCount.value = newValue
}, { immediate: true })

watch(() => props.isSubscribed, (newValue) => {
  isSubscribed.value = newValue
}, { immediate: true })

// Computed
const userId = computed(() => store.getters.getSub)
const formattedImageUrl = computed(() => formatImageUrl(props.imageUrl))
const displayedComments = computed(() => {
  const sortedComments = [...localComments.value].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  )
  return showAllComments.value ? sortedComments : sortedComments.slice(0, 2)
})

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

const formatCommentTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  
  if (isNaN(date.getTime()) || date > now) {
    return 'сейчас'
  }

  const diffInMilliseconds = now - date
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
  
  if (diffInMinutes <= 0) {
    return 'сейчас'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}м`
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}ч`
  } else {
    return `${Math.floor(diffInMinutes / 1440)}д`
  }
}

const isUserLoggedIn = () => {
  const userType = sessionStorage.getItem("userType")
  return userType === "user"
}

const handleImageClick = () => {
  if (props.isBlurred && subscriptionModalRef.value) {
    subscriptionModalRef.value.openDialog()
  }
}

const handleLike = async () => {
  if (!isUserLoggedIn()) return

  try {
    const endpoint = isLiked.value ? 'unlike' : 'like'
    const method = isLiked.value ? 'DELETE' : 'POST'
    
    isLiked.value = !isLiked.value
    likesCount.value = isLiked.value ? likesCount.value + 1 : likesCount.value - 1

    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/likes/${userId.value}/${endpoint}/${props.id}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update like')
    }

    emit('like', isLiked.value)
  } catch (error) {
    console.error('Error updating like:', error)
    isLiked.value = !isLiked.value
    likesCount.value = isLiked.value ? likesCount.value + 1 : likesCount.value - 1
  }
}

const checkSubscriptionStatus = async () => {
  if (!isUserLoggedIn()) return false

  try {
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/${userId.value}/following`,
      {
        method: 'GET',
        headers: {
          'accept': '*/*'
        }
      }
    )

    if (response.ok) {
      const followingList = await response.json()
      return followingList.some(user => user.id === props.user.id)
    }
    return false
  } catch (error) {
    console.error('Error checking subscription status:', error)
    return false
  }
}

const handleSubscribe = async () => {
  if (!isUserLoggedIn()) return

  try {
    isSubscribed.value = !isSubscribed.value
    emit('subscribe', isSubscribed.value)

    const currentStatus = await checkSubscriptionStatus()
    const endpoint = currentStatus ? 'unfollow' : 'follow'
    const method = currentStatus ? 'DELETE' : 'POST'
    
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/${userId.value}/${endpoint}/${props.user.id}`,
      {
        method,
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: method === 'POST' ? '' : undefined
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update subscription')
    }
  } catch (error) {
    console.error('Error while subscribing/unsubscribing:', error)
    isSubscribed.value = !isSubscribed.value
    emit('subscribe', isSubscribed.value)
  }
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

const postComment = async () => {
  if (!isUserLoggedIn() || !newComment.value.trim()) return
  
  const commentContent = newComment.value.trim()
  isSubmitting.value = true
  
  try {
    const response = await fetch('https://ton-back-e015fa79eb60.herokuapp.com/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify({
        content: commentContent,
        postId: props.id,
        userId: userId.value
      })
    })

    if (!response.ok) {
      throw new Error('Failed to post comment')
    }

    const responseData = await response.json()
    
    if (!responseData || !responseData.id) {
      throw new Error('Invalid response data')
    }

    // Добавляем новый комментарий в начало массива
    localComments.value = [{
      id: responseData.id,
      content: responseData.content,
      createdAt: responseData.createdAt,
      user: responseData.user
    }, ...localComments.value]

    emit('comment', responseData)
    newComment.value = ''
  } catch (error) {
    console.error('Error posting comment:', error)
  } finally {
    isSubmitting.value = false
  }
}

const toggleComments = () => {
  showAllComments.value = !showAllComments.value
}
</script>

<template>
  <ShareModal v-model:dialogVisible="isShareModalVisible" />
  <TipsModal v-model:dialogDonateVisible="isTipsModalVisible" />
  <SubscriptionModal 
    ref="subscriptionModalRef"
    :userId="props.user.id"  
  />
  
  <el-card class="post-card">
    <!-- Header Section -->
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

    <!-- Image Section -->
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
        
        <!-- Lock Overlay for Blurred Images -->
        <div v-if="isBlurred" class="lock-overlay">
          <el-icon :size="50" class="lock-icon">
            <Lock />
          </el-icon>
          <span class="lock-text">{{ price }}$</span>
        </div>
      </div>
    </div>

    <!-- Post Content Section -->
    <div class="post-content">
      <!-- Action Buttons -->
      <div class="actions">
        <div class="action-buttons">
          <!-- Like Button -->
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
            <span style="margin-left: 5px">{{ likesCount }}</span>
          </el-check-tag>
          
          <!-- Share Button -->
          <el-check-tag 
            :checked="isShared"
            @change="handleShare"
            class="action-tag share"
          >
          <el-icon size="25px"><Share /></el-icon>
          </el-check-tag>

          <!-- Donate Button -->
          <el-check-tag 
            :checked="isDonated"
            @change="handleDonate"
            class="action-tag donate"
          >
            <el-icon size="25px"><Money /></el-icon>
          </el-check-tag>

          <!-- Comment Button -->
          <el-check-tag 
            class="action-tag comment"
            @click="toggleComments"
          >
            <el-icon size="25px"><Comment /></el-icon>
            <span v-if="localComments.length" class="comment-count">
              {{ localComments.length }}
            </span>
          </el-check-tag>
        </div>

        <!-- Caption -->
        <el-text class="description" tag="b" emphasis>
          {{ caption.length > 100 ? caption.slice(0, 100) + '...' : caption }}
        </el-text>
      </div>

      <!-- Comments Section -->
      <div class="comments-section">
        <!-- Add Comment Form -->
        <div v-if="isUserLoggedIn()">
          <el-form @submit.prevent="postComment">
            <el-form-item>
              <el-input
                v-model="newComment"
                type="textarea"
                :rows="2"
                :maxlength="500"
                show-word-limit
                placeholder="Написать комментарий..."
                resize="none"
              />
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary"
                :loading="isSubmitting"
                :disabled="!newComment.trim()"
                @click="postComment"
              >
                Отправить
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <div v-if="localComments.length > 0">
          <el-divider />
          
          <!-- Comments List -->
          <transition-group 
            name="comment-fade" 
            tag="div" 
            class="comments-container"
          >
            <div 
              v-for="comment in displayedComments" 
              :key="comment.id"
              class="comment-item"
            >
              <div class="comment-header">
                <div 
                  class="custom-avatar"
                  :style="{
                    backgroundImage: `url(${comment.user?.profilePicture})`,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }"
                />
                <div class="comment-info">
                  <div class="comment-author">
                    {{ comment.user?.username }} 
                    <span class="comment-meta">
                      {{ formatCommentTime(comment.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="comment-content">
                <el-text class="comment-text">{{ comment.content }}</el-text>
              </div>
            </div>
          </transition-group>
          
          <!-- Show More Comments Button -->
          <div 
            v-if="localComments.length > 2" 
            class="comments-footer"
          >
            <el-button 
              link
              class="show-more-btn"
              @click="showAllComments = !showAllComments"
            >
              {{ showAllComments ? 'Скрыть комментарии' : `Показать все комментарии (${localComments.length})` }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>
<style scoped>
.post-card {
  width: auto;
  margin-bottom: 30px;
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

/* Post Content & Actions */
.post-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 15px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  
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

.comment-count {
  margin-left: 4px;
  font-size: 14px;
  font-weight: 500;
}

.description {
  flex: 1;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 16px;
  
  @media (max-width: 480px) {
    width: 100%;
    font-size: 12px;
    padding: 5px;
  }
}

/* Comments Section */
.comments-section {
  margin-top: -15px;
  padding-top: 8px;
}

.comments-divider {
  height: 1px;
  background: linear-gradient(90deg, 
    rgba(0, 180, 219, 0.1) 0%,
    rgba(0, 180, 219, 0.2) 50%,
    rgba(0, 180, 219, 0.1) 100%
  );
  margin: 8px 0;
}

.comments-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comment-avatar {
  border: 2px solid rgba(0, 180, 219, 0.2);
  padding: 2px;
  transition: all 0.3s ease;
}

.comment-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: -15px;
}

.comment-author {
  font-weight: 600;
  font-size: 14px;
  color: var(--el-color-primary);
}

.comment-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-left: 10px;
}

.comment-content {
  padding-left: 52px;
  margin-top: -20px;
}

.comment-text {
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  color: var(--el-text-color-primary);
  word-break: break-word;
}

.comments-footer {
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
}

.show-more-btn {
  font-size: 14px;
  color: var(--el-color-primary);
  
  &:hover {
    text-decoration: underline;
  }
}

/* Анимации */
.comment-fade-enter-active,
.comment-fade-leave-active {
  transition: all 0.3s ease;
}

.comment-fade-enter-from,
.comment-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Dark theme */
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

html.dark .comment-item {
  background: rgba(22, 27, 34, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark .comment-text {
  color: #e6edf3;
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

/* Light theme */
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

html:not(.dark) .comment-item {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
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

html:not(.dark) .action-tag.comment {
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(112, 174, 255, 0.2);
  color: #5783a4;
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .subBtn {
    width: 40% !important;
    height: 30px !important; 
    font-size: 12px !important;
    padding: 0 10px !important;
  }

  .comment-text {
    margin-left: 10px;
}
  
  .lock-icon {
    font-size: 30px;
    padding: 10px;
  }

  .lock-text {
    font-size: 18px;
    padding: 3px 10px;
  }
  
  .comment-item {
    padding: 8px;
  }
  
  .comment-content {
    padding-left: 44px;
  }
  
  .comment-author {
    font-size: 13px;
  }
  
  .comment-text {
    font-size: 13px;
  }
  
  .show-more-btn {
    font-size: 13px;
  }
}
</style>