<script setup>
import { computed, ref, onMounted, defineProps, defineEmits } from 'vue'
import { Lock, Share, Money, Delete, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['likeUpdated'])
const comments = ref([])
const selectedComments = ref([])
const isAdmin = ref(true)
const commentText = ref('')
const loading = ref(false)
const isLiked = ref(false)

const props = defineProps({
  id: { type: String, required: true },
  caption: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  isBlurred: { type: Boolean, default: false },
  price: { type: String, default: '' },
  createdAt: { type: String, required: true },
  initialLiked: { type: Boolean, default: false },
  likesCount: { type: Number, default: 0 },
  likes: { type: Array, default: () => [] },
  class: { type: String, default: '' },
  user: { 
    type: Object, 
    required: true,
    default: () => ({
      id: '',
      username: '',
      profilePicture: ''
    })
  }
})

const localLikesCount = computed({
  get: () => props.likesCount,
  set: (value) => {
    emit('likeUpdated', {
      postId: props.id,
      liked: isLiked.value,
      count: value
    })
  }
})

onMounted(() => {
  isLiked.value = props.initialLiked
  fetchComments()
})

const formattedImageUrl = computed(() => {
  if (!props.imageUrl) return ''
  const baseUrl = 'https://tonimages.s3.us-east-1.amazonaws.com/'
  return props.imageUrl.includes(baseUrl) ? props.imageUrl : `${baseUrl}${props.imageUrl}`
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 60) return `${diffInMinutes} мин назад`
  if (diffInHours < 24) return `${diffInHours} ч назад`
  if (diffInDays < 7) return `${diffInDays} дн назад`
  
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const API_BASE = 'https://ton-back-e015fa79eb60.herokuapp.com/api'

const handleLike = async () => {
  try {
    const response = await fetch(`${API_BASE}/likes/${props.id}/like`, {
      method: isLiked.value ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'accept': 'application/json'
      }
    })

    if (response.ok) {
      isLiked.value = !isLiked.value
      localLikesCount.value = localLikesCount.value + (isLiked.value ? 1 : -1)
      
      ElMessage.success(isLiked.value ? 'Лайк добавлен' : 'Лайк удален')
    }
  } catch (error) {
    console.error('Error:', error)
    ElMessage.error('Ошибка при обработке лайка')
  }
}

const handleAddComment = async () => {
  if (!commentText.value.trim()) return

  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/comments/post/${props.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        postId: props.id,
        content: commentText.value
      })
    })
    
    if (response.ok) {
      const newComment = await response.json()
      comments.value = [newComment, ...comments.value]
      commentText.value = ''
      ElMessage.success('Комментарий добавлен')
    }
  } catch (error) {
    console.error('Error:', error)
    ElMessage.error('Ошибка при добавлении комментария')
  } finally {
    loading.value = false
  }
}

const handleDeleteComment = async (commentId) => {
  try {
    comments.value = comments.value.filter(c => c.id !== commentId)
    selectedComments.value = selectedComments.value.filter(id => id !== commentId)

    const response = await fetch(`${API_BASE}/comments/admin/one`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ id: commentId })
    })

    if (response.status === 204) {
      ElMessage.success('Комментарий удален')
    } else if (response.status === 404) {
      await fetchComments()
      ElMessage.warning('Комментарий не найден')
    }
  } catch (error) {
    await fetchComments()
    console.error('Error:', error)
    ElMessage.error('Ошибка при удалении комментария')
  }
}

const fetchComments = async () => {
  try {
    const response = await fetch(`${API_BASE}/comments/post/${props.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      comments.value = await response.json()
    }
  } catch (error) {
    console.error('Error:', error)
    ElMessage.error('Ошибка при загрузке комментариев')
  }
}
</script>

<template>
  <div v-bind="$attrs">
    <el-card class="post-card dark" :body-style="{ padding: '20px' }">
      <!-- Header -->
      <div class="header">
        <el-avatar :size="60" :src="props.user.profilePicture" />
        <div class="user-info">
          <el-text class="username" type="primary" size="large">{{ props.user.username }}</el-text>
          <el-text class="date" type="info">{{ formatDate(props.createdAt) }}</el-text>
        </div>
      </div>

      <!-- Image -->
      <div class="image-container">
        <el-image 
          class="post-image"
          :class="{ 'blurred': props.isBlurred }" 
          :src="formattedImageUrl" 
          :zoom-rate="1.2"
          :preview-src-list="props.isBlurred ? [] : [formattedImageUrl]" 
          fit="cover" 
          :preview-teleported="true"
        >
          <template #error>
            <div class="image-slot"></div>
          </template>
        </el-image>

        <div v-if="props.isBlurred" class="lock-overlay">
          <el-icon :size="60"><Lock /></el-icon>
          <span class="lock-text">{{ props.price }}$</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <div class="action-buttons">
          <el-button 
            :type="isLiked ? 'danger' : 'default'"
            class="action-button like-button"
            @click="handleLike"
            :size="large"
            text
          >
            <template #icon>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="26" 
                height="26" 
                viewBox="0 0 24 24" 
                :fill="isLiked ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </template>
            <span class="count-text">{{ likesCount }}</span>
          </el-button>
          <el-button class="action-button share-button" type="success" text :size="large">
            <template #icon><el-icon><Share /></el-icon></template>
            Поделиться
          </el-button>
          <el-button class="action-button donate-button" type="primary" text :size="large">
            <template #icon><el-icon><Money /></el-icon></template>
            Донат
          </el-button>
        </div>
        <el-text class="caption" v-if="props.caption">{{ props.caption }}</el-text>
      </div>

      <!-- Comments -->
      <div class="comments-section">
        <el-divider>
          <div class="comments-header">
            <el-icon :size="24"><ChatDotRound /></el-icon>
            <span>Комментарии ({{ comments.length }})</span>
          </div>
        </el-divider>

        <el-input
          v-model="commentText"
          type="textarea"
          :rows="3"
          resize="none"
          placeholder="Напишите комментарий..."
          class="comment-input"
        >
          <template #append>
            <el-button 
              type="primary" 
              :loading="loading" 
              @click="handleAddComment"
              size="large"
            >
              Отправить
            </el-button>
          </template>
        </el-input>

        <el-scrollbar height="400px">
          <transition-group name="el-fade-in-linear">
            <div v-for="comment in comments" :key="comment.id" class="comment">
              <el-card shadow="hover" class="comment-card">
                <div class="comment-header">
                  <div class="comment-user">
                    <el-avatar :size="36" :src="comment.user.profilePicture" />
                    <div class="comment-info">
                      <el-text class="comment-username" type="primary" size="large">
                        {{ comment.user.username }}
                      </el-text>
                      <el-text class="comment-date" type="info">
                        {{ formatDate(comment.createdAt) }}
                      </el-text>
                    </div>
                  </div>
                  <div v-if="isAdmin" class="comment-actions">
                    <el-button 
                      type="danger" 
                      :size="large"
                      text 
                      @click="handleDeleteComment(comment.id)"
                    >
                      <el-icon :size="24"><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
                <el-text class="comment-content" size="large">{{ comment.content }}</el-text>
              </el-card>
            </div>
          </transition-group>
          
          <el-empty 
            v-if="!comments.length" 
            description="Нет комментариев" 
          />
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.post-card {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.header {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border-bottom: 2px solid var(--el-border-color);
  background-color: var(--el-bg-color);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.username {
  font-weight: 600;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.date {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.image-container {
  position: relative;
  width: 100%;
  border-bottom: 2px solid var(--el-border-color);
}

.post-image {
  width: 100%;
  max-height: 600px;
  object-fit: cover;
}

.blurred {
  filter: blur(30px);
}

.lock-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 8px;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.lock-text {
  font-size: 28px;
  font-weight: 600;
}

.actions {
  padding: 16px;
  background-color: var(--el-bg-color);
  border-bottom: 2px solid var(--el-border-color);
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.action-button {
  height: 40px !important;
  padding: 0 20px !important;
  border-radius: 6px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  border: 1px solid var(--el-border-color) !important;
}

.action-button :deep(.el-icon) {
  font-size: 20px;
  margin-right: 8px;
}

.like-button {
  background-color: var(--el-color-danger-light-9) !important;
  color: var(--el-color-danger) !important;
  border-color: var(--el-color-danger-light-5) !important;
}

.like-button.liked {
  background-color: var(--el-color-danger) !important;
  color: white !important;
}

.share-button {
  background-color: var(--el-color-success-light-9) !important;
  color: var(--el-color-success) !important;
  border-color: var(--el-color-success-light-5) !important;
}

.donate-button {
  background-color: var(--el-color-primary-light-9) !important;
  color: var(--el-color-primary) !important;
  border-color: var(--el-color-primary-light-5) !important;
}

.count-text {
  font-size: 15px;
  font-weight: 600;
  margin-left: 6px;
}

.caption {
  padding: 16px;
  margin: 0;
  line-height: 1.6;
  font-size: 15px;
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
  border-bottom: 2px solid var(--el-border-color);
}

.comments-section {
  padding: 20px;
  background-color: var(--el-bg-color-page);
  border-radius: 0 0 8px 8px;
}

.comments-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--el-border-color);
}

.comment-input {
  margin-bottom: 20px;
}

.comment-input :deep(.el-textarea__inner) {
  font-size: 14px;
  padding: 12px;
  border-radius: 6px;
  border: 2px solid var(--el-border-color);
}

.comment {
  margin-bottom: 16px;
}

.comment-card {
  background-color: white;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.comment-user {
  display: flex;
  gap: 12px;
  align-items: center;
}

.comment-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comment-username {
  font-weight: 600;
  font-size: 14px;
}

.comment-content {
  margin-left: 44px;
  line-height: 1.6;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

/* Админские контролы */
.admin-controls {
  padding: 16px;
  background-color: var(--el-color-info-light-9);
  border-top: 2px solid var(--el-color-info);
  border-radius: 0 0 8px 8px;
}

.admin-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-button {
  height: 36px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  border-width: 2px !important;
}

.likes-button {
  background-color: var(--el-color-success-light-9) !important;
  border-color: var(--el-color-success) !important;
  color: var(--el-color-success) !important;
}

.edit-button {
  background-color: var(--el-color-primary-light-9) !important;
  border-color: var(--el-color-primary) !important;
  color: var(--el-color-primary) !important;
}

.select-checkbox {
  margin-left: auto;
}

.select-checkbox :deep(.el-checkbox__label) {
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 480px) {
  .post-card {
    margin: 12px;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .action-button {
    flex: 1;
    min-width: 110px;
  }

  .comment-content {
    margin-left: 20px;
  }

  .admin-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .admin-button {
    width: 100%;
  }

  .select-checkbox {
    margin: 12px 0 0 0;
    align-self: flex-start;
  }
}
</style>