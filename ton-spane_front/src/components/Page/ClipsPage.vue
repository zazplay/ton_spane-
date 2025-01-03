<template>
  <div class="clips-container">
    <header class="header">
      <el-button class="back-btn" circle @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
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
 
    <div 
      v-if="isLoading" 
      class="loading-overlay"
    >
      <el-icon 
        class="loading-icon" 
        :size="40"
      >
        <Loading />
      </el-icon>
    </div>
 
    <div class="video-container" :class="`direction-${direction}`">
      <transition
        name="slide"
        mode="out-in"
      >
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
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ArrowLeft, Loading } from '@element-plus/icons-vue'
import ShortVideoPlayer from '@/components/ShortVideoPlayer.vue'

const store = useStore()
const activeTab = ref('foryou')
const isLoading = ref(true)
const videos = ref([])
const currentVideoIndex = ref(0)
const currentVideo = ref(null)
const preloadVideos = ref([])
const userId = computed(() => store.getters.getSub)
const direction = ref('next') // добавляем направление


const fetchVideos = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/clips/requester/${userId.value}?tab=${activeTab.value}`)
    const data = await response.json()
    
    videos.value = data
    if (videos.value.length > 0) {
      currentVideo.value = videos.value[0]
      
      // Preload next few videos
      preloadVideos.value = videos.value.slice(1, 4)
    }
  } catch (error) {
    console.error('Error fetching videos:', error)
    // Fallback handling
    preloadVideos.value = []
    currentVideo.value = null
  } finally {
    await nextTick()
    isLoading.value = false
  }
}

const switchTab = async (tab) => {
  if (activeTab.value !== tab) {
    activeTab.value = tab
    await fetchVideos()
  }
}


const handlePrev = () => {
  if (currentVideoIndex.value > 0) {
    direction.value = 'prev'
    currentVideoIndex.value--
    currentVideo.value = videos.value[currentVideoIndex.value]
    
    // Update preload videos
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
    
    // Update preload videos
    preloadVideos.value = videos.value.slice(
      currentVideoIndex.value + 1, 
      currentVideoIndex.value + 4
    )
  }
}

const handleLike = (isLiked) => {
  console.log('Video liked:', isLiked)
  // Potential future implementation of like logic
}

const handleShare = () => {
  console.log('Share clicked')
  // Potential future implementation of share logic
}

onMounted(fetchVideos)

watch(activeTab, fetchVideos)
</script>

<style scoped>
.clips-container {
  min-height: 100vh;
  background-color: #000;
  position: relative;
  overflow: hidden;
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

/* Общие стили для анимации */
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

.video-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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



.preload-videos {
  display: none;
}
</style>