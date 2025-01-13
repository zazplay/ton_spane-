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
          />
  
          <div class="post-actions">
            <div class="likes-section">
              <el-button
                type="success"
                circle
                @click="openLikesDialog(post)"
              >
                <el-icon><Plus /></el-icon>
              </el-button>
              <span class="likes-count">
                {{ post.likes ? post.likes.length : 0 }} лайков
              </span>
            </div>
  
            <el-space>
              <el-button
                type="primary"
                @click="openEditDialog(post)"
              >
                <el-icon><Edit /></el-icon>
                Редактировать
              </el-button>
              <el-checkbox
                v-model="selectedPosts"
                :label="post.id"
                border
              />
            </el-space>
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
  import { ref, computed, reactive,onMounted,defineProps } from 'vue'
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
  
  const handleAddLikes = async () => {
    try {
      isAddingLikes.value = true
      const results = await addMultipleLikes(likesForm.count, likesForm.postId)
      
      if (results.errors.length > 0) {
        ElMessage({
          message: `Успешно добавлено ${results.successful} лайков, ${results.failed} не удалось`,
          type: results.failed === 0 ? 'success' : 'warning'
        })
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
  
  const addMultipleLikes = async (likesCount, postId) => {
    const results = {
      successful: 0,
      failed: 0,
      errors: []
    }
  
    try {
      const requests = Array(likesCount).fill().map(() => 
        fetch(`${config.API_BASE_URL}/likes/49c598e5-3a2e-47ce-9e03-db88b8dc6977/like/${postId}`, {
          method: 'POST',
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
          }
        })
      )
  
      const chunkSize = 200
      for (let i = 0; i < requests.length; i += chunkSize) {
        const chunk = requests.slice(i, i + chunkSize)
        const responses = await Promise.allSettled(chunk)
        
        for (const response of responses) {
          if (response.status === 'fulfilled' && response.value.status === 201) {
            results.successful++
          } else {
            results.failed++
            results.errors.push({
              status: response.status === 'fulfilled' ? response.value.status : 'Rejected',
              body: response.status === 'fulfilled' ? await response.value.text() : response.reason.toString()
            })
          }
        }
  
        if (i + chunkSize < requests.length) {
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      }
    } catch (error) {
      console.error('Error in batch likes addition:', error)
      results.errors.push({
        status: 'Error',
        body: error.toString()
      })
    }
  
    return results
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
    background: rgb(30, 27, 27);
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
    background: rgb(30, 27, 27);
    transition: transform 0.2s ease;
  }
  
 
  
  .post-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .likes-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .likes-count {
    font-size: 14px;
    color: #fff;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  :deep(.el-dialog) {
    background: rgb(30, 27, 27);
  }
  
  :deep(.el-dialog__title) {
    color: #fff;
  }
  
  :deep(.el-button) {
    border-radius: 8px;
  }
  
  @media (max-width: 768px) {
    .posts-grid {
      grid-template-columns: 1fr;
    }
    
    .post-actions {
      flex-direction: column;
      gap: 1rem;
    }
  }
  </style>