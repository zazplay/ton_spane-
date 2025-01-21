<template>
    <div class="popular-page">
=      <div class="animated-background">
        <div class="gradient-sphere"></div>
        <div class="gradient-sphere sphere-2"></div>
        <div class="floating-particles"></div>
      </div>
  
      <header class="popular-header">
        <div class="glowing-border">
          <h1 class="gradient-text">Топ-10 постов</h1>
          <div class="stats-badge">
            <span class="fire-icon">🔥</span>
            <span class="badge-text">Самые горячие посты</span>
          </div>
        </div>
      </header>
  
      <div v-if="!isDataLoaded" class="loading">
        <div class="loading-pulse"></div>
        <span class="loading-text">Загружаем лучшие посты...</span>
      </div>
  
      <div v-else-if="sortedPosts.length === 0" class="empty-state">
        <div class="empty-content">
          <div class="empty-icon">✨</div>
          <h3>Здесь пока пусто</h3>
          <p>Скоро появятся новые публикации</p>
        </div>
      </div>
  
      <div v-else class="posts-container">
        <ListPostCards :posts="sortedPosts" />
      </div>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import { ref, computed } from 'vue'
  import { useStore } from 'vuex'
  import ListPostCards from '../ListPostCards.vue'
  import config from '../../config'
  
  export default {
    name: 'PopularTapes',
    
    components: {
      ListPostCards
    },
  
    setup() {
      const posts = ref([])
      const isDataLoaded = ref(false)
      const store = useStore()
  
      const sortedPosts = computed(() => {
        return posts.value
          .sort((a, b) => b.likesCount - a.likesCount)
          .slice(0, 10)
      })
  
      const fetchPosts = async () => {
        try {
          isDataLoaded.value = false
          const userId = store.getters.getSub
  
          if (!userId) {
            throw new Error('User ID not found')
          }
  
          const response = await fetch(`${config.API_BASE_URL}/posts/requester/${userId}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          posts.value = data
          
          setTimeout(() => {
            isDataLoaded.value = true
          }, 1000)
        } catch (error) {
          console.error('Error fetching posts:', error)
          isDataLoaded.value = true
          posts.value = []
        }
      }
  
      fetchPosts()
  
      return {
        sortedPosts,
        isDataLoaded
      }
    }
  }
  </script>
  
  <style scoped>
  .popular-page {
    min-height: 100vh;
    position: relative;
    padding: 40px 20px;
    overflow: hidden;
    margin-top: -10px;
  }
  
  /* Анимированный фон */
  .animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  border-radius: 10px !important;
  transition: background 0.3s ease;
}

/* Dark theme styles */
html.dark .animated-background {
  background: linear-gradient(to bottom, #161b22, #0d1117);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Light theme styles */
html:not(.dark) .animated-background {
  background: linear-gradient(to bottom, #f0f2f5, #ffffff);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* Optional: Add some animated effects */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

html.dark .animated-background {
  background: linear-gradient(135deg, #0d1117, #161b22, #1e2228);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

html:not(.dark) .animated-background {
  background: linear-gradient(135deg, #f0f2f5, #ffffff, #e6e8eb);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}
  
  .gradient-sphere {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle at center, 
      rgba(123, 31, 162, 0.15),
      rgba(103, 58, 183, 0.1),
      rgba(244, 143, 177, 0.05)
    );
    filter: blur(60px);
    animation: sphereFloat 20s infinite alternate ease-in-out;
  }
  
  .sphere-2 {
    right: -200px;
    top: 30%;
    background: radial-gradient(circle at center, 
      rgba(32, 156, 238, 0.15),
      rgba(90, 103, 216, 0.1),
      rgba(136, 14, 79, 0.05)
    );
    animation: sphereFloat2 25s infinite alternate ease-in-out;
  }
  
  .floating-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 2px),
      radial-gradient(circle at 80% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 2px),
      radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 2px),
      radial-gradient(circle at 60% 10%, rgba(255, 255, 255, 0.05) 0%, transparent 2px);
    background-size: 300px 300px;
    animation: particlesFloat 30s infinite linear;
  }
  
  /* Popular Header Styles */
.popular-header {
  text-align: center;
  margin-bottom: 48px;
  position: relative;
}

.glowing-border {
  display: inline-block;
  padding: 24px 48px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

/* Light Theme Styles */
html:not(.dark) .glowing-border {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

/* Dark Theme Styles */
html.dark .glowing-border {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.gradient-text {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #FF79C6, #BD93F9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textShine 3s infinite alternate;
}

/* Light Theme Gradient Text */
html:not(.dark) .gradient-text {
  color: #1f2937;
}

/* Dark Theme Gradient Text */
html.dark .gradient-text {
  color: #e6edf3;
}

.stats-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 16px;
  transition: all 0.3s ease;
}

/* Light Theme Stats Badge */
html:not(.dark) .stats-badge {
  background: rgba(255, 79, 198, 0.1);
  color: #FF79C6;
  border: 1px solid rgba(255, 79, 198, 0.2);
}

/* Dark Theme Stats Badge */
html.dark .stats-badge {
  background: rgba(255, 79, 198, 0.2);
  color: #FF79C6;
  border: 1px solid rgba(255, 79, 198, 0.3);
}

.fire-icon {
  font-size: 20px;
  animation: fireFlicker 0.8s infinite alternate;
}

/* Animations */
@keyframes borderGlow {
  0% {
    box-shadow: 
      0 4px 24px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  100% {
    box-shadow: 
      0 4px 32px rgba(0, 0, 0, 0.2),
      inset 0 0 0 2px rgba(255, 255, 255, 0.2);
  }
}

@keyframes textShine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes fireFlicker {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .gradient-text {
    font-size: 32px;
  }

  .glowing-border {
    padding: 16px 32px;
  }

  .stats-badge {
    font-size: 14px;
    padding: 6px 12px;
  }
}
  
  /* Состояние загрузки */
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 48px 0;
  }
  
  .loading-pulse {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF79C6, #BD93F9);
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  .loading-text {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.8);
    animation: textPulse 1.5s infinite alternate;
  }
  
  /* Пустое состояние */
  .empty-state {
    text-align: center;
    padding: 64px 20px;
  }
  
  .empty-content {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 32px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 
      0 4px 24px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    animation: starTwinkle 1.5s infinite alternate;
  }
  
  /* Контейнер постов */
  .posts-container {
    max-width: 1200px;
    margin: 0 auto;
    animation: fadeIn 0.8s ease-out;
  }
  
  /* Анимации */
  @keyframes sphereFloat {
    0% { transform: translate(-30%, -20%); }
    100% { transform: translate(-20%, -30%); }
  }
  
  @keyframes sphereFloat2 {
    0% { transform: translate(20%, 30%); }
    100% { transform: translate(30%, 20%); }
  }
  
  @keyframes particlesFloat {
    0% { background-position: 0 0; }
    100% { background-position: 300px 300px; }
  }
  
  @keyframes borderGlow {
    0% { box-shadow: 0 4px 24px rgba(189, 147, 249, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1); }
    100% { box-shadow: 0 4px 24px rgba(255, 121, 198, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1); }
  }
  
  @keyframes textShine {
    0% { filter: brightness(1); }
    100% { filter: brightness(1.2); }
  }
  
  @keyframes fireFlicker {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.1); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(0.95); opacity: 0.5; }
  }
  
  @keyframes textPulse {
    0% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  @keyframes starTwinkle {
    0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
    100% { transform: scale(1.1) rotate(15deg); opacity: 1; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Адаптивность */
  @media (max-width: 768px) {
    .gradient-text {
      font-size: 32px;
    }
  
    .glowing-border {
      padding: 16px 32px;
    }
  
    .gradient-sphere {
      width: 400px;
      height: 400px;
    }
  }
  
  @media (max-width: 480px) {
    .gradient-text {
      font-size: 24px;
    }
  
    .stats-badge {
      font-size: 14px;
    }
  
    .popular-page {
      padding: 20px 12px;
    }
  }
  </style>