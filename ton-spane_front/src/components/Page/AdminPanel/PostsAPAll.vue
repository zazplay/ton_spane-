<template>
  <el-scrollbar height="calc(100vh - 64px)" class="scrollbar-container">
    <div class="posts-container">
      <!-- Filters Card -->
      <el-card class="filter-card">
        <template #header>
          <div class="filter-header">
            <span>Фильтры и поиск</span>
            <el-button :icon="RefreshRight" circle @click="fetchPosts" />
          </div>
        </template>

        <el-form :model="filters" label-position="top">
          <el-row :gutter="20">
            <!-- Search -->
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Поиск">
                <el-input
                  v-model="filters.search"
                  placeholder="Поиск по тексту"
                  :prefix-icon="Search"
                  clearable
                  @clear="handleSearch"
                  @input="handleSearch"
                />
              </el-form-item>
            </el-col>

            <!-- Date Range -->
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Период">
                <el-date-picker
                  v-model="filters.dateRange"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="Начало"
                  end-placeholder="Конец"
                  :shortcuts="dateShortcuts"
                  @change="handleFiltersChange"
                  class="date-picker-full"
                />
              </el-form-item>
            </el-col>

            <!-- Price Range -->
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Диапазон цен">
                <el-slider
                  v-model="filters.priceRange"
                  range
                  :min="0"
                  :max="1000"
                  @change="handleFiltersChange"
                />
              </el-form-item>
            </el-col>

            <!-- Sort -->
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Сортировка">
                <el-select v-model="sortBy" class="select-full" @change="handleFiltersChange">
                  <el-option label="Дата создания" value="createdAt" />
                  <el-option label="Дата обновления" value="updatedAt" />
                  <el-option label="Цена" value="price" />
                  <el-option label="Лайки" value="likes" />
                  <el-option label="Комментарии" value="comments" />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Sort Order -->
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Порядок">
                <el-select v-model="sortOrder" class="select-full" @change="handleFiltersChange">
                  <el-option label="По возрастанию" value="asc" />
                  <el-option label="По убыванию" value="desc" />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Blur Filter -->
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Статус размытия">
                <el-select 
                  v-model="filterBlurred" 
                  class="select-full"
                  @change="handleFiltersChange"
                >
                  <el-option label="Все посты" value="all" />
                  <el-option label="Размытые" value="blurred" />
                  <el-option label="Не размытые" value="not-blurred" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="3" animated>
          <template #template>
            <div v-for="n in 3" :key="n" class="skeleton-card">
              <el-skeleton-item variant="image" style="width: 100%; height: 240px"/>
              <div style="padding: 14px">
                <el-skeleton-item variant="h3" style="width: 50%"/>
                <el-skeleton-item variant="text" style="width: 100%"/>
                <el-skeleton-item variant="text" style="width: 100%"/>
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>

      <!-- Empty State -->
      <el-empty
        v-else-if="!filteredPosts.length"
        description="Постов не найдено"
        class="empty-state"
      >
        <template #image>
          <el-icon :size="60"><Box /></el-icon>
        </template>
      </el-empty>

      <!-- Posts List -->
      <template v-else>
        <!-- Bulk Actions -->
        <el-affix :offset="20" v-if="selectedPosts.length > 0">
          <div class="bulk-actions">
            <el-space wrap alignment="center" :size="16">
              <span class="selected-count">
                Выбрано: {{ selectedPosts.length }}
              </span>
              <el-button-group>
                <el-button 
                  type="danger" 
                  @click="confirmDelete"
                  :icon="Delete"
                >
                  Удалить
                </el-button>
                <el-button 
                  type="warning" 
                  @click="handleBulkBlur"
                  :icon="Hide"
                >
                  Размыть
                </el-button>
                <el-button 
                  type="success"
                  @click="handleBulkUnblur"
                  :icon="View"
                >
                  Снять размытие
                </el-button>
              </el-button-group>
              <el-button 
                plain
                @click="selectedPosts = []"
                :icon="Close"
              >
                Отменить выбор
              </el-button>
            </el-space>
          </div>
        </el-affix>

        <!-- Posts Grid -->
        <div class="posts-grid">
          <PostCard
            v-for="post in filteredPosts"
            :key="post.id"
            :id="post.id"
            :user="post.model"
            :imageUrl="post.imageUrl"
            :caption="post.caption"
            :isBlurred="post.isBlurred"
            :price="post.price"
            :createdAt="post.createdAt"
            :updatedAt="post.updatedAt"
            :comments="post.comments"
            :likes="post.likes"
            :isLikedByCurrentUser="post.isLikedByCurrentUser"
            :isSubscribed="post.isSubscribed"
            class="post-card-container"
          >
            <template #actions>
              <el-space wrap :size="8">
                <el-checkbox 
                  v-model="selectedPosts" 
                  :label="post.id"
                  class="post-checkbox"
                />
                <el-button-group class="post-actions">
                  <el-button 
                    type="primary" 
                    :icon="Edit"
                    @click="openEditDialog(post)"
                  />
                  <el-button 
                    :type="post.isBlurred ? 'success' : 'warning'"
                    :icon="post.isBlurred ? View : Hide"
                    @click="toggleBlur(post)"
                  />
                  <el-button 
                    type="danger" 
                    :icon="Delete"
                    @click="confirmDeleteSingle(post)"
                  />
                </el-button-group>
              </el-space>
            </template>
          </PostCard>
        </div>
      </template>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { ref, computed, watch, onMounted,defineProps } from 'vue'
import { 
  Delete, Close, Box, Edit, Search, RefreshRight,
  Hide, View 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PostCard from '../../PostCard.vue'
import debounce from 'lodash/debounce'

// Props
const props = defineProps({
  selectedUser: {
    type: Object,
    default: null
  },
  user: {
    type: Object,
    default: null
  }
})

// State
const loading = ref(true)
const localPosts = ref([])
const selectedPosts = ref([])
const deleteDialogVisible = ref(false)
const editDialogVisible = ref(false)
// const isDeleting = ref(false)
const editingPost = ref(null)
const postToDelete = ref(null)

// Filters and Sort State
const sortBy = ref('createdAt')
const sortOrder = ref('desc')
const filterBlurred = ref('all')
const filters = ref({
  search: '',
  dateRange: null,
  priceRange: [0, 1000],
})

// Date Shortcuts
const dateShortcuts = [
  {
    text: 'Последняя неделя',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Последний месяц',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
]

// API Constants
const API_URL = 'https://ton-back-e015fa79eb60.herokuapp.com/api'
const DEFAULT_USER_ID = 'f57478e4-4dce-48b2-b4f4-e54b98682ebe'

// Computed
// const deleteConfirmMessage = computed(() => {
//   if (postToDelete.value) {
//     return 'Вы действительно хотите удалить этот пост?'
//   }
//   return `Вы действительно хотите удалить выбранные посты (${selectedPosts.value.length})?`
// })

const filteredPosts = computed(() => {
  let result = [...localPosts.value]

  // Search filter
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    result = result.filter(post => 
      post.caption?.toLowerCase().includes(searchLower) ||
      post.model?.username?.toLowerCase().includes(searchLower)
    )
  }

  // Date range filter
  if (filters.value.dateRange?.[0] && filters.value.dateRange?.[1]) {
    result = result.filter(post => {
      const postDate = new Date(post.createdAt)
      return postDate >= filters.value.dateRange[0] && 
             postDate <= filters.value.dateRange[1]
    })
  }

  // Price range filter
  result = result.filter(post => 
    post.price >= filters.value.priceRange[0] && 
    post.price <= filters.value.priceRange[1]
  )

  // Blur filter
  if (filterBlurred.value !== 'all') {
    result = result.filter(post => 
      filterBlurred.value === 'blurred' ? post.isBlurred : !post.isBlurred
    )
  }

  // Sorting
  result.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy.value) {
      case 'likes':
        aValue = a.likes?.length || 0
        bValue = b.likes?.length || 0
        break
      case 'comments':
        aValue = a.comments?.length || 0
        bValue = b.comments?.length || 0
        break
      case 'price':
        aValue = a.price || 0
        bValue = b.price || 0
        break
      default:
        aValue = new Date(a[sortBy.value])
        bValue = new Date(b[sortBy.value])
    }

    return sortOrder.value === 'asc' 
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1
  })

  return result
})

// Methods
const fetchPosts = async () => {
  try {
    loading.value = true
    const userId = props.selectedUser?.id || DEFAULT_USER_ID
    console.log('Fetching posts for userId:', userId)
    
    const response = await fetch(`${API_URL}/posts/requester/${userId}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()
    console.log('Fetched posts:', data)
    localPosts.value = data
  } catch (error) {
    console.error('Error fetching posts:', error)
    ElMessage.error('Ошибка при загрузке постов')
    localPosts.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = debounce(() => {
  console.log('Search term:', filters.value.search)
}, 300)

const handleFiltersChange = () => {
  console.log('Filters changed')
}

const openEditDialog = (post) => {
  editingPost.value = { ...post }
  editDialogVisible.value = true
}

// const handleSaveEdit = async () => {
//   try {
//     const response = await fetch(`${API_URL}/posts/${editingPost.value.id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         caption: editingPost.value.caption,
//         price: editingPost.value.price,
//         isBlurred: editingPost.value.isBlurred
//       })
//     })

//     if (!response.ok) throw new Error('Failed to update post')

//     const updatedPost = await response.json()
//     const index = localPosts.value.findIndex(p => p.id === updatedPost.id)
//     if (index !== -1) {
//       localPosts.value[index] = updatedPost
//     }

//     editDialogVisible.value = false
//     editingPost.value = null
//     ElMessage.success('Пост успешно обновлен')
//   } catch (error) {
//     console.error('Error updating post:', error)
//     ElMessage.error('Ошибка при обновлении поста')
//   }
// }

const toggleBlur = async (post) => {
  try {
    const response = await fetch(`${API_URL}/posts/${post.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isBlurred: !post.isBlurred
      })
    })

    if (!response.ok) throw new Error('Failed to toggle blur')

    const updatedPost = await response.json()
    const index = localPosts.value.findIndex(p => p.id === updatedPost.id)
    if (index !== -1) {
      localPosts.value[index] = updatedPost
    }

    ElMessage.success(`Размытие ${post.isBlurred ? 'убрано' : 'добавлено'}`)
  } catch (error) {
    console.error('Error toggling blur:', error)
    ElMessage.error('Ошибка при изменении размытия')
  }
}

const handleBulkBlur = async () => {
  try {
    await Promise.all(selectedPosts.value.map(async (postId) => {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isBlurred: true
        })
      })

      if (!response.ok) throw new Error(`Failed to blur post ${postId}`)
      return response.json()
    }))

    await fetchPosts()
    selectedPosts.value = []
    ElMessage.success('Размытие добавлено для выбранных постов')
  } catch (error) {
    console.error('Error in bulk blur:', error)
    ElMessage.error('Ошибка при массовом размытии')
  }
}

const handleBulkUnblur = async () => {
  try {
    await Promise.all(selectedPosts.value.map(async (postId) => {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isBlurred: false
        })
      })

      if (!response.ok) throw new Error(`Failed to unblur post ${postId}`)
      return response.json()
    }))

    await fetchPosts()
    selectedPosts.value = []
    ElMessage.success('Размытие убрано для выбранных постов')
  } catch (error) {
    console.error('Error in bulk unblur:', error)
    ElMessage.error('Ошибка при массовом снятии размытия')
  }
}

const confirmDelete = () => {
  postToDelete.value = null
  deleteDialogVisible.value = true
}

const confirmDeleteSingle = (post) => {
  postToDelete.value = post
  deleteDialogVisible.value = true
}

// const handleDeleteConfirmed = async () => {
//   try {
//     isDeleting.value = true

//     if (postToDelete.value) {
//       // Удаление одного поста
//       await fetch(`${API_URL}/posts/${postToDelete.value.id}`, {
//         method: 'DELETE'
//       })
//       localPosts.value = localPosts.value.filter(p => p.id !== postToDelete.value.id)
//     } else {
//       // Массовое удаление
//       await Promise.all(selectedPosts.value.map(postId => 
//         fetch(`${API_URL}/posts/${postId}`, { method: 'DELETE' })
//       ))
//       localPosts.value = localPosts.value.filter(post => !selectedPosts.value.includes(post.id))
//       selectedPosts.value = []
//     }

//     deleteDialogVisible.value = false
//     postToDelete.value = null
//     ElMessage.success('Посты успешно удалены')
//   } catch (error) {
//     console.error('Error deleting posts:', error)
//     ElMessage.error('Ошибка при удалении постов')
//   } finally {
//     isDeleting.value = false
//   }
// }

// Watchers
watch(() => props.selectedUser, (newUser) => {
  if (newUser) {
    fetchPosts()
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
/* Scrollbar Styles */
.scrollbar-container {
  height: calc(100vh - 64px);
  width: 100%;
}

.scrollbar-container :deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

/* Container Styles */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  max-width: 100%;
  min-height: 100%;
}

/* Filter Card Styles */
.filter-card {
  top: 1rem;
  z-index: 10;
  background: var(--el-bg-color);
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: box-shadow 0.3s ease;
}

.filter-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-full {
  width: 100%;
}

.date-picker-full {
  width: 100%;
}

/* Bulk Actions Styles */
.bulk-actions {
  background: var(--el-bg-color);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.selected-count {
  font-weight: bold;
  color: var(--el-text-color-primary);
  min-width: 100px;
}

/* Posts Grid Styles */
.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.post-card-container {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-card-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-checkbox {
  margin-right: 0;
}

.post-actions {
  display: flex;
  gap: 8px;
}

/* Loading State Styles */
.loading-state {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.skeleton-card {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

/* Empty State Styles */
.empty-state {
  padding: 40px;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  text-align: center;
}

/* Custom Scrollbar Styles */
:deep(*) {
  scrollbar-width: thin;
  scrollbar-color: var(--el-color-primary) transparent;
}

:deep(*::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(*::-webkit-scrollbar-track) {
  background: transparent;
  border-radius: 4px;
}

:deep(*::-webkit-scrollbar-thumb) {
  background-color: var(--el-color-primary-light-5);
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background-color: var(--el-color-primary);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .scrollbar-container {
    height: calc(100vh - 56px);
  }

  .posts-container {
    padding: 0.5rem;
  }

  .filter-card :deep(.el-form-item) {
    margin-bottom: 12px;
  }

  .bulk-actions {
    padding: 0.5rem;
  }

  :deep(.el-space) {
    width: 100%;
  }

  :deep(.el-space__item) {
    margin-right: 0 !important;
  }

  :deep(.el-button-group) {
    display: flex;
    width: 100%;
  }

  :deep(.el-button-group .el-button) {
    flex: 1;
  }

  .selected-count {
    width: 100%;
    text-align: center;
  }
}

/* Touch Device Optimization */
@media (hover: none) {
  .scrollbar-container :deep(.el-scrollbar__wrap) {
    -webkit-overflow-scrolling: touch;
  }

  .post-card-container:hover {
    transform: none;
  }
}
</style>