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

        <el-form :model="filterState" label-position="top">
          <el-row :gutter="20">
            <!-- Search -->
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Поиск">
                <el-input
                  v-model="filterState.search"
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
                  v-model="filterState.dateRange"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="Начало"
                  end-placeholder="Конец"
                  :shortcuts="dateShortcuts"
                  @change="handleFiltersChange"
                  class="w-full"
                />
              </el-form-item>
            </el-col>

            <!-- Price Range -->
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Диапазон цен">
                <el-slider
                  v-model="filterState.priceRange"
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
                <el-select v-model="filterState.sortBy" class="w-full" @change="handleFiltersChange">
                  <el-option v-for="option in sortOptions" 
                            :key="option.value" 
                            :label="option.label" 
                            :value="option.value" />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Sort Order -->
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Порядок">
                <el-select v-model="filterState.sortOrder" class="w-full" @change="handleFiltersChange">
                  <el-option v-for="option in orderOptions" 
                            :key="option.value" 
                            :label="option.label" 
                            :value="option.value" />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Blur Filter -->
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Статус размытия">
                <el-select v-model="filterState.blurStatus" class="w-full" @change="handleFiltersChange">
                  <el-option v-for="option in blurOptions" 
                            :key="option.value" 
                            :label="option.label" 
                            :value="option.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- Content States -->
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

      <el-empty
        v-else-if="!filteredPosts.length"
        description="Постов не найдено"
        class="empty-state"
      >
        <template #image>
          <el-icon :size="60"><Box /></el-icon>
        </template>
      </el-empty>

      <template v-else>
        <!-- Bulk Actions -->
        <el-affix :offset="20" v-show="selectedPosts.length > 0">
          <div class="bulk-actions">
            <el-space wrap alignment="center" :size="16">
              <span class="selected-count">
                Выбрано: {{ selectedPosts.length }}
              </span>
              <el-button-group>
                <el-button type="danger" @click="confirmDelete" :icon="Delete">
                  Удалить
                </el-button>
                <el-button type="warning" @click="handleBulkOperation(true)" :icon="Hide">
                  Размыть
                </el-button>
                <el-button type="success" @click="handleBulkOperation(false)" :icon="View">
                  Снять размытие
                </el-button>
              </el-button-group>
              <el-button plain @click="selectedPosts = []" :icon="Close">
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
            v-bind="getPostProps(post)"
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
                  <el-button type="primary" :icon="Edit" @click="openEditDialog(post)" />
                  <el-button 
                    :type="post.isBlurred ? 'success' : 'warning'"
                    :icon="post.isBlurred ? View : Hide"
                    @click="toggleBlur(post)"
                  />
                  <el-button type="danger" :icon="Delete" @click="confirmDeleteSingle(post)" />
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
import { ref, computed, watch, onMounted, defineProps } from 'vue'

/* eslint-disable no-undef */
import { Delete, Close, Box, Edit, Search, RefreshRight, Hide, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PostCard from '../../PostCard.vue'
import debounce from 'lodash/debounce'

// Constants
const API_URL = 'https://ton-back-e015fa79eb60.herokuapp.com/api'

const sortOptions = [
  { label: 'Дата создания', value: 'createdAt' },
  { label: 'Дата обновления', value: 'updatedAt' },
  { label: 'Цена', value: 'price' },
  { label: 'Лайки', value: 'likes' },
  { label: 'Комментарии', value: 'comments' }
]

const orderOptions = [
  { label: 'По возрастанию', value: 'asc' },
  { label: 'По убыванию', value: 'desc' }
]

const blurOptions = [
  { label: 'Все посты', value: 'all' },
  { label: 'Размытые', value: 'blurred' },
  { label: 'Не размытые', value: 'not-blurred' }
]

const dateShortcuts = [
  {
    text: 'Последняя неделя',
    value: () => [new Date(Date.now() - 7 * 24 * 3600 * 1000), new Date()]
  },
  {
    text: 'Последний месяц',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    }
  }
]

// Props
const props = defineProps({
  selectedUser: {
    type: Object,
    default: null
  }
})

// State
const loading = ref(true)
const posts = ref([])
const selectedPosts = ref([])
const editingPost = ref(null)
const postToDelete = ref(null)

const filterState = ref({
  search: '',
  dateRange: null,
  priceRange: [0, 1000],
  sortBy: 'createdAt',
  sortOrder: 'desc',
  blurStatus: 'all'
})

// Computed
const filteredPosts = computed(() => {
  let result = [...posts.value]

  const {
    search, dateRange, priceRange,
    sortBy, sortOrder, blurStatus
  } = filterState.value

  // Apply filters
  if (search) {
    const searchLower = search.toLowerCase()
    result = result.filter(post => 
      post.caption?.toLowerCase().includes(searchLower) ||
      post.model?.username?.toLowerCase().includes(searchLower)
    )
  }

  if (dateRange?.[0] && dateRange?.[1]) {
    const [start, end] = dateRange
    result = result.filter(post => {
      const date = new Date(post.createdAt)
      return date >= start && date <= end
    })
  }

  result = result.filter(post => 
    post.price >= priceRange[0] && 
    post.price <= priceRange[1]
  )

  if (blurStatus !== 'all') {
    result = result.filter(post => 
      blurStatus === 'blurred' ? post.isBlurred : !post.isBlurred
    )
  }

  // Apply sorting
  const getSortValue = (post) => {
    switch (sortBy) {
      case 'likes': return post.likesCount || 0
      case 'comments': return post.comments?.length || 0
      case 'price': return post.price || 0
      default: return new Date(post[sortBy])
    }
  }

  result.sort((a, b) => {
    const aValue = getSortValue(a)
    const bValue = getSortValue(b)
    return sortOrder === 'asc' 
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1
  })

  return result
})

// Methods
const fetchPosts = async () => {
  try {
    loading.value = true
    // const userId = props.selectedUser?.id || DEFAULT_USER_ID // Убираем неиспользуемую переменную
    const response = await fetch(`${API_URL}/posts/admin`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    posts.value = await response.json()
  } catch (error) {
    console.error('Error fetching posts:', error)
    ElMessage.error('Ошибка при загрузке постов')
    posts.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = debounce(() => {
  // Filters are automatically applied through computed property
}, 300)

const handleFiltersChange = () => {
  // Filters are automatically applied through computed property
}

const handleBulkOperation = async (blur) => {
  try {
    await Promise.all(selectedPosts.value.map(postId => 
      fetch(`${API_URL}/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlurred: blur })
      })
    ))

    await fetchPosts()
    selectedPosts.value = []
    ElMessage.success(`Размытие ${blur ? 'добавлено' : 'убрано'} для выбранных постов`)
  } catch (error) {
    console.error('Error in bulk operation:', error)
    ElMessage.error(`Ошибка при массовом ${blur ? 'размытии' : 'снятии размытия'}`)
  }
}

const toggleBlur = async (post) => {
  try {
    const response = await fetch(`${API_URL}/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlurred: !post.isBlurred })
    })

    if (!response.ok) throw new Error('Failed to toggle blur')

    const updatedPost = await response.json()
    const index = posts.value.findIndex(p => p.id === updatedPost.id)
    if (index !== -1) {
      posts.value[index] = updatedPost
    }

    ElMessage.success(`Размытие ${post.isBlurred ? 'убрано' : 'добавлено'}`)
  } catch (error) {
    console.error('Error toggling blur:', error)
    ElMessage.error('Ошибка при изменении размытия')
  }
}

const getPostProps = (post) => ({
  id: post.id,
  user: post.model, // Здесь important - user, а не model
  imageUrl: post.imageUrl,
  caption: post.caption,
  isBlurred: post.isBlurred,
  price: post.price,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  comments: post.comments,
  likesCount: post.likesCount,
  isLikedByCurrentUser: post.isLikedByCurrentUser,
  isSubscribed: post.isSubscribed
})

const openEditDialog = (post) => {
  editingPost.value = { ...post }
}

const confirmDelete = () => {
  postToDelete.value = null
}

const confirmDeleteSingle = (post) => {
  postToDelete.value = post
}

// Watchers
watch(() => props.selectedUser, (newUser) => {
  if (newUser) fetchPosts()
}, { deep: true })

// Lifecycle
onMounted(fetchPosts)
</script>

<style scoped>
:root {
  --transition-speed: 0.3s;
  --shadow-light: 0 2px 12px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Layout */
.scrollbar-container {
  height: calc(100vh - 64px);
  width: 100%;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  min-height: 100%;
  position: relative;
}

/* Content wrapper to prevent overlap */
.posts-grid,
.loading-state,
.empty-state {
  position: relative;
  z-index: 1;
}

/* Utility Classes */
.w-full {
  width: 100%;
}

  /* Filter Card */
.filter-card {
  top: 1rem;
  z-index: 1000;
  background: var(--el-bg-color);
  border-radius: 8px;
  margin-bottom: 2rem;
  transition: box-shadow var(--transition-speed) ease;
  box-shadow: var(--shadow-light);
  backdrop-filter: blur(8px);
}

.filter-card:hover {
  box-shadow: var(--shadow-medium);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Bulk Actions */
.bulk-actions {
  background: var(--el-bg-color);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: var(--shadow-light);
  margin-bottom: 1rem;
  transition: all var(--transition-speed) ease;
}

.selected-count {
  font-weight: bold;
  color: var(--el-text-color-primary);
  min-width: 100px;
}

/* Posts Grid */
.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.post-card-container {
  transition: transform var(--transition-speed) ease,
              box-shadow var(--transition-speed) ease;
}

.post-card-container:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* Post Actions */
.post-checkbox {
  margin-right: 0;
}

.post-actions {
  display: flex;
  gap: 8px;
}

/* States */
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

.empty-state {
  padding: 40px;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  text-align: center;
}

/* Scrollbar */
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
  transition: background-color var(--transition-speed) ease;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background-color: var(--el-color-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .scrollbar-container {
    height: calc(100vh - 56px);
  }

  .posts-container {
    padding: 0.5rem;
  }

  .bulk-actions {
    padding: 0.5rem;
  }

  :deep(.el-space),
  :deep(.el-button-group) {
    width: 100%;
  }

  :deep(.el-space__item) {
    margin-right: 0 !important;
  }

  :deep(.el-button-group .el-button) {
    flex: 1;
  }

  .selected-count {
    width: 100%;
    text-align: center;
  }
}

/* Touch Devices */
@media (hover: none) {
  .post-card-container:hover {
    transform: none;
  }
}
</style>