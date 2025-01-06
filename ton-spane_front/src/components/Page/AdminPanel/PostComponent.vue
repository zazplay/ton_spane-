<script setup>
import { computed, ref, onMounted,defineProps } from 'vue'
import { Lock, Share, Money, Delete, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const checked = ref(false)
const comments = ref([])
const selectedComments = ref([])
const isAdmin = ref(true)
const commentText = ref('')
const loading = ref(false)

const props = defineProps({
  id: { type: String, required: true },
  caption: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  isBlurred: { type: Boolean, default: false },
  price: { type: String, default: '' },
  createdAt: { type: String, required: true },
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

const formattedImageUrl = computed(() => {
  if (!props.imageUrl) return ''
  const baseUrl = 'https://tonimages.s3.us-east-1.amazonaws.com/'
  if (props.imageUrl.includes(baseUrl + baseUrl)) {
    return props.imageUrl.replace(baseUrl, baseUrl)
  }
  return props.imageUrl
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





const handleAddComment = async () => {
  if (!commentText.value.trim()) return

  loading.value = true
  try {
    const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/comments/post/${props.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'accept': 'application/json'
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
    // Сначала удаляем локально, чтобы интерфейс обновился мгновенно
    comments.value = comments.value.filter(c => c.id !== commentId)
    selectedComments.value = selectedComments.value.filter(id => id !== commentId)

    const response = await fetch('https://ton-back-e015fa79eb60.herokuapp.com/api/comments/admin/one', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'accept': 'application/json'
      },
      body: JSON.stringify({ id: commentId })
    })

    if (response.status === 204) {
      ElMessage.success('Комментарий удален')
    } else if (response.status === 404) {
      // Возвращаем комментарий обратно в случае ошибки
      await fetchComments()
      ElMessage.warning('Комментарий не найден')
    }
  } catch (error) {
    // Возвращаем комментарий обратно в случае ошибки
    await fetchComments()
    console.error('Error:', error)
    ElMessage.error('Ошибка при удалении комментария')
  }
}




const fetchComments = async () => {
  try {
    const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/comments/post/${props.id}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
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

onMounted(fetchComments)
</script>

<template>
  <el-card class="post-card">
    <!-- Header section -->
    <div class="header">
      <el-avatar :size="50" :src="props.user.profilePicture" />
      <div class="user-info">
        <div class="username">{{ props.user.username }}</div>
        <el-text class="date">{{ formatDate(props.createdAt) }}</el-text>
      </div>
    </div>

    <!-- Image section -->
    <div class="image-container">
      <el-image 
        class="post-image"
        :class="{ 'blurred': props.isBlurred }" 
        :src="formattedImageUrl" 
        :zoom-rate="1.2"
        :max-scale="7" 
        :min-scale="0.2" 
        :preview-src-list="props.isBlurred ? [] : [formattedImageUrl]" 
        :initial-index="4"
        fit="cover" 
        :preview-teleported="true"
      >
        <template #error>
          <div class="image-slot"></div>
        </template>
      </el-image>

      <div v-if="props.isBlurred" class="lock-overlay">
        <el-icon :size="50"><Lock /></el-icon>
        <span class="lock-text">{{ props.price }}$</span>
      </div>
    </div>

    <!-- Actions section -->
    <div class="actions">
      <div class="action-buttons">
        <el-checkbox 
          v-model="checked"
          :label="props.id"
          @change="(val) => $emit('select', props.id, val)"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="25" 
            height="25" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="red" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </el-checkbox>
        <el-button link>
          <el-icon size="25"><Share /></el-icon>
        </el-button>
        <el-button link>
          <el-icon size="25"><Money /></el-icon>
        </el-button>
      </div>
      <el-text tag="b" truncated>
        {{ props.caption }}
      </el-text>
    </div>

    <!-- Comments section -->
    <div class="comments-container">
      <el-divider>
        <el-icon><ChatDotRound /></el-icon>
        Комментарии ({{ comments.length }})
      </el-divider>

      <!-- Admin controls -->
      <div v-if="isAdmin" class="admin-controls">
        
      </div>

      <!-- Comment input -->
      <el-input
        v-model="commentText"
        type="textarea"
        :rows="2"
        placeholder="Напишите комментарий..."
        class="comment-input"
      >
        <template #append>
          <el-button 
            type="primary"
            :loading="loading"
            @click="handleAddComment"
          >
            Отправить
          </el-button>
        </template>
      </el-input>

      <!-- Comments list -->
      
      <el-scrollbar max-height="300px" class="comments-scrollbar">
        <transition-group 
          name="comment-list" 
          tag="div" 
          class="comments-list"
        >
          <div 
            v-for="comment in comments" 
            :key="comment.id" 
            class="comment-item"
          >
            <el-card 
              shadow="never" 
              :body-style="{ padding: '8px' }"
              class="comment-card"
            >
              <div class="comment-header">
                <div class="comment-user-info">
                  <el-avatar 
                    :size="24" 
                    :src="comment.user.profilePicture" 
                    class="comment-avatar"
                  />
                  <div class="comment-meta">
                    <span class="comment-username">{{ comment.user.username }}</span>
                    <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                </div>
                <div v-if="isAdmin" class="comment-actions">
                  <el-checkbox 
                    v-model="selectedComments" 
                    :label="comment.id" 
                  />
                  
                  <el-button 
                    type="danger" 
                    link 
                    @click="handleDeleteComment(comment.id)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <p class="comment-content">{{ comment.content }}</p>
            </el-card>
          </div>
        </transition-group>
        
        <el-empty 
          v-if="!comments.length" 
          description="Нет комментариев" 
          class="comments-empty"
        />
      </el-scrollbar>
    </div>
  </el-card>
</template>

<style scoped>
.post-card {
  width: 100%;
  margin-top: 10px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-left: 15px;
}

.username {
  font-weight: 500;
}

.date {
  font-size: 12px;
  color: #909399;
}

.image-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
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
  gap: 10px;
  z-index: 2;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(4px);
}

.lock-text {
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 15px 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.comments-container {
  margin-top: 20px;
}

.admin-controls {
  margin-bottom: 16px;
}

.comment-input {
  margin-bottom: 16px;
}

.comments-scrollbar {
  margin-top: 16px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.comment-card:hover {
  background-color: #f5f7fa;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.comment-user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-meta {
  display: flex;
  flex-direction: column;
}

.comment-username {
  font-size: 14px;
  font-weight: 500;
}

.comment-date {
  font-size: 12px;
  color: #909399;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-content {
  margin: 8px 0 0 32px;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Анимации */
.comment-list-enter-active,
.comment-list-leave-active {
  transition: all 0.3s ease;
}

.comment-list-enter-from,
.comment-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.comment-list-move {
  transition: transform 0.3s ease;
}

/* Медиа-запросы */
@media (max-width: 480px) {
  .post-card {
    width: 95%;
    margin: 10px auto;
  }

  .lock-text {
    font-size: 18px;
  }

  .actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .comment-content {
    margin-left: 8px;
  }

  .comment-actions {
    flex-wrap: wrap;
  }

  .comments-scrollbar {
    max-height: 400px;
  }
}
</style>