<script lang="js" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ListPostCards from '../../ListPostCards.vue'
import Config from '@/config'

const router = useRouter()
const route = useRoute()
const userId = route.params.id || 'f26088fd-d4aa-4420-a7f6-1f89baa915c3'

const S3_BASE_URL = 'https://tonimages.s3.us-east-1.amazonaws.com/'
const DEFAULT_HEADER = 'https://placehold.co/600x200'
const DEFAULT_AVATAR = 'https://img.icons8.com/?size=100&id=83151&format=png&color=22C3E6'

const isLoaded = ref(false)
const userData = ref({
  id: userId,
  username: '',
  profilePicture: '',
  profileHeader: '',
  posts: [],
  likes: [],
})
const activeNames = ref(['1'])

const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  return imageUrl.startsWith('http') ? imageUrl : `${S3_BASE_URL}${imageUrl}`
}

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

const fetchUserData = async () => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/users/${userId}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    
    userData.value = {
      ...data,
      id: userId,
      profilePicture: formatImageUrl(data.profilePicture) || DEFAULT_AVATAR,
      profileHeader: formatImageUrl(data.profileHeader) || DEFAULT_HEADER,
      posts: preparePostsData(data.posts || []),
      likes: data.likes || [],
    }
    isLoaded.value = true
  } catch (err) {
    console.error('Error fetching user data:', err)
    isLoaded.value = true
  }
}

const fetchUserPosts = async () => {
  try {
    const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/posts/user/${userId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    const formattedPosts = data.map(post => ({
      ...post,
      id: post.id,
      imageUrl: formatImageUrl(post.imageUrl),
      caption: post.caption || '',
      price: String(post.price),
      isBlurred: post.isBlurred || false,
      createdAt: post.createdAt,
      user: {
        id: userId,
        username: userData.value.username,
        email: userData.value.email || '',
        profilePicture: userData.value.profilePicture
      },
      // Include other boolean flags
      initialLiked: false,
      initialShared: false,
      initialDonated: false,
      initialSubscribed: false
    }));

    userData.value.posts = formattedPosts;
  } catch (err) {
    console.error('Error fetching user posts:', err);
    userData.value.posts = [];
  }
};

const handleImageError = (type) => {
  if (type === 'header') {
    userData.value.profileHeader = DEFAULT_HEADER
  } else if (type === 'avatar') {
    userData.value.profilePicture = DEFAULT_AVATAR
  }
}

const openDonatePage = () => {
  router.push(`/app/userSubscribeDonate/${userId}`)
}

const openDonateYearPage = () => {
  router.push(`/app/userSubscribeDonateYear/${userId}`)
}

// Sequential fetching to ensure user data is loaded first
const initializeUserData = async () => {
  await fetchUserData()
  await fetchUserPosts()
}

onMounted(initializeUserData)
</script>
<template>
  <div v-if="isLoaded" class="layout">
    <el-container>
      <el-header class="header">
        <el-image 
          class="header-image" 
          :src="userData.profileHeader"
          fit="cover"
          @error="() => handleImageError('header')"
        />
      </el-header>
      
      <el-container class="content-container">
        <el-aside class="aside">
          <div class="profile-image">
            <el-image 
              :src="userData.profilePicture"
              @error="() => handleImageError('avatar')"
            />
          </div>
          
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
          <el-text class="stat-badge" type="primary">
            <el-text class="stat-text">{{ userData.posts.length }} публикации</el-text>
          </el-text>
          <el-text class="stat-badge" type="primary">
            <el-text class="stat-text">{{ userData.likes.length }} лайков</el-text>
          </el-text>
        </el-aside>
      </el-container>

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
              {{ userData.profileDescription }}
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-main>
      </el-container>

      <el-button type="warning" class="action-buttonMonthSub" plain @click="openDonatePage">
        Станьте спонсором всего за 5$ первый месяц
      </el-button>         
      <el-button type="success" class="action-buttonYearSub" plain @click="openDonateYearPage">
        Купить годовую подписку за 150$
      </el-button>
    </el-container>
    
    <ListPostCards 
      v-if="userData.posts.length" 
      :posts="userData.posts"
      :user="userData"
    />
  </div>
</template>

<style scoped>
.layout {
  width: 95%;
  align-self: center;
  margin-left: 10px;
  background: #0d1117;
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
  box-shadow: 0 8px 32px rgba(0, 149, 255, 0.15);
  transition: transform 0.3s ease;
}

.header-image:hover {
  transform: scale(1.02);
}

.aside {
  width: 100%;
  display: flex;
  align-items: center;
  background: #161b22;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.profile-image {
  width: 15%;
  margin-right: 20px;
  transition: transform 0.3s ease;
}

.profile-image :deep(.el-image) {
  border-radius: 20px;
  align-self: flex-start;
  justify-self: flex-start;
  border: 2px solid rgba(0, 149, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 149, 255, 0.2);
}

.username {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
  padding: 0;
  width: 43%;
  color: #e6edf3;
  text-shadow: 0 0 10px rgba(0, 149, 255, 0.3);
}

.stat-badge {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 4px rgba(0, 149, 255, 0.3);
  font-weight: 500;
  border-radius: 15px;
  padding: 12px 20px;
  width: auto;
  margin-left: 20px;
  background: linear-gradient(
    135deg,
    rgba(0, 149, 255, 0.1) 0%,
    rgba(0, 89, 255, 0.2) 50%,
    rgba(0, 149, 255, 0.1) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 149, 255, 0.2);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
}

.stat-badge:hover {
  background: linear-gradient(
    135deg,
    rgba(0, 149, 255, 0.2) 0%,
    rgba(0, 89, 255, 0.3) 50%,
    rgba(0, 149, 255, 0.2) 100%
  );
  transform: translateY(-2px);
  box-shadow: 
    0 8px 12px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    0 0 15px rgba(0, 149, 255, 0.3);
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
  background: rgba(22, 27, 34, 0.8);
  border: 1px solid rgba(0, 149, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  margin-bottom: 0px;
  backdrop-filter: blur(10px);
  color: white !important;
}

.about-section:hover {
  border-color: rgba(0, 149, 255, 0.3);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(0, 149, 255, 0.1);
  transform: translateY(-2px);
}

.about-section :deep(.el-collapse-item__header) {
  padding: 0.4rem 0.6rem;
  background: transparent;
  border-bottom: 1px solid rgba(0, 149, 255, 0.1);
  color: #e6edf3;
}

.about-section :deep(.el-collapse-item__content) {
  padding: 0.4rem 0.6rem;
  width: 95%;
  color: #ffffff !important;
}

.collapse-header .title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #58a6ff;
}

.collapse-content {
  font-size: 0.875rem;
  line-height: 1.4;
  color: #ffffff;
}

/* Базовые стили для всех кнопок */
.action-button, .action-buttonYearSub, .action-buttonMonthSub {
  width: 99%;
  height: 5.7%;
  align-self: center;
  font-weight: bold;
  padding: 20px;
  margin: 10px 0;
  border: none;
  border-radius: 12px;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 1.25rem !important;

}

/* Стиль для обычной кнопки */
.action-button {
  font-size: 1.25rem;
  background: linear-gradient(135deg, #0095ff 0%, #0059ff 100%) !important;
  box-shadow: 0 4px 15px rgba(0, 149, 255, 0.3);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(0, 149, 255, 0.4),
    0 0 15px rgba(0, 149, 255, 0.3);
  background: linear-gradient(135deg, #0059ff 0%, #0095ff 100%) !important;
}

/* Стили для годовой подписки */
.action-buttonYearSub {
  font-size: 0.8rem;
  background: linear-gradient(135deg, #9d50bb 0%, #6e48aa 100%) !important;
  box-shadow: 0 4px 15px rgba(157, 80, 187, 0.3);
}

.action-buttonYearSub:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(157, 80, 187, 0.4),
    0 0 15px rgba(157, 80, 187, 0.3);
  background: linear-gradient(135deg, #b867d9 0%, #9d50bb 100%) !important;
}

.action-buttonYearSub:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(157, 80, 187, 0.2);
}

/* Стили для месячной подписки */
.action-buttonMonthSub {
  font-size: 0.8rem;
  background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%) !important;
  box-shadow: 0 4px 15px rgba(0, 180, 219, 0.3);
}

.action-buttonMonthSub:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(0, 180, 219, 0.4),
    0 0 15px rgba(0, 180, 219, 0.3);
  background: linear-gradient(135deg, #00d2ff 0%, #00b4db 100%) !important;
}

.action-buttonMonthSub:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(0, 180, 219, 0.2);
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #e6edf3;
}

@media (max-width: 480px) {
  .content-container {
    flex-direction: column !important;
    width: 98%;
    
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
    font-size: 12px !important;
  }
  
  .about-section {
    width: 105%;
    margin: 0px 0;
    margin-left: -10px;
    margin-top: 10px;
  }
  
  .collapse-header .title,
  .collapse-content {
    font-size: 14px;
  }
  
/* Общие стили для обеих кнопок */
.action-buttonYearSub, .action-buttonMonthSub {
  width: 99%;
  height: 5.7%;
  align-self: center;
  font-weight: bold;
  font-size: 0.8rem !important;
  padding: 20px;
  margin: 10px 0;
  border: none;
  border-radius: 12px;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* Стили для годовой подписки */
.action-buttonYearSub {
  background: linear-gradient(135deg, #9d50bb 0%, #6e48aa 100%) !important;
  box-shadow: 0 4px 15px rgba(157, 80, 187, 0.3) !important;
  position: relative;
  overflow: hidden;
}

.action-buttonYearSub:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(157, 80, 187, 0.4),
    0 0 15px rgba(157, 80, 187, 0.3);
  background: linear-gradient(135deg, #b867d9 0%, #9d50bb 100%);
}

.action-buttonYearSub:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(157, 80, 187, 0.2);
}

/* Стили для месячной подписки */
.action-buttonMonthSub {
  background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  box-shadow: 0 4px 15px rgba(0, 180, 219, 0.3);
  position: relative;
  overflow: hidden;
}

.action-buttonMonthSub:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(0, 180, 219, 0.4),
    0 0 15px rgba(0, 180, 219, 0.3);
  background: linear-gradient(135deg, #00d2ff 0%, #00b4db 100%);
}

.action-buttonMonthSub:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(0, 180, 219, 0.2);
}

/* Медиа-запрос для мобильных устройств */
@media (max-width: 480px) {
  .action-buttonYearSub,
  .action-buttonMonthSub {
    width: 100%;
    margin: 5px 0;
    padding: 12px;
    font-size: 0.75rem !important;
    height: auto;
  }
}}
</style>