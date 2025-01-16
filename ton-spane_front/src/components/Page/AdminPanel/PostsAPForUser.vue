<!--PostsAP.vue-->
<template>
  <div class="posts-container">
    <!-- Bulk Actions Dialog -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="Подтверждение удаления"
      width="30%"
      :show-close="false"
    >
      <span>Вы действительно хотите удалить {{ selectedPosts.length }} пост(ов)?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">Отменить</el-button>
          <el-button type="danger" @click="handleDeletePosts">Удалить</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Edit Post Dialog -->
    <el-dialog
      v-model="editDialogVisible"
      title="Редактировать пост"
      width="40%"
    >
      <el-form :model="editForm" label-position="top">
        <el-form-item label="Текст" :error="errors.description">
          <el-input
            v-model="editForm.caption"
            type="textarea"
            :rows="4"
            placeholder="Введите описание"
            @input="handleInputDescription"
          />
        </el-form-item>

        <el-form-item>
          <el-switch
            v-model="editForm.isBlurred"
            active-text="Размытое изображение"
          />
        </el-form-item>

        <el-form-item label="Цена">
          <el-input-number
            v-model="editForm.price"
            :min="0"
            :max="999"
            :precision="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">Отменить</el-button>
          <el-button type="primary" @click="handleSavePost">Сохранить</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Likes Dialog -->
    <el-dialog
      v-model="likesDialogVisible"
      title="Добавить лайки"
      width="30%"
    >
      <el-form :model="likesForm">
        <el-form-item label="Количество лайков">
          <el-input-number
            v-model="likesForm.count"
            :min="1"
            :max="100"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="likesDialogVisible = false">Отменить</el-button>
          <el-button
            type="primary"
            @click="handleAddLikes"
            :loading="isAddingLikes"
          >
            Добавить
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Bulk Actions Bar -->
    <el-affix :offset="20" v-if="selectedPosts.length > 0">
      <div class="bulk-actions-container">
        <el-space>
          <el-button type="danger" @click="showDeleteConfirmation">
            Удалить {{ selectedPosts.length }} пост(ов)
          </el-button>
          <el-button @click="resetSelection">
            Сбросить выбор
          </el-button>
        </el-space>
      </div>
    </el-affix>

    <!-- Posts Grid -->
    <div class="posts-grid">
      <el-card
        v-for="post in displayPosts"
        :key="post.id"
        class="post-card"
      >
        <PostComponent
          :id="post.id"
          :user="post.user || user"
          :imageUrl="post.imageUrl"
          :caption="post.caption"
          :isBlurred="post.isBlurred"
          :price="post.price"
          :createdAt="post.createdAt"
          :initial-liked="post.isLikedByCurrentUser"
          :likes-count="post.likesCount || 0"
          @like-updated="handleLikeUpdate"
        />
        <div class="admin-controls">
          <div class="admin-buttons">
            <el-button
              type="success"
              class="admin-button likes-button"
              @click="openLikesDialog(post)"
            >
              <el-icon><Plus /></el-icon>
              <span class="button-text">{{ post.likesCount || 0 }} лайков</span>
            </el-button>

            <el-button
              type="primary"
              class="admin-button edit-button"
              @click="openEditDialog(post)"
            >
              <el-icon><Edit /></el-icon>
              <span class="button-text">Редактировать</span>
            </el-button>

            <el-checkbox
              v-model="selectedPosts"
              :label="post.id"
              class="select-checkbox"
            />
          </div>
        </div>
      </el-card>
    </div>

    <AddPostForm 
      v-if="showAddButton"
      :isOpen="isFormOpen"
      :userId="user?.id"
      @close="handleFormClose"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Edit } from '@element-plus/icons-vue'
import PostComponent from './PostComponent.vue'
import AddPostForm from './Models/AddPostForm.vue'
import config from '@/config'
import { validateInputToScript, removeTagsOperators } from "../../Validation"

const props = defineProps({
  postsParam: {
    type: Array,
    required: false,
    default: () => []
  },
  user: {
    type: Object,
    required: false,
    default: null
  },
  showAddButton: {
    type: Boolean,
    default: false
  }
})

// State
const selectedPosts = ref([])
const deleteDialogVisible = ref(false)
const editDialogVisible = ref(false)
const likesDialogVisible = ref(false)
const isFormOpen = ref(false)
const isAddingLikes = ref(false)
const listPosts = ref([])

const editForm = reactive({
  id: null,
  caption: '',
  price: 0,
  isBlurred: false
})

const likesForm = reactive({
  postId: null,
  count: 1
})

const errors = reactive({
  description: ''
})

// Computed
const displayPosts = computed(() => props.postsParam || listPosts.value)

// Methods
const getPosts = async () => {
  try {
    if (!props.postsParam) {
      const response = await fetch(`${config.API_BASE_URL}/posts/requester/a7248fe8-a4c1-4d49-bf22-5722f537916a`)
      const data = await response.json()
      listPosts.value = data
    }
  } catch (error) {
    console.error('Ошибка при получении постов:', error)
    ElMessage.error('Ошибка при загрузке постов')
  }
}

const handleInputDescription = () => {
  errors.description = ''
  const result = validateInputToScript(editForm.caption)
  if (!result.executionResult) {
    errors.description = result.messange
    editForm.caption = removeTagsOperators(editForm.caption)
  }
}

const openEditDialog = (post) => {
  editForm.id = post.id
  editForm.caption = post.caption
  editForm.price = post.price
  editForm.isBlurred = post.isBlurred
  editDialogVisible.value = true
}

const handleSavePost = async () => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/posts/${editForm.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caption: editForm.caption,
        price: editForm.price,
        isBlurred: editForm.isBlurred
      })
    })

    if (!response.ok) throw new Error('Failed to update post')

    const updatedPost = await response.json()
    
    if (!props.postsParam) {
      const index = listPosts.value.findIndex(post => post.id === updatedPost.id)
      if (index !== -1) {
        listPosts.value[index] = updatedPost
      }
    }

    editDialogVisible.value = false
    ElMessage.success('Пост успешно обновлен')
    window.dispatchEvent(new Event('postsDataChanged'))
  } catch (error) {
    console.error('Error updating post:', error)
    ElMessage.error('Ошибка при обновлении поста')
  }
}

const openLikesDialog = (post) => {
  likesForm.postId = post.id
  likesDialogVisible.value = true
}

const handleLikeUpdate = ({ postId, liked, count }) => {
  const post = displayPosts.value.find(p => p.id === postId)
  if (post) {
    post.isLikedByCurrentUser = liked
    post.likesCount = count
  }
}

const addMultipleLikes = async (likesCount, postId) => {
  const results = {
    successful: 0,
    failed: 0,
    errors: []
  }

  try {
    const response = await fetch(`${config.API_BASE_URL}/likes/${postId}/bulk`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ count: likesCount })
    })

    if (response.status === 201) {
      results.successful = likesCount
    } else {
      results.failed = likesCount
      const errorText = await response.text()
      results.errors.push({
        status: response.status,
        body: errorText
      })
    }
  } catch (error) {
    console.error('Error in bulk likes addition:', error)
    results.failed = likesCount
    results.errors.push({
      status: 'Error',
      body: error.toString()
    })
  }

  return results
}

const handleAddLikes = async () => {
  try {
    isAddingLikes.value = true
    const results = await addMultipleLikes(likesForm.count, likesForm.postId)
    
    if (results.errors.length > 0) {
      ElMessage.error('Ошибка при добавлении лайков')
    } else {
      ElMessage.success(`Успешно добавлено ${results.successful} лайков`)
    }

    await getPosts()
    window.dispatchEvent(new Event('postsDataChanged'))
    likesDialogVisible.value = false
  } catch (error) {
    console.error('Error adding likes:', error)
    ElMessage.error('Ошибка при добавлении лайков')
  } finally {
    isAddingLikes.value = false
  }
}

const showDeleteConfirmation = () => {
  deleteDialogVisible.value = true
}

const handleDeletePosts = async () => {
  try {
    for (const postId of selectedPosts.value) {
      await fetch(`${config.API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE'
      })
    }
    
    if (!props.postsParam) {
      listPosts.value = listPosts.value.filter(post => !selectedPosts.value.includes(post.id))
    }
    
    window.dispatchEvent(new Event('postsDataChanged'))
    selectedPosts.value = []
    deleteDialogVisible.value = false
    ElMessage.success('Посты успешно удалены')
  } catch (error) {
    console.error('Error deleting posts:', error)
    ElMessage.error('Ошибка при удалении постов')
  }
}

const resetSelection = () => {
  selectedPosts.value = []
}

const handleFormClose = () => {
  isFormOpen.value = false
  getPosts()
}

// Lifecycle
onMounted(() => {
  getPosts()
})
</script>

<style scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

.bulk-actions-container {
  background: var(--el-bg-color-overlay);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.post-card {
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.admin-controls {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-light);
}

.admin-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.admin-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.likes-button {
  background: var(--el-color-success);
  border-color: var(--el-color-success);
}

.likes-button:hover {
  background: var(--el-color-success-dark-2);
  border-color: var(--el-color-success-dark-2);
  transform: translateY(-2px);
}

.edit-button {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.edit-button:hover {
  background: var(--el-color-primary-dark-2);
  border-color: var(--el-color-primary-dark-2);
  transform: translateY(-2px);
}

.button-text {
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
}

.admin-button .el-icon {
  font-size: 18px;
}

.select-checkbox {
  margin-left: auto;
}

.select-checkbox :deep(.el-checkbox__label) {
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

:deep(.el-dialog) {
  background: var(--el-bg-color);
  border-radius: 12px;
}

:deep(.el-dialog__title) {
  color: var(--el-text-color-primary);
  font-weight: 600;
}

:deep(.el-dialog__body) {
  padding: 20px;
  color: var(--el-text-color-regular);
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  background-color: var(--el-input-bg-color);
  border-color: var(--el-border-color);
  color: var(--el-text-color-primary);
}

:deep(.el-input-number) {
  width: 100%;
}

/* Анимации и эффекты */
.post-card {
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.admin-button {
  position: relative;
  overflow: hidden;
}

.admin-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.admin-button:hover::after {
  width: 150%;
  height: 150%;
}

/* Адаптивность */
@media (max-width: 768px) {
  .posts-grid {
    padding: 0.5rem;
  }
  
  .admin-buttons {
    flex-direction: column;
    width: 100%;
  }

  .admin-button {
    width: 100%;
    justify-content: center;
  }

  .select-checkbox {
    align-self: center;
    margin-top: 8px;
  }

  .button-text {
    font-size: 13px;
  }

  .admin-button .el-icon {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .posts-container {
    padding: 0.5rem;
  }

  .bulk-actions-container {
    padding: 0.75rem;
  }

  :deep(.el-dialog) {
    width: 90% !important;
    margin: 0 auto;
  }
}
</style>