<template>
  <div class="clips-container">
    <header class="header">
      <el-button class="back-btn" circle @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      
      <el-button 
        v-if="userType === 'model'"
        class="addVideo-btn" 
        circle 
        @click="dialogVisible = true"
      >
        <el-icon :size="30">
          <CirclePlus />
        </el-icon>
      </el-button>

      <el-dialog
        v-model="dialogVisible"
        title="Загрузить клип"
        width="80%"
        :close-on-click-modal="false"
        :close-on-press-escape="!uploading"
        style="margin-top: 10px;"
      >
        <el-form 
          ref="uploadForm" 
          :model="formData"
          label-position="top"
          @submit.prevent="handleUpload"
        >
          <el-form-item label="Видео файл">
            <el-upload
              class="upload-demo"
              drag
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              :limit="1"
              accept="video/*"
              :disabled="uploading"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                Переместите видео сюда<em> Нажмите что бы загрузить</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  Пожалуйста загрузите видео-файл
                </div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="Описание">
            <el-input
              v-model="formData.caption"
              type="textarea"
              :rows="2"
              placeholder="Добавьте описание вашему видео..."
              :disabled="uploading"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button 
              @click="dialogVisible = false" 
              :disabled="uploading"
            >Отмена</el-button>
            <el-button 
              type="primary" 
              @click="handleUpload"
              :loading="uploading"
              :disabled="!formData.videoFile"
            >
              {{ uploading ? 'Загрузка...' : 'Загрузить' }}
            </el-button>
          </span>
        </template>
      </el-dialog>

      <div class="header-tabs">
        <span 
          class="tab" 
          :class="{ active: activeTab === 'following' }" 
          @click="switchTab('following')"
        >
          Подписки
        </span>
        <span 
          class="tab" 
          :class="{ active: activeTab === 'foryou' }" 
          @click="switchTab('foryou')"
        >
          Для вас
        </span>
      </div>
    </header>

    <div v-if="isLoading" class="loading-overlay">
      <el-icon class="loading-icon" :size="40">
        <Loading />
      </el-icon>
    </div>

    <div class="video-container" :class="`direction-${direction}`">
      <transition name="slide" mode="out-in">
        <ShortVideoPlayer
          v-if="!isLoading && currentVideo"
          :key="currentVideo.id"
          :video="currentVideo"
          @prev="handlePrev"
          @next="handleNext"
          @like="handleLike"
          @share="handleShare"
          @error="handleVideoError"
          @loaded="handleVideoLoaded"
        />
      </transition>
    </div>

    <div class="preload-videos">
      <video 
        v-for="video in preloadVideos" 
        :key="video.id"
        :src="video.videoUrl" 
        preload="metadata"
        style="display: none;"
        @error="(e) => handlePreloadError(e, video)"
      ></video>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { ElButton, ElIcon, ElMessage } from 'element-plus'
import { ArrowLeft, Loading, CirclePlus, UploadFilled } from '@element-plus/icons-vue'
import ShortVideoPlayer from '@/components/ShortVideoPlayer.vue'

const store = useStore()
const activeTab = ref('foryou')
const isLoading = ref(true)
const videos = ref([])
const currentVideoIndex = ref(0)
const currentVideo = ref(null)
const preloadVideos = ref([])
const userId = computed(() => store.getters.getSub)
const direction = ref('next')
const dialogVisible = ref(false)
const uploading = ref(false)
const userType = sessionStorage.getItem('userType')
const videoBlobs = ref({})
const loadedVideos = ref(new Set())

// Форма загрузки
const formData = ref({
  caption: '',
  videoFile: null
})

// Очередь загрузки для видео
const loadingQueue = ref([])
const isProcessingQueue = ref(false)

// Обработка очереди загрузки
const processLoadingQueue = async () => {
  if (isProcessingQueue.value || loadingQueue.value.length === 0) return
  
  isProcessingQueue.value = true
  
  while (loadingQueue.value.length > 0) {
    const video = loadingQueue.value[0]
    
    if (!videoBlobs.value[video.id]) {
      try {
        videoBlobs.value[video.id] = await createBlobUrl(video.videoUrl)
        video.videoUrl = videoBlobs.value[video.id]
      } catch (error) {
        console.error('Error loading video:', error)
      }
    }
    
    loadingQueue.value.shift()
    await new Promise(resolve => setTimeout(resolve, 100)) // Предотвращение перегрузки браузера
  }
  
  isProcessingQueue.value = false
}

// Оптимизированное создание blob с таймаутом и повторными попытками
const createBlobUrl = async (url, retries = 2) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 секунд таймаут

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Range': 'bytes=0-', // Поддержка частичного контента
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) throw new Error('Network response was not ok')
    
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (retries > 0 && error.name !== 'AbortError') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return createBlobUrl(url, retries - 1)
    }
    
    console.error('Error creating blob URL:', error)
    return url
  }
}

// Обработчик изменения файла
const handleFileChange = (file) => {
  if (file && file.raw.type.startsWith('video/')) {
    formData.value.videoFile = file.raw
  } else {
    ElMessage.error('Пожалуйста, выберите видео файл')
    formData.value.videoFile = null
  }
}

// Обработчик загрузки файла
const handleUpload = async () => {
  if (!formData.value.videoFile) {
    ElMessage.warning('Пожалуйста, выберите видео файл')
    return
  }

  uploading.value = true

  try {
    const uploadData = new FormData()
    uploadData.append('video', formData.value.videoFile)
    uploadData.append('caption', formData.value.caption)
    uploadData.append('modelId', userId.value)

    const response = await fetch('https://ton-back-e015fa79eb60.herokuapp.com/api/clips', {
      method: 'POST',
      body: uploadData,
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Ошибка загрузки')
    }

    ElMessage.success('Видео успешно загружено!')
    dialogVisible.value = false
    formData.value = {
      caption: '',
      videoFile: null
    }
    
    await fetchVideos()

  } catch (error) {
    console.error('Ошибка загрузки:', error)
    ElMessage.error('Не удалось загрузить видео. Пожалуйста, попробуйте снова.')
  } finally {
    uploading.value = false
  }
}

// Оптимизированная загрузка видео
const fetchVideos = async () => {
  try {
    isLoading.value = true
    
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/clips/requester/${userId.value}?tab=${activeTab.value}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    )
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()
    
    // Очистка существующей очереди загрузки
    loadingQueue.value = []
    
    // Обработка только первых 2 видео немедленно
    const initialVideos = await Promise.all(
      data.slice(0, 2).map(async (video) => {
        if (!videoBlobs.value[video.id]) {
          try {
            videoBlobs.value[video.id] = await createBlobUrl(video.videoUrl)
          } catch (error) {
            console.error('Error creating blob for initial video:', error)
            return video
          }
        }
        return {
          ...video,
          videoUrl: videoBlobs.value[video.id]
        }
      })
    )
    
    // Добавление оставшихся видео в очередь загрузки
    loadingQueue.value = data.slice(2)
    
    videos.value = [
      ...initialVideos,
      ...data.slice(2).map(video => ({
        ...video,
        videoUrl: video.videoUrl
      }))
    ]
    
    if (videos.value.length > 0) {
      currentVideo.value = videos.value[0]
      preloadVideos.value = videos.value.slice(1, 3) // Уменьшено до 2 предзагружаемых видео
    }
    
    // Запуск обработки очереди
    processLoadingQueue()
    
  } catch (error) {
    console.error('Error fetching videos:', error)
    ElMessage.error('Не удалось загрузить видео. Пожалуйста, попробуйте позже.')
  } finally {
    isLoading.value = false
  }
}

// Оптимизированная навигация по видео
const handleNext = async () => {
  if (currentVideoIndex.value < videos.value.length - 1) {
    direction.value = 'next'
    const nextIndex = currentVideoIndex.value + 1
    
    const nextVideo = videos.value[nextIndex]
    if (nextVideo && !videoBlobs.value[nextVideo.id]) {
      try {
        videoBlobs.value[nextVideo.id] = await createBlobUrl(nextVideo.videoUrl)
        nextVideo.videoUrl = videoBlobs.value[nextVideo.id]
      } catch (error) {
        console.error('Error loading next video:', error)
      }
    }
    
    currentVideoIndex.value = nextIndex
    currentVideo.value = nextVideo
    
    // Предзагрузка следующих видео
    const nextPreloadVideos = videos.value.slice(nextIndex + 1, nextIndex + 3)
    preloadVideos.value = nextPreloadVideos
    
    // Добавление в очередь загрузки, если ещё не загружено
    nextPreloadVideos.forEach(video => {
      if (!videoBlobs.value[video.id] && !loadingQueue.value.includes(video)) {
        loadingQueue.value.push(video)
      }
    })
    
    processLoadingQueue()
  }
}

const handlePrev = async () => {
  if (currentVideoIndex.value > 0) {
    direction.value = 'prev'
    const prevIndex = currentVideoIndex.value - 1
    
    const prevVideo = videos.value[prevIndex]
    if (prevVideo && !videoBlobs.value[prevVideo.id]) {
      try {
        videoBlobs.value[prevVideo.id] = await createBlobUrl(prevVideo.videoUrl)
        prevVideo.videoUrl = videoBlobs.value[prevVideo.id]
      } catch (error) {
        console.error('Error loading previous video:', error)
      }
    }
    
    currentVideoIndex.value = prevIndex
    currentVideo.value = prevVideo
    
    // Обновление предзагрузки
    preloadVideos.value = [
      ...(videos.value[prevIndex - 1] ? [videos.value[prevIndex - 1]] : []),
      ...videos.value.slice(prevIndex + 1, prevIndex + 3)
    ]
  }
}

const handleVideoError = async (error, videoId) => {
  console.warn('Video error:', error)
  
  if (videoId && videoBlobs.value[videoId]) {
    try {
      const video = videos.value.find(v => v.id === videoId)
      if (video) {
        URL.revokeObjectURL(videoBlobs.value[videoId])
        videoBlobs.value[videoId] = await createBlobUrl(video.videoUrl)
        video.videoUrl = videoBlobs.value[videoId]
      }
    } catch (error) {
      console.error('Error recreating blob:', error)
      ElMessage.error('Ошибка загрузки видео')
    }
  }
}

const handleVideoLoaded = (videoId) => {
  if (videoId) {
    loadedVideos.value.add(videoId)
  }
}

const handlePreloadError = async (error, video) => {
  console.warn('Preload error for video:', video.id, error)
  if (video && !videoBlobs.value[video.id]) {
    try {
      videoBlobs.value[video.id] = await createBlobUrl(video.videoUrl)
      video.videoUrl = videoBlobs.value[video.id]
    } catch (err) {
      console.error('Error creating blob for preload retry:', err)
    }
  }
}

const handleLike = (isLiked) => {
  console.log('Video liked:', isLiked)
}

const handleShare = () => {
  console.log('Share clicked')
}

const switchTab = async (tab) => {
  if (activeTab.value !== tab) {
    activeTab.value = tab
    currentVideoIndex.value = 0
    cleanup()
    await fetchVideos()
  }
}

// Функция очистки
const cleanup = () => {
  Object.values(videoBlobs.value).forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
  
  videoBlobs.value = {}
  loadedVideos.value.clear()
  loadingQueue.value = []
}

onMounted(() => {
  fetchVideos()
  
  // Добавление слушателя видимости страницы
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Пауза загрузки когда вкладка не активна
      isProcessingQueue.value = false
    } else {
      // Возобновление загрузки когда вкладка становится видимой
      processLoadingQueue()
    }
  })
})

onUnmounted(() => {
  cleanup()
  document.removeEventListener('visibilitychange', () => {})
})

watch(activeTab, fetchVideos)
</script>

<style scoped>
.clips-container {
  max-height: 100vh;
  background-color: #000;
  position: relative;
  overflow: hidden;
  margin-top: -10px;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
  max-width: 550px;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.direction-prev .slide-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.direction-prev .slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
  margin-top: -8px;

}

.header-tabs {
  display: flex;
  gap: 2rem;
  color: white;
  justify-content: center;
  margin-right: 40px;
}

.tab {
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s;
  position: relative;
  user-select: none;
}

.tab.active {
  opacity: 1;
  font-weight: 600;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
  border-radius: 2px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.loading-icon {
  animation: rotate 1s linear infinite;
  color: white;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.back-btn {
  --el-button-bg-color: rgba(255, 255, 255, 0.2);
  --el-button-hover-bg-color: rgba(255, 255, 255, 0.3);
  --el-button-text-color: #fff;
  --el-button-border-color: transparent;
  --el-button-hover-border-color: transparent;
  backdrop-filter: blur(8px);
}

.addVideo-btn {
  height: 40px;
  width: 40px;
  position: absolute;
  right: 0;
  margin-right: 20px;
  margin-top: 15px;
  --el-button-bg-color: rgba(255, 255, 255, 0.2);
  --el-button-hover-bg-color: rgba(255, 255, 255, 0.3);
  --el-button-text-color: #fff;
  --el-button-border-color: transparent;
  --el-button-hover-border-color: transparent;
  backdrop-filter: blur(8px);
}

.preload-videos {
  display: none;
}

dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;

  
}

.upload-demo{
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
}

:deep(.el-dialog) {
  border-radius: 8px;
}

</style>