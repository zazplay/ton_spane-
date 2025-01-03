<template>
  <div class="video-player">
    <div class="user-info">
      <el-avatar 
        :size="40"
        :src="videoData.model.profilePicture" 
        :icon="UserFilled"
        class="avatar"
      />
      <div class="user-details">
        <h3 class="username">@{{ videoData.model.username }}</h3>
        <p class="description">{{ videoData.caption }}</p>
      </div>
    </div>

    <div class="video-container">
      <transition name="slide">
        <video
          ref="videoRef"
          :key="videoData.id"
          class="video-content"
          :src="videoData.videoUrl"
          @click="togglePlay"
          @loadedmetadata="onVideoLoaded"
          @error="handleVideoError"
          loop
          playsinline
          muted 
          autoplay
          preload="metadata"
          type="video/mp4"
          crossorigin="anonymous"
        >
          <source :src="videoData.videoUrl" type="video/mp4">
          Ваш браузер не поддерживает видео
        </video>
      </transition>
    </div>

    <div class="controls-overlay">
      <div class="controls-container">
        <div class="left-controls">
          <el-button
            :icon="isPlaying ? 'VideoPause' : 'VideoPlay'"
            @click="togglePlay"
            circle
            class="large-icon"
          />
          <el-button 
            @click="toggleMute"
            circle
          >
            <svg v-if="!isMuted" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" 
                fill="white"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" 
                fill="white"/>
            </svg>
          </el-button>
        </div>
        <div class="right-controls">
          <el-button
            @click="toggleLike"
            circle
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                :fill="videoData.isLikedByCurrentUser ? '#ff4757' : 'white'" />
            </svg>
          </el-button>
          <el-button
            @click="handleShare"
            circle
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
                fill="white" />
            </svg>
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="navigation-controls">
      <el-button circle @click="handlePrev" style="margin-left: 10px;">
        <el-icon><ArrowUpBold /></el-icon>
      </el-button>
      <el-button circle @click="handleNext">
        <el-icon><ArrowDownBold /></el-icon>
      </el-button>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */ 
import { ref, computed, watch } from 'vue'
import { ArrowUpBold, ArrowDownBold, UserFilled } from '@element-plus/icons-vue'
import { useStore } from 'vuex'

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['prev', 'next', 'like', 'share'])

const store = useStore()
const userId = computed(() => store.getters.getSub)

// Create a reactive copy of the video prop to avoid direct mutation
const videoData = ref({ ...props.video })

const videoRef = ref(null)
const isPlaying = ref(true)
const isMuted = ref(false)

// Watch for changes in the original prop and update videoData
watch(() => props.video, (newVideo) => {
  videoData.value = { ...newVideo }
  isPlaying.value = false
  isMuted.value = true
})

const togglePlay = () => {
  if (videoRef.value) {
    if (isPlaying.value) {
      videoRef.value.pause()
    } else {
      videoRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

const toggleMute = () => {
  if (videoRef.value) {
    videoRef.value.muted = !isMuted.value
    isMuted.value = !isMuted.value
  }
}

const onVideoLoaded = () => {
  if (videoRef.value) {
    videoRef.value.muted = isMuted.value
    videoRef.value.play().catch(error => {
      console.log('Автоматическое воспроизведение не удалось:', error)
    })
  }
}

const handleVideoError = (error) => {
  console.error('Ошибка при загрузке видео:', error)
  emit('next')  // Автоматический переход к следующему видео при ошибке
}

const toggleLike = async () => {
  try {
    const isCurrentlyLiked = videoData.value.isLikedByCurrentUser
    const response = await fetch(
      isCurrentlyLiked 
        ? `https://ton-back-e015fa79eb60.herokuapp.com/api/clips/likes/${userId.value}/unlike/${videoData.value.id}`
        : `https://ton-back-e015fa79eb60.herokuapp.com/api/clips/likes/${userId.value}/like/${videoData.value.id}`, 
      { method: isCurrentlyLiked ? 'DELETE' : 'POST' }
    )
    
    if (response.ok) {
      videoData.value.isLikedByCurrentUser = !isCurrentlyLiked
      emit('like', videoData.value.isLikedByCurrentUser)
    }
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

const handleShare = () => {
  emit('share')
}

const handlePrev = () => {
  emit('prev')
}

const handleNext = () => {
  emit('next')
}
</script>


<style scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 98vh;
  max-width: 550px;
  margin: 0 auto;
  background: #000;
  overflow: hidden;
  border-radius: 10px;
}

.user-info {
  position: absolute;
  bottom: 100px;
  left: 0;
  padding: 1rem;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.avatar {
  border: 2px solid white;
}

.user-details {
  flex: 1;
}

.username {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.description {
  margin: 4px 0 0;
  font-size: 14px;
  opacity: 0.9;
}

.video-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.controls-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}

.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-controls,
.right-controls {
  display: flex;
  gap: 0.5rem;
}

.navigation-controls {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

:deep(.el-button) {
  --el-button-bg-color: rgba(255, 255, 255, 0.2);
  --el-button-hover-bg-color: rgba(255, 255, 255, 0.3);
  --el-button-text-color: #fff;
  --el-button-border-color: transparent;
  --el-button-hover-border-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
}

:deep(.el-button i) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0;
}

.large-icon :deep(.el-icon) {
  transform: scale(2.5);
}

.navigation-controls .el-button {
  transition: transform 0.3s ease;
}

.navigation-controls .el-button:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.3);
}

.navigation-controls .el-button:active {
  transform: scale(0.9);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease-in-out;
  position: absolute;
  width: 100%;
  height: 100%;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-100%) ;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>