<template>
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-col 
            v-for="video in videos" 
            :key="video.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <el-card shadow="hover" class="video-card">
              <template #default>
                <div class="video-preview">
                  <video
                    class="preview-video"
                    :src="video.videoUrl"
                    preload="metadata"
                    @loadedmetadata="handleVideoMetadata($event, video)"
                    @error="handleVideoError($event, video)"
                  ></video>
                </div>
  
                <el-space direction="vertical" alignment="stretch" :size="14">
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
                      <el-text truncated>{{ video.caption || 'Без названия' }}</el-text>
                      <el-text type="info" size="small">{{ video.model.username }}</el-text>
                    </el-col>
                  </el-row>
  
                  <el-row :gutter="10">
                    <el-col :span="24">
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
                    </el-col>
                  </el-row>
  
                  <el-row>
                    <el-col :span="24">
                      <el-space fill>
                        <el-button 
                          type="primary" 
                          @click="openVideoDialog(video)"
                        >
                          <el-icon><VideoPlay /></el-icon>
                          Просмотр
                        </el-button>
                        <el-button 
                          type="danger"
                          @click="handleDelete(video.id)"
                          :loading="deletingId === video.id"
                        >
                          <el-icon><Delete /></el-icon>
                          Удалить
                        </el-button>
                      </el-space>
                    </el-col>
                  </el-row>
                </el-space>
              </template>
            </el-card>
          </el-col>
        </el-row>
  
        <el-dialog
          v-model="videoDialogVisible"
          style="width: fit-content; margin-top: 0px;"
          :close-on-click-modal="false"
          destroy-on-close
          class="video-dialog"
        >
          <template #header>
            <el-row align="middle" justify="space-between" class="dialog-header">
              <el-col :span="20">
                <el-space alignment="flex-start" :size="14" class="dialog-author-info">
                  <el-avatar 
                    :size="40" 
                    :src="selectedVideo?.model.profilePicture"
                    @error="errorHandler"
                  >
                    {{ selectedVideo?.model.username.charAt(0) }}
                  </el-avatar>
                  <el-space direction="vertical" :size="4">
                    <el-text>{{ selectedVideo?.caption || 'Без названия' }}</el-text>
                    <el-text type="info" size="small">{{ selectedVideo?.model.username }}</el-text>
                  </el-space>
                </el-space>
              </el-col>
              <el-col :span="4" style="text-align: right">
                
              </el-col>
            </el-row>
          </template>
  
          <el-space v-if="selectedVideo" direction="vertical" :size="20" fill>
            <div class="video-player-container">
              <video
                ref="videoPlayer"
                controls
                :src="selectedVideo.videoUrl"
                @error="handlePlayerError"
                class="video-player"
              ></video>
            </div>
            
            <el-descriptions :column="2" border>
              <el-descriptions-item label="ID видео" :span="2">
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
              <el-descriptions-item label="URL видео" :span="2">
                <el-link type="primary" :href="selectedVideo.videoUrl" target="_blank">
                  {{ selectedVideo.videoUrl }}
                </el-link>
              </el-descriptions-item>
            </el-descriptions>
          </el-space>
        </el-dialog>
      </el-main>
    </el-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { VideoPlay, Calendar, Star, Delete } from '@element-plus/icons-vue'
  
  // Состояние
  const videos = ref([])
  const selectedVideo = ref(null)
  const videoDialogVisible = ref(false)
  const loading = ref(true)
  const deletingId = ref(null)
  const videoPlayer = ref(null)
  
  // Загрузка видео
  const fetchVideos = async () => {
    try {
      loading.value = true
      const response = await fetch(
        'https://ton-back-e015fa79eb60.herokuapp.com/api/clips/requester/f57478e4-4dce-48b2-b2f4-e54b98682ebe',
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
  const openVideoDialog = (video) => {
    selectedVideo.value = video
    videoDialogVisible.value = true
    // Небольшая задержка для уверенности, что видео элемент создан
    setTimeout(() => {
      if (videoPlayer.value) {
        videoPlayer.value.currentTime = 0 // Сброс времени воспроизведения
        videoPlayer.value.play()
      }
    }, 100)
  }
  

  
  const handleVideoMetadata = (event, video) => {
    // Можно добавить дополнительную логику при загрузке метаданных
    console.log('Video metadata loaded:', video.id)
  }
  
  const handleVideoError = (event, video) => {
    console.error('Error loading video:', video.id)
    ElMessage.error('Ошибка загрузки видео')
  }
  
  const handlePlayerError = (event) => {
    console.error('Error playing video:', event)
    ElMessage.error('Ошибка воспроизведения видео')
  }
  
  // Вспомогательные функции
  const formatDate = (dateString) => {
    if (!dateString) return 'Неизвестно'
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const truncateId = (id) => {
    return id.substring(0, 8) + '...'
  }
  
  const errorHandler = () => {
    return true // Fallback to first letter avatar
  }
  
  // Инициализация
  onMounted(() => {
    fetchVideos()
  })
  </script>
  
  <style scoped>
  .video-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .video-preview {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  
  .preview-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .video-dialog {
    max-width: 600px !important;
    display: flex;
    flex-direction: column;
  }
  
  .video-player-container {
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .video-player {
    width: fit-content;
    max-height: 70vh;
    background: #000;
  }
  
  .dialog-header {
    padding: 16px;
  }
  
  /* Медиа-запросы для адаптивности */
  @media (max-width: 768px) {
    .video-preview {
      height: 180px;
    }
  
    .video-player {
      max-height: 50vh;
    }
  }
  </style>