<script setup>
import { computed, ref, onMounted, defineProps, defineEmits } from 'vue'
import { Lock, Share, Money, Delete, ChatDotRound, CirclePlusFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['likeUpdated'])
const comments = ref([])
const isAdmin = ref(true)
const isLiked = ref(false)

// Состояние для модального окна фейковых комментариев
const showFakeCommentsModal = ref(false)
const fakeCommentsForm = ref({
  count: 1
})
const isAddingFakeComments = ref(false)

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

// Функция добавления фейковых комментариев
const handleAddFakeComments = async () => {
  if (fakeCommentsForm.value.count < 1 || fakeCommentsForm.value.count > 30) {
    ElMessage.warning('Количество комментариев должно быть от 1 до 30');
    return;
  }

  isAddingFakeComments.value = true;
  try {
    // Получаем текущее значение count из формы
    const count = parseInt(fakeCommentsForm.value.count);
    const postId = props.id;

    console.log('Sending request with:', { postId, count }); // Отладочный вывод

    const response = await fetch(`${API_BASE}/comments/${postId}/fake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'accept': 'application/json'
      },
      body: JSON.stringify({
        count: count
      })
    });

    console.log('Response status:', response.status); // Отладочный вывод

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при добавлении комментариев');
    }

    const result = await response.json();
    await fetchComments();
    showFakeCommentsModal.value = false;
    
    ElMessage({
      message: `Успешно добавлено ${result.addedComments} комментариев`,
      type: 'success'
    });

  } catch (error) {
    console.error('Error details:', error);
    ElMessage.error(error.message || 'Ошибка при добавлении комментариев');
  } finally {
    isAddingFakeComments.value = false;
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    comments.value = comments.value.filter(c => c.id !== commentId)

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
            <el-button
              v-if="isAdmin"
              type="success"
              circle
              class="add-comments-btn"
              @click="showFakeCommentsModal = true"
            >
              <el-icon><CirclePlusFilled /></el-icon>
            </el-button>
          </div>
        </el-divider>

        <el-scrollbar height="400px">
          <el-timeline v-if="comments.length">
            <el-timeline-item
              v-for="comment in comments"
              :key="comment.id"
              :hide-timestamp="false"
              :timestamp="formatDate(comment.createdAt)"
              type="primary"
            >
              <el-card class="timeline-card">
                <template #header>
                  <div class="card-header">
                    <div class="user-info-compact">
                      <el-avatar :size="32" :src="comment.user.profilePicture" />
                      <el-text class="comment-username" type="primary">
                        {{ comment.user.username }}
                      </el-text>
                    </div>
                    <div v-if="isAdmin" class="card-actions">
                      <el-button 
                        type="danger" 
                        :icon="Delete"
                        circle
                        @click="handleDeleteComment(comment.id)"
                      />
                    </div>
                  </div>
                </template>
                <el-text>{{ comment.content }}</el-text>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          
          <el-empty 
            v-else
            description="Нет комментариев" 
          />
        </el-scrollbar>
      </div>
    </el-card>

    <!-- Модальное окно фейковых комментариев -->
    <el-dialog
      v-model="showFakeCommentsModal"
      title="Добавить комментарии"
      width="400px"
      :modal="true"
      :append-to-body="true"
      :lock-scroll="true"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form :model="fakeCommentsForm" label-position="top">
        <el-form-item label="Количество комментариев">
          <el-input-number
            v-model="fakeCommentsForm.count"
            :min="1"
            :max="30"
            controls-position="right"
            class="w-full"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showFakeCommentsModal = false">
            Отмена
          </el-button>
          <el-button
            type="primary"
            @click="handleAddFakeComments"
            :loading="isAddingFakeComments"
          >
            Добавить
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<style scoped>

:deep(.el-timeline-item__content) {
  width: 110%;
  margin-left: -60px;
  margin-top: 10px;
  margin-right: 0px;
  padding-right: 0px;
}

:deep(.el-timeline-item__node) {
  position: absolute;
  left: 0;
  top: 0;
}

:deep(.el-timeline-item__tail) {
  position: absolute;
  left: 4px;
}

:deep(.el-timeline-item__wrapper) {
  width: calc(100% - 24px);
  margin-left: auto;
}

.timeline-card {
  width: 100%;
  background-color: var(--el-bg-color);
  border-radius: 8px;
}
/* Базовые стили для карточки */
.post-card {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* Стили заголовка */
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

/* Стили для изображения */
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

/* Стили для кнопок действий */
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

/* Стили для подписи */
.caption {
  padding: 16px;
  margin: 0;
  line-height: 1.6;
  font-size: 15px;
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
  border-bottom: 2px solid var(--el-border-color);
}

/* Стили для секции комментариев */
.comments-section {
  padding: 20px;
  background-color: var(--el-bg-color-page);
  border-radius: 0 0 8px 8px;
}

.comments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

/* Стили для Timeline карточки */
.timeline-card {
  background-color: var(--el-bg-color);
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.user-info-compact {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comment-username {
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 8px;
}

/* Стили для диалога */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Медиа-запросы */
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

  .dialog-footer {
    flex-direction: column;
  }

  .dialog-footer .el-button {
    width: 100%;
  }
}
</style>