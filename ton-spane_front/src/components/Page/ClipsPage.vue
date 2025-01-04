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
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
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
</el-dialog >

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
        />
      </transition>
    </div>

    <div class="preload-videos">
      <video 
        v-for="video in preloadVideos" 
        :key="video.id"
        :src="video.videoUrl" 
        preload="metadata"
        style="display:none"
      ></video>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { ElButton, ElIcon,ElMessage } from 'element-plus'
import { ArrowLeft, Loading, CirclePlus } from '@element-plus/icons-vue'
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

const formData = ref({
  caption: '',
  videoFile: null
})


const handleFileChange = (file) => {
  if (file && file.raw.type.startsWith('video/')) {
    formData.value.videoFile = file.raw
  } else {
    ElMessage.error('Please select a valid video file')
    formData.value.videoFile = null
  }
}

const handleUpload = async () => {
  if (!formData.value.videoFile) {
    ElMessage.warning('Please select a video file')
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
      body: uploadData
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    ElMessage.success('Video uploaded successfully!')
    dialogVisible.value = false
    formData.value = {
      caption: '',
      videoFile: null
    }
    
    // Перезагружаем видео после успешной загрузки
    await fetchVideos()

  } catch (error) {
    console.error('Upload error:', error)
    ElMessage.error('Failed to upload video. Please try again.')
  } finally {
    uploading.value = false
  }
}

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
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    videos.value = data
    
    if (videos.value.length > 0) {
      currentVideo.value = videos.value[0]
      preloadVideos.value = videos.value.slice(1, 4)
    }
  } catch (error) {
    console.error('Error fetching videos:', error)
    videos.value = []
    currentVideo.value = null
    preloadVideos.value = []
  } finally {
    isLoading.value = false
  }
}

const switchTab = async (tab) => {
  if (activeTab.value !== tab) {
    activeTab.value = tab
    currentVideoIndex.value = 0
    await fetchVideos()
  }
}

const handlePrev = () => {
  if (currentVideoIndex.value > 0) {
    direction.value = 'prev'
    currentVideoIndex.value--
    currentVideo.value = videos.value[currentVideoIndex.value]
    
    preloadVideos.value = [
      ...(videos.value[currentVideoIndex.value - 1] ? [videos.value[currentVideoIndex.value - 1]] : []),
      ...videos.value.slice(currentVideoIndex.value + 1, currentVideoIndex.value + 4)
    ]
  }
}

const handleNext = () => {
  if (currentVideoIndex.value < videos.value.length - 1) {
    direction.value = 'next'
    currentVideoIndex.value++
    currentVideo.value = videos.value[currentVideoIndex.value]
    
    preloadVideos.value = videos.value.slice(
      currentVideoIndex.value + 1, 
      currentVideoIndex.value + 4
    )
  }
}

const handleLike = (isLiked) => {
  console.log('Video liked:', isLiked)
}

const handleShare = () => {
  console.log('Share clicked')
}

onMounted(fetchVideos)
watch(activeTab, fetchVideos)
</script>

<style scoped>
/* Основные стили */
.clips-container {
  max-height: 100vh;
  position: relative;
  overflow: hidden;
  margin-top: -8px;
  margin-bottom: -100px;
}

/* Светлая тема */
html:not(.dark) .clips-container {
  background-color: #7c758615; /* светло-фиолетовый */
}

/* Темная тема */
html.dark .clips-container {
  background-color: #000000; /* черный */
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