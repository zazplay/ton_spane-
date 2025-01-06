<template>
  <el-container>
    <el-main class="p-4">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Filters Section -->
        <div class="grid gap-6" style="display: flex;">
          <el-card class="filter-section">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4" style="margin-bottom:20px ;">
              <el-input
                v-model="searchQuery"
                placeholder="Поиск по названию или имени автора"
                clearable
                :prefix-icon="Search"
                style="margin-bottom:20px ;"
              />
              <el-select
                v-model="sortBy"
                placeholder="Сортировка"
                class="w-full"
              >
                <el-option label="Дата (новые)" value="date-desc" />
                <el-option label="Дата (старые)" value="date-asc" />
                <el-option label="Лайки (больше)" value="likes-desc" />
                <el-option label="Лайки (меньше)" value="likes-asc" />
                <el-option label="Автор (А-Я)" value="author-asc" />
                <el-option label="Автор (Я-А)" value="author-desc" />
              </el-select>
              
            </div>
            
            <div class="mt-4">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="до"
                start-placeholder="Начальная дата"
                end-placeholder="Конечная дата"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                class="w-full"
              />
            </div>
          </el-card>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <el-card shadow="hover" class="stats-card">
              <template #header>
                <div class="font-bold h-16 flex items-center">Всего видео</div>
              </template>
              <div class="text-center text-2xl font-medium">
                {{ filteredVideos.length }}
              </div>
            </el-card>

            <el-card shadow="hover" class="stats-card">
              <template #header>
                <div class="font-bold h-16 flex items-center">Общее количество лайков</div>
              </template>
              <div class="text-center text-2xl font-medium">
                {{ totalLikes }}
              </div>
            </el-card>

            <el-card shadow="hover" class="stats-card">
              <template #header>
                <div class="font-bold h-16 flex items-center">Уникальных авторов</div>
              </template>
              <div class="text-center text-2xl font-medium">
                {{ uniqueAuthors }}
              </div>
            </el-card>
          </div>
        </div>

       <!-- Modified Video Cards Section -->
<el-row :gutter="20" style="margin-top: -270px; width: 85%;">
  <el-col
    v-for="video in paginatedVideos"
    :key="video.id"
    :xs="24"
    :sm="12"
    :md="8"
    :lg="8"
    :xl="8"
    style="margin-bottom: 20px; width: 200px;"
  >
    <el-card
      shadow="hover"
      style="height: 100%; display: flex; flex-direction: column; width: auto;"
    >
      <!-- Rest of the card content remains the same -->
      <div style="position: relative; width: 100%; padding-top: 56.25%; background-color: #000; margin-bottom: 16px; border-radius: 4px; overflow: hidden">
        <el-skeleton v-if="loadingVideos.has(video.id)" :rows="3" animated />
        <video
          v-else-if="!videoLoadErrors.has(video.id)"
          :src="getFullVideoUrl(video.videoUrl)"
          preload="metadata"
          @loadedmetadata="handleVideoMetadata($event, video)"
          @error="handleVideoError($event, video)"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 150px;"
        ></video>
        <div
          v-else
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #909399"
        >
          <el-icon style="font-size: 32px; margin-bottom: 8px"><VideoPlay /></el-icon>
          <p>Видео недоступно</p>
        </div>
      </div>

      <el-space direction="vertical" alignment="stretch" :size="14" style="flex-grow: 1">
        <el-row align="middle" :gutter="10">
          <el-col :span="6">
            <el-avatar
              :size="40"
              :src="video.model.profilePicture"
              @error="errorHandler"
            >
              {{ video.model.username.charAt(0) }}
            </el-avatar>
          </el-col>
          <el-col :span="18">
            <div style="font-weight: 500">{{ video.model.username }}</div>
            <el-text truncated class="text-sm text-gray-500">
              {{ video.caption || 'Без названия' }}
            </el-text>
          </el-col>
        </el-row>

        <el-space wrap>
          <el-tag size="small" type="info">
            <el-icon><Calendar /></el-icon>
            {{ formatDate(video.createdAt) }}
          </el-tag>
          <el-tag size="small" :type="video.isLikedByCurrentUser ? 'danger' : 'info'">
            <el-icon><Star /></el-icon>
            {{ video.likes?.length || 0 }}
          </el-tag>
          <el-tag size="small" type="warning">
            ID: {{ truncateId(video.id) }}
          </el-tag>
        </el-space>

        <el-space fill style="margin-top: auto">
          <el-button
            type="primary"
            @click="openVideoDialog(video)"
            style="flex: 1"
          >
            <el-icon><VideoPlay /></el-icon>
            Просмотр
          </el-button>
          <el-button
            type="danger"
            @click="handleDelete(video.id)"
            :loading="deletingId === video.id"
            style="flex: 1"
          >
            <el-icon><Delete /></el-icon>
            Удалить
          </el-button>
        </el-space>
      </el-space>
    </el-card>
  </el-col>
</el-row>

        <!-- Pagination -->
        <el-pagination
          v-if="filteredVideos.length > pageSize"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 36, 48]"
          :total="filteredVideos.length"
          layout="total, sizes, prev, pager, next"
          background
          class="flex justify-center mt-6"
        />

        <!-- Video Dialog -->
        <el-dialog
          v-model="videoDialogVisible"
          :close-on-click-modal="false"
          destroy-on-close
          
          style="width: fit-content; margin-top: 10px; align-items: center; display: flex;"
          class="video-dialog"
        >
          <template #header>
            <div class="flex items-center space-x-4 p-4">
              <el-avatar
                :size="40"
                :src="selectedVideo?.model.profilePicture"
                @error="errorHandler"
              >
                {{ selectedVideo?.model.username.charAt(0) }}
              </el-avatar>
              <div>
                <h3 style="color: white;" class="font-medium">{{ selectedVideo?.caption || 'Без названия' }}</h3>
                <p  style="color: white;" class="text-sm text-gray-500">{{ selectedVideo?.model.username }}</p>
              </div>
            </div>
          </template>

          <div v-if="selectedVideo" class="space-y-6">
            <div class="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref="videoPlayer"
                controls
                :src="getFullVideoUrl(selectedVideo.videoUrl)"
                @error="handlePlayerError"
                class="w-full h-full object-contain"
                style="height: 500px;"
              ></video>
            </div>

            <el-descriptions :column="1" border>
              <el-descriptions-item label="ID видео">
                {{ selectedVideo.id }}
              </el-descriptions-item>
              <el-descriptions-item label="Модель">
                {{ selectedVideo.model.username }}
              </el-descriptions-item>
              <el-descriptions-item label="ID модели">
                {{ selectedVideo.model.id }}
              </el-descriptions-item>
              <el-descriptions-item label="Дата создания">
                {{ formatDate(selectedVideo.createdAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="Дата обновления">
                {{ formatDate(selectedVideo.updatedAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="Количество лайков">
                {{ selectedVideo.likes?.length || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="Статус лайка">
                <el-tag :type="selectedVideo.isLikedByCurrentUser ? 'success' : 'info'">
                  {{ selectedVideo.isLikedByCurrentUser ? 'Лайкнуто' : 'Не лайкнуто' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="URL видео">
                <el-link
                  type="primary"
                  :href="getFullVideoUrl(selectedVideo.videoUrl)"
                  target="_blank"
                >
                  {{ selectedVideo.videoUrl }}
                </el-link>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>


<script setup>
import { ref, onMounted, computed, nextTick, watch, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { VideoPlay, Calendar, Delete, Search, Star } from '@element-plus/icons-vue'

// Base URL configuration
const API_BASE_URL = 'https://ton-back-e015fa79eb60.herokuapp.com/api'

// Состояние фильтрации и поиска
const searchQuery = ref('')
const sortBy = ref('date-desc')
const filterLiked = ref('')
const dateRange = ref(null)
const currentPage = ref(1)
const pageSize = ref(12)

// Остальные состояния
const videos = ref([])
const selectedVideo = ref(null)
const videoDialogVisible = ref(false)
const loading = ref(true)
const deletingId = ref(null)
const videoPlayer = ref(null)
const videoLoadErrors = ref(new Set())
const loadingVideos = ref(new Set())

// Вычисляемые свойства для фильтрации и статистики
const filteredVideos = computed(() => {
  let result = [...videos.value]

  // Поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(video => 
      (video.caption?.toLowerCase().includes(query) || 
       video.model.username.toLowerCase().includes(query))
    )
  }

  // Фильтр по лайкам
  if (filterLiked.value === 'liked') {
    result = result.filter(video => video.isLikedByCurrentUser)
  } else if (filterLiked.value === 'not-liked') {
    result = result.filter(video => !video.isLikedByCurrentUser)
  }

  // Фильтр по датам
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const startDate = new Date(dateRange.value[0])
    const endDate = new Date(dateRange.value[1])
    result = result.filter(video => {
      const videoDate = new Date(video.createdAt)
      return videoDate >= startDate && videoDate <= endDate
    })
  }

  // Сортировка
  switch (sortBy.value) {
    case 'date-desc':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'date-asc':
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'likes-desc':
      result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      break
    case 'likes-asc':
      result.sort((a, b) => (a.likes?.length || 0) - (b.likes?.length || 0))
      break
    case 'author-asc':
      result.sort((a, b) => a.model.username.localeCompare(b.model.username))
      break
    case 'author-desc':
      result.sort((a, b) => b.model.username.localeCompare(a.model.username))
      break
  }

  return result
})

// Пагинация
const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredVideos.value.slice(start, end)
})

// Статистика
const totalLikes = computed(() => {
  return videos.value.reduce((sum, video) => sum + (video.likes?.length || 0), 0)
})

const uniqueAuthors = computed(() => {
  return new Set(videos.value.map(video => video.model.username)).size
})

// URL видео
const getFullVideoUrl = computed(() => (videoPath) => {
  if (!videoPath) return ''
  if (videoPath.startsWith('http')) return videoPath
  return `https://tonimages.s3.us-east-1.amazonaws.com/${videoPath}`
})

const fetchVideos = async () => {
  try {
    loading.value = true
    const response = await fetch(
      `${API_BASE_URL}/clips/admin`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    )
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()
    videos.value = data
  } catch (error) {
    console.error('Error fetching videos:', error)
    ElMessage.error('Не удалось загрузить видео')
  } finally {
    loading.value = false
  }
}

// Обработчики видео
const openVideoDialog = async (video) => {
  try {
    loadingVideos.value.add(video.id)
    selectedVideo.value = video
    videoDialogVisible.value = true
    
    await nextTick()

    if (videoPlayer.value) {
      videoPlayer.value.load()
      videoPlayer.value.currentTime = 0
      try {
        await videoPlayer.value.play()
      } catch (playError) {
        console.warn('Autoplay failed:', playError)
      }
    }
  } catch (error) {
    console.error('Error opening video:', error)
    ElMessage.error('Не удалось открыть видео')
    videoLoadErrors.value.add(video.id)
  } finally {
    loadingVideos.value.delete(video.id)
  }
}

const handleDelete = async (videoId) => {
  try {
    deletingId.value = videoId
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/clips/${videoId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    ElMessage.success('Видео успешно удалено')
    videos.value = videos.value.filter(v => v.id !== videoId)
    
    if (selectedVideo.value?.id === videoId) {
      videoDialogVisible.value = false
      selectedVideo.value = null
    }
  } catch (error) {
    console.error('Error deleting video:', error)
    ElMessage.error('Не удалось удалить видео')
  } finally {
    deletingId.value = null
  }
}

const handleVideoMetadata = (event, video) => {
  console.log('Video metadata loaded:', video.id)
  loadingVideos.value.delete(video.id)
}

const handleVideoError = (event, video) => {
  console.error('Error loading video:', video.id, event)
  videoLoadErrors.value.add(video.id)
  loadingVideos.value.delete(video.id)
  ElMessage.error({
    message: 'Ошибка загрузки видео',
    duration: 3000
  })
}

const handlePlayerError = (event) => {
  console.error('Error playing video:', event)
  if (selectedVideo.value) {
    videoLoadErrors.value.add(selectedVideo.value.id)
  }
  ElMessage.error({
    message: 'Ошибка воспроизведения видео',
    duration: 3000
  })
}

// Вспомогательные функции
const formatDate = (dateString) => {
  if (!dateString) return 'Неизвестно'
  try {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Неверная дата'
  }
}

const truncateId = (id) => {
  if (!id) return 'N/A'
  return id.substring(0, 8) + '...'
}

const errorHandler = () => {
  return true // Fallback to first letter avatar
}

// Сброс страницы при изменении фильтров
watch([searchQuery, sortBy, filterLiked, dateRange], () => {
  currentPage.value = 1
})

// Очистка
const cleanup = () => {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.currentTime = 0
  }
  selectedVideo.value = null
  videoLoadErrors.value.clear()
  loadingVideos.value.clear()
}

// Отслеживание изменений
watch(videoDialogVisible, (newValue) => {
  if (!newValue) {
    cleanup()
  }
})

// Хуки жизненного цикла
onMounted(() => {
  fetchVideos()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

 
<style scoped>
.filter-section {
  width: 100%;
  height: fit-content;
  display: grid;
  row-gap: 16px;
}
.filter-section :deep(.el-card__body) {
  padding: 20px;
  gap: 10px;

}

.stats-card {
  height: 130px;
  width: 180px;
  margin-bottom: 20px;
  margin-left: 20px;
}

.stats-card :deep(.el-card__header) {
  padding: 12px 16px;
}

.video-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

@media (max-width: 640px) {
  .video-dialog {
    width: 95% !important;
    margin: 0 auto;
  }
  
  .el-pagination {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
}
</style>