<script lang="js" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ListPostCards from '../../ListPostCards.vue'
import { ElLoading } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userId = route.params.id || 'f26088fd-d4aa-4420-a7f6-1f89baa915c3'

// Constants
const S3_BASE_URL = 'https://tonimages.s3.us-east-1.amazonaws.com/'
const DEFAULT_HEADER = 'https://placehold.co/600x200'
const DEFAULT_AVATAR = 'https://placehold.co/150'

// Reactive state
const userData = ref({
  id: userId,
  username: 'Loading...',
  email: '',
  profilePicture: DEFAULT_AVATAR,
  profileHeader: DEFAULT_HEADER,
  posts: [],
  likes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})
const loading = ref(true)
const error = ref(null)
const activeNames = ref(['1'])

// Format image URL
const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  return imageUrl.startsWith('http') ? imageUrl : `${S3_BASE_URL}${imageUrl}`
}

// Prepare posts data
const preparePostsData = (posts) => {
  return posts.map(post => ({
    ...post,
    id: post.id,
    userId: userId,
    imageUrl: formatImageUrl(post.imageUrl),
    price: String(post.price),
    isBlurred: post.isBlurred || false,
    caption: post.caption || ''
  }))
}

// Fetch user data
const fetchUserData = async () => {
  try {
    loading.value = true
    console.log('Fetching user with ID:', userId)
    
    const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/users/${userId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log('Received data:', data)
    
    // Update user data with proper formatting
    userData.value = {
      ...data,
      id: userId,
      profilePicture: formatImageUrl(data.profilePicture) || DEFAULT_AVATAR,
      profileHeader: formatImageUrl(data.profileHeader) || DEFAULT_HEADER,
      posts: preparePostsData(data.posts || []),
      likes: data.likes || [],
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    }
  } catch (err) {
    console.error('Error fetching user data:', err)
    error.value = 'Failed to load user data: ' + err.message
  } finally {
    loading.value = false
  }
}

// Handle image errors
const handleImageError = (type) => {
  if (type === 'header') {
    userData.value.profileHeader = DEFAULT_HEADER
  } else if (type === 'avatar') {
    userData.value.profilePicture = DEFAULT_AVATAR
  }
}

// Navigation
const openDonatePage = () => router.push(`/userSubscribeDonate/${userId}`)

// Lifecycle
onMounted(() => {
  console.log('Component mounted')
  fetchUserData()
})
</script>

<template>
  <div class="layout">
    <!-- Loading State -->
    <el-container v-if="loading">
      <el-main class="loading-state">
        <el-loading :fullscreen="true" />
        <p>Loading profile...</p>
      </el-main>
    </el-container>

    <!-- Error State -->
    <el-container v-else-if="error">
      <el-main class="error-state">
        <el-alert
          :title="error"
          type="error"
          :closable="false"
        />
      </el-main>
    </el-container>

    <!-- Content State -->
    <template v-else>
      <el-container>
        <!-- Profile Header -->
        <el-header class="header">
          <el-image 
            class="header-image" 
            :src="userData.profileHeader"
            fit="cover"
            @error="() => handleImageError('header')"
          />
        </el-header>
        
        <!-- Main Content -->
        <el-container class="content-container">
          <el-aside class="aside">
            <!-- Profile Picture -->
            <div class="profile-image">
              <el-image 
                :src="userData.profilePicture"
                @error="() => handleImageError('avatar')"
              >
                <template #placeholder>
                  <div class="image-slot">Загрузка<span class="dot">...</span></div>
                </template>
              </el-image>
            </div>
            
            <!-- User Info -->
            <el-text tag="h2" class="username">
              {{ userData.username }}
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
                <g fill="#25c1fd" fill-rule="nonzero">
                  <g transform="scale(5.12,5.12)">
                    <path d="M25,2c-12.682,0 -23,10.318 -23,23c0,12.683 10.318,23 23,23c12.683,0 23,-10.317 23,-23c0,-12.682 -10.317,-23 -23,-23zM35.827,16.562l-11.511,16.963l-8.997,-8.349c-0.405,-0.375 -0.429,-1.008 -0.053,-1.413c0.375,-0.406 1.009,-0.428 1.413,-0.053l7.29,6.764l10.203,-15.036c0.311,-0.457 0.933,-0.575 1.389,-0.266c0.458,0.31 0.577,0.932 0.266,1.39z"></path>
                  </g>
                </g>
              </svg>
            </el-text>
            <!-- Stats -->
            <el-text class="stat-badge" type="primary">
              <el-text class="stat-text">{{ userData.posts.length }} публикации</el-text>
            </el-text>
            <el-text class="stat-badge" type="primary">
              <el-text class="stat-text">{{ userData.likes.length }} лайков</el-text>
            </el-text>
          </el-aside>
        </el-container>

        <!-- About Section -->
        <el-container>
          <el-main class="main">
            <el-collapse v-model="activeNames" class="about-section">
              <el-collapse-item name="1">
                <template #title>
                  <div class="collapse-header">
                    <span class="title">О себе</span>
                  </div>
                </template>
                <div class="collapse-content">
                  Я та, кто всегда ищет вдохновение в мелочах 🌸✨ Люблю утренний кофе, теплые пледы и закаты, которые красят небо в нежные оттенки 🦋☕ В моем мире — книги, музыка и бесконечные мечты о путешествиях 🌍💖 Обожаю пробовать новое, танцевать под любимые треки и верить, что впереди только лучшее 💃💫 Если ты тоже любишь жизнь во всех ее проявлениях — нам точно по пути! 🌟😊
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-main>
        </el-container>

        <!-- Action Buttons -->
        <el-button type="warning" class="action-button" plain @click="openDonatePage">
          Станьте спонсором всего за 5$ первый месяц
        </el-button>         
        <el-button type="success" class="action-button" plain>
          Купить годовую подписку за 150$
        </el-button>
      </el-container>
      
      <!-- Posts List -->
      <ListPostCards 
        v-if="userData.posts.length" 
        :posts="userData.posts"
        :user="userData"
      />
    </template>
  </div>
</template>

<style scoped>
.layout {
  width: 100%;
  align-self: center;
}

.header {
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
}

.header-image {
  width: 100%;
  max-height: 300px !important; 
  border-radius: 20px;
  margin-bottom: 10px;
}

.aside {
  width: 100%;
  display: flex;
  align-items: center;
}

.profile-image {
  width: 15%;
  margin-right: 20px;
}

.profile-image :deep(.el-image) {
  border-radius: 20px;
  align-self: flex-start;
  justify-self: flex-start;
}

.username {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
  padding: 0;
  width: 43%;
}

.stat-badge {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
  font-weight: 500;
  border-radius: 15px;
  padding: 12px 20px;
  width: auto;
  margin-left: 20px;
  background: linear-gradient(
    135deg,
    rgba(64, 158, 255, 0.15) 0%,
    rgba(100, 180, 255, 0.25) 50%,
    rgba(64, 158, 255, 0.15) 100%
  );
  backdrop-filter: blur(5px);
  border: 1px solid rgba(64, 158, 255, 0.2);
  box-shadow: 
    0 4px 6px rgba(64, 158, 255, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
}

.stat-badge:hover {
  background: linear-gradient(
    135deg,
    rgba(64, 158, 255, 0.25) 0%,
    rgba(100, 180, 255, 0.35) 50%,
    rgba(64, 158, 255, 0.25) 100%
  );
  transform: translateY(-2px);
  box-shadow: 
    0 8px 12px rgba(64, 158, 255, 0.15),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 70%;
  padding: 0;
  overflow: hidden;
  margin-bottom: 0px;
}

.about-section {
  width: 99%;
  min-height: 150px;
  margin: 1.5% 0 0 5px;
  background: transparent;
  border: 1px solid rgba(var(--el-color-primary-rgb), 0.08);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  margin-bottom: 0px;
}

.about-section:hover {
  border-color: rgba(var(--el-color-primary-rgb), 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.about-section :deep(.el-collapse-item__header) {
  padding: 0.4rem 0.6rem;
  background: transparent;
  border-bottom: 1px solid rgba(var(--el-color-primary-rgb), 0.08);
}

.about-section :deep(.el-collapse-item__content) {
  padding: 0.4rem 0.6rem;
  width: 95%;
}

.collapse-header .title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--el-color-primary);
}

.collapse-content {
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--el-text-color-regular);
}

.action-button {
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 25px;
  width: 99%;
  height: 5.7%;
  align-self: center;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-left: 0;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

@media (max-width: 480px) {
  .content-container {
    flex-direction: column !important;
  }

  .main {
    width: 100%;
    padding: 0 15px;
  }

  .username {
    font-size: 14px;
    width: 30%;
    flex-wrap: wrap;
    gap: 5px;
  }

  .profile-image {
    width: 40%;
    margin-right: 20px;
  }

  .stat-badge {
    width: 70.6% !important;
    padding: 10px;
    margin: 5px;
  }

  .stat-badge :deep(.el-text) {
    font-size: 10px !important;
  }

  .about-section {
    width: 100%;
    margin: 0px 0;
  }

  .collapse-header .title,
  .collapse-content {
    font-size: 14px;
  }

  .action-button {
    font-size: 0.42rem !important;
    height: auto;
    padding: 10px;
  }
}
</style>