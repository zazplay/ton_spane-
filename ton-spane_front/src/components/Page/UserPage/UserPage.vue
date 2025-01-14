<template>
  <div class="layout">
    <div v-if="!isLoaded" class="loading-container">
      <el-card class="loading-card">
        <el-skeleton style="width: 100%" animated>
          <template #template>
            <el-skeleton-item variant="image" style="width: 100%; height: 200px" />
            <div style="padding: 14px">
              <el-skeleton-item variant="h3" style="width: 50%" />
              <div style="display: flex; justify-content: space-between; margin-top: 20px">
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item variant="text" style="width: 30%" />
              </div>
            </div>
          </template>
        </el-skeleton>
      </el-card>
    </div>

    <el-container v-else>
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
          <el-text class="stat-badgeLikes" type="primary">
            <el-text class="stat-text">{{ userLikes }} лайков</el-text>
          </el-text>
          <el-text class="stat-badgeSubs" type="primary">
            <el-text class="stat-text">{{ userSubscription }} подпиcчиков</el-text>
          </el-text>
        </el-aside>
      </el-container>

      <el-container>
        <el-main class="main">
          <el-card class="about-section" shadow="never">
            <template #header>
              <div class="about-header">
                <span class="title">О себе</span>
              </div>
            </template>
            <div class="about-content">
              {{ userData.profileDescription || 'Описание не добавлено' }}
            </div>
          </el-card>
        </el-main>
      </el-container>
      <el-button type="success" class="action-Chat" plain @click="openChatsPage">
        Написать
      </el-button>
      <el-button 
        :type="isSubscribed ? 'success' : 'primary'"
        class="action-buttonFreeSubscribe" 
        plain 
        @click="handleFreeSubscribe"
      >
        <div class="subscribe-button-content">
          <div class="subscribe-main-text">
            {{ isSubscribed ? 'Вы подписаны' : 'Подписаться' }}
          </div>
          <div class="subscribe-sub-text" v-if="!isSubscribed">
            Только уведомления о новых постах
          </div>
        </div>
      </el-button>

      <el-button type="warning" class="action-buttonMonthSub" plain @click="openDonatePage">
        Станьте спонсором всего за 5$ первый месяц
      </el-button>
      
      <el-button type="success" class="action-buttonYearSub" plain @click="openDonateYearPage">
        Купить годовую подписку за 150$
      </el-button>

      
    </el-container>
    
    <ListPostCards
      v-if="isLoaded && userData.posts && userData.posts.length > 0"
      :posts="userData.posts"
      :user="userData"
      @updatePosts="handlePostUpdate"
    />
    <div v-else-if="isLoaded && (!userData.posts || userData.posts.length === 0)" class="no-posts">
      <el-empty
        description="Нет публикаций"
        :image-size="200"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ListPostCards from '../../ListPostCards.vue'
import {
  ElMessage,
  ElSkeleton,
  ElSkeletonItem,
  ElCard,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElImage,
  ElText,
  ElButton,
  ElEmpty
} from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const route = useRoute()
const CurrUserId = computed(() => store.getters.getSub)
const userId = route.params.id

const DEFAULT_HEADER = 'https://placehold.co/600x200'
const DEFAULT_AVATAR = 'https://img.icons8.com/?size=100&id=83151&format=png&color=22C3E6'

const userLikes = ref(0)
const userSubscription = ref(0)
const isLoaded = ref(false)
const isSubscribed = ref(false)
const abortController = new AbortController()

const userData = ref({
  id: userId,
  username: '',
  profilePicture: '',
  profileHeader: '',
  posts: [],
  likes: [],
  profileDescription: ''
})

const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  return imageUrl
}

const preparePostsData = (posts = []) => {
  if (!Array.isArray(posts)) return []
  return posts.map(post => ({
    ...post,
    id: post.id,
    userId: userId,
    imageUrl: formatImageUrl(post.imageUrl),
    price: String(post.price || 0),
    isBlurred: post.isBlurred || false,
    caption: post.caption || ''
  }))
}

const handlePostUpdate = async () => {
  try {
    // Очищаем текущие посты
    userData.value.posts = []
    await nextTick()
    
    // Загружаем обновленные данные
    const [postsData] = await Promise.all([
      fetchUserPosts(),
      fetchUserSubs()
    ])
    
    // Обновляем данные в userData
    userData.value = {
      ...userData.value,
      posts: postsData
    }
    
    // Обновляем количество лайков
    userLikes.value = postsData.reduce((total, post) => total + (post.likes?.length || 0), 0)
    
  } catch (error) {
    console.error('Error updating posts:', error)
    ElMessage.error('Ошибка при обновлении постов')
  }
}

const checkSubscriptionStatus = async () => {
  try {
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/${CurrUserId.value}/following`,
      {
        method: 'GET',
        headers: {
          'accept': '*/*'
        }
      }
    )
    if (response.ok) {
      const followingList = await response.json()
      isSubscribed.value = followingList.some(user => user.id === userId)
    }
  } catch (error) {
    console.error('Error checking subscription status:', error)
  }
}

const fetchUserData = async () => {
  try {
    const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/models/${route.params.id}`, {
      signal: abortController.signal,
      headers: {
        'accept': '*/*'
      }
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()

    if (!data) {
      throw new Error('No user data received')
    }

    userData.value = {
      ...data,
      profilePicture: formatImageUrl(data.profilePicture) || DEFAULT_AVATAR,
      profileHeader: formatImageUrl(data.profileHeader) || DEFAULT_HEADER,
      posts: preparePostsData(data.posts || []),
      followers: data.followers || [],
      profileDescription: data.profileDescription || ''
    }

  } catch (err) {
    if (err.name === 'AbortError') return
    
    console.error('Error fetching user data:', err)
    ElMessage.error('Ошибка при загрузке данных пользователя')
    
    userData.value = {
      id: route.params.id,
      username: 'Пользователь',
      profilePicture: DEFAULT_AVATAR,
      profileHeader: DEFAULT_HEADER,
      posts: [],
      followers: [],
      profileDescription: ''
    }
  }
}

const createChat = async (route, userId) => {
  const abortController = new AbortController();
  
  try {
    const response = await fetch(
      'https://ton-back-e015fa79eb60.herokuapp.com/api/chats',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          modelId: route.params.id
        }),
        signal: abortController.signal
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      ...data,
      userId: userId,
      modelId: route.params.id,
      // Добавьте дополнительные поля если они нужны в ответе
    };

  } catch (err) {
    if (err.name === 'AbortError') {
      return null;
    }
    console.error('Error creating chat:', err);
    ElMessage.error('Ошибка при создании чата');
    return null;
  } finally {
    abortController.abort();
  }
};

const fetchUserPosts = async () => {
  try {
    const authToken = sessionStorage.getItem("authToken");
    
    // Если нет userId или он null/undefined, не делаем запрос
    if (!route.params.id) {
      return [];
    }

    const url = authToken && CurrUserId.value
      ? `https://ton-back-e015fa79eb60.herokuapp.com/api/posts/user/${route.params.id}/requester/${CurrUserId.value}`
      : `https://ton-back-e015fa79eb60.herokuapp.com/api/posts/user/${route.params.id}/guest`;

    const response = await fetch(url, { 
      signal: abortController.signal,
      // Добавляем заголовки авторизации если есть токен
      ...(authToken && {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error('Posts data is not an array:', data);
      return [];
    }

    return data.map(post => ({
      ...post,
      id: post.id,
      imageUrl: formatImageUrl(post.imageUrl),
      caption: post.caption || '',
      price: String(post.price || 0),
      isBlurred: post.isBlurred || false,
      createdAt: post.createdAt,
      model: {
        id: userId,
        username: userData.value?.username || '',
        email: userData.value?.email || '',
        profilePicture: userData.value?.profilePicture
      },
      initialLiked: authToken ? (post.isLikedByCurrentUser || false) : false,
      initialShared: false,
      initialDonated: false,
      initialSubscribed: authToken ? isSubscribed.value : false
    }));
  } catch (err) {
    if (err.name === 'AbortError') return [];
    console.error('Error fetching user posts:', err);
    ElMessage.error('Ошибка при загрузке постов пользователя');
    return [];
  }
}

const fetchUserSubs = async () => {
  try {
    userSubscription.value = 0

    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/${userId}/followers`,
      { 
        signal: abortController.signal,
        headers: {
          'accept': '*/*'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const followers = await response.json()

    if (!Array.isArray(followers)) {
      console.error('Received invalid followers data:', followers)
      ElMessage.error('Ошибка при загрузке данных подписчиков')
      return
    }

    userSubscription.value = followers.length

    if (CurrUserId.value) {
      isSubscribed.value = followers.some(follower => follower.id === CurrUserId.value)
    }

    return followers.map(follower => ({
      id: follower.id,
      username: follower.username || 'Пользователь',
      profilePicture: follower.profilePicture,
      createdAt: follower.createdAt
    }))

  } catch (err) {
    if (err.name === 'AbortError') return
    console.error('Error fetching user subscriptions:', err)
    ElMessage.error('Ошибка при загрузке подписчиков')
    userSubscription.value = 0
    return []
  }
}

const validateSubscriptionState = () => {
  if (!CurrUserId.value) {
    ElMessage.error('Необходимо авторизоваться')
    return false
  }

  if (!userId) {
    ElMessage.error('Ошибка идентификации пользователя')
    return false
  }

  return true
}

const handleFreeSubscribe = async () => {
  if (!validateSubscriptionState()) return

  try {
    const endpoint = isSubscribed.value ? 'unfollow' : 'follow'
    const method = isSubscribed.value ? 'DELETE' : 'POST'

    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/${CurrUserId.value}/${endpoint}/${userId}`,
      {
        method,
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        },
        ...(method === 'POST' && { body: JSON.stringify({}) })
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to ${endpoint}`)
    }

    isSubscribed.value = !isSubscribed.value
    userSubscription.value += isSubscribed.value ? 1 : -1

    ElMessage.success(isSubscribed.value ? 'Вы подписались' : 'Вы отписались')

    // Update subscription status
    await fetchUserSubs()

    // Refresh posts data to update their states
    const updatedPosts = await fetchUserPosts()
    userData.value = {
      ...userData.value,
      posts: updatedPosts.map(post => ({
        ...post,
        initialSubscribed: isSubscribed.value
      }))
    }
    
    // Trigger ListPostCards component update
    await handlePostUpdate()

  } catch (error) {
    console.error(`Error during ${isSubscribed.value ? 'unsubscribe' : 'subscribe'}:`, error)
    ElMessage.error('Ошибка при изменении подписки')
    await fetchUserSubs()
  }
}

const handleImageError = (type) => {if (type === 'header') {
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

const openChatsPage = async () => {
  try {
    const chatData = await createChat(route, CurrUserId.value);
    if (chatData) {
      router.push(`/app/message`);
    }
  } catch (error) {
    console.error('Error opening chat:', error);
    ElMessage.error('Ошибка при создании чата');
  }
};

// В функции initializeUserData добавим расчет лайков
const initializeUserData = async () => {
  try {
    isLoaded.value = false;
    
    // Загружаем основные данные пользователя
    await fetchUserData();
    
    // Параллельно загружаем посты и подписки
    const [postsData] = await Promise.all([
      fetchUserPosts(),
      fetchUserSubs(),
      checkSubscriptionStatus()
    ]);
    
    // Обновляем данные пользователя с полученными постами
    userData.value = {
      ...userData.value,
      posts: postsData
    };

    // Рассчитываем общее количество лайков из всех постов
    userLikes.value = postsData.reduce((total, post) => {
      return total + (Array.isArray(post.likes) ? post.likes.length : 0);
    }, 0);
    
    isLoaded.value = true;
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error('Error initializing data:', error);
    ElMessage.error('Ошибка при загрузке данных');
    isLoaded.value = true;
  }
}

onMounted(() => {
  initializeUserData()
})

onUnmounted(() => {
  abortController.abort()
})
</script>


<style scoped>
.layout {
  width: 95%;
  align-self: center;
  margin-left: 10px;
  background: transparent;
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
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15); 
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: subtle-glow 3s infinite alternate;
}

@keyframes subtle-glow {
    0% {
        box-shadow: 0 8px 132px rgba(99, 102, 241, 0.15);
    }
    100% {
        box-shadow: 0 8px 140px rgba(99, 102, 241, 0.25);
    }
}

.header-image:hover {
    transform: scale(1.015);
    box-shadow: 0 12px 45px rgba(99, 102, 241, 0.3);
}

.content-container {
  flex-direction: column !important;
  width: 100%;
}

/* Базовые стили для темной темы */
html.dark .aside {
  width: 100%;
  display: flex;
  align-items: center;
  background: #131925;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Стили для светлой темы */
html:not(.dark) .aside {
  width: 100%;
  display: flex;
  align-items: center;
  background: #f0f4f8; /* Светлый, мягкий фон */
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Более легкая тень */
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
  border: 2px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
}

/* Базовые стили для темной темы */
html.dark .username {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
  padding: 0;
  width: 43%;
  color: #f3f4f6;
  text-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
}

/* Стили для светлой темы */
html:not(.dark) .username {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
  padding: 0;
  width: 43%;
  color: #1f2937; /* Темный цвет текста для светлой темы */
  text-shadow: 0 0 10px rgba(99, 102, 241, 0.1); /* Более мягкая тень */
}

/* Темная тема - .stat-badge */
html.dark .stat-badge {
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
  font-weight: 500;
  border-radius: 15px;
  padding: 12px 20px;
  width: auto;
  margin-left: 20px;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(79, 70, 229, 0.2) 50%,
    rgba(99, 102, 241, 0.1) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
}

html.dark .stat-badge:hover {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.2) 0%,
    rgba(79, 70, 229, 0.3) 50%,
    rgba(99, 102, 241, 0.2) 100%
  );
  transform: translateY(-2px);
  box-shadow: 
    0 8px 12px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    0 0 15px rgba(99, 102, 241, 0.3);
}

/* Светлая тема - .stat-badge */
html:not(.dark) .stat-badge {
  text-align: center;
  color: #1f2937; /* Темный цвет текста */
  text-shadow: 0 2px 4px rgba(99, 102, 241, 0.1);
  font-weight: 500;
  border-radius: 15px;
  padding: 12px 20px;
  width: auto;
  margin-left: 20px;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.05) 0%,
    rgba(79, 70, 229, 0.1) 50%,
    rgba(99, 102, 241, 0.05) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.5);
  transition: all 0.4s ease;
}

html:not(.dark) .stat-badge:hover {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(79, 70, 229, 0.2) 50%,
    rgba(99, 102, 241, 0.1) 100%
  );
  transform: translateY(-2px);
  box-shadow: 
    0 8px 12px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.6),
    0 0 15px rgba(99, 102, 241, 0.2);
}

/* Темная тема - .stat-badgeLikes */
html.dark .stat-badgeLikes {
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 4px rgba(244, 63, 94, 0.5);
  font-weight: 500;
  border-radius: 15px;
  padding: 12px 20px;
  width: auto;
  margin-left: 20px;
  background: linear-gradient(
    135deg,
    rgba(244, 63, 94, 0.2) 0%,
    rgba(225, 29, 72, 0.35) 50%, 
    rgba(244, 63, 94, 0.2) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(244, 63, 94, 0.3);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.2),
    0 0 15px rgba(244, 63, 94, 0.2);
  transition: all 0.4s ease;
}

html.dark .stat-badgeLikes:hover {
  background: linear-gradient(
    135deg,
    rgba(244, 63, 94, 0.3) 0%,
    rgba(225, 29, 72, 0.45) 50%,
    rgba(244, 63, 94, 0.3) 100%
  );
  transform: translateY(-2px);
  box-shadow: 
    0 8px 12px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    0 0 20px rgba(244, 63, 94, 0.4);
}

/* Светлая тема - .stat-badgeLikes */
html:not(.dark) .stat-badgeLikes {
  text-align: center;
  color: #831843; /* Темный цвет текста для лайков */
  text-shadow: 0 2px 4px rgba(244, 63, 94, 0.1);
  font-weight: 500;
  border-radius: 15px;
  padding: 12px 20px;
  width: auto;
  margin-left: 20px;
  background: linear-gradient(
    135deg,
    rgba(244, 63, 94, 0.05) 0%,
    rgba(225, 29, 72, 0.1) 50%, 
    rgba(244, 63, 94, 0.05) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(244, 63, 94, 0.1);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.5),
    0 0 15px rgba(244, 63, 94, 0.1);
  transition: all 0.4s ease;
}

html:not(.dark) .stat-badgeLikes:hover {
  background: linear-gradient(
    135deg,
    rgba(244, 63, 94, 0.1) 0%,
    rgba(225, 29, 72, 0.2) 50%,
    rgba(244, 63, 94, 0.1) 100%
  );
  transform: translateY(-2px);
  box-shadow: 
    0 8px 12px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.6),
    0 0 20px rgba(244, 63, 94, 0.2);
}

/* Темная тема - .stat-badgeSubs */
html.dark .stat-badgeSubs {
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 4px rgba(139, 92, 246, 0.5);
  font-weight: 500;
  border-radius: 15px;
  padding: 12px 20px;
  width: auto;
  margin-left: 20px;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.2) 0%,
    rgba(124, 58, 237, 0.35) 50%,
    rgba(139, 92, 246, 0.2) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.2),
    0 0 15px rgba(139, 92, 246, 0.2);
  transition: all 0.4s ease;
}

html.dark .stat-badgeSubs:hover {
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.3) 0%,
    rgba(124, 58, 237, 0.45) 50%,
    rgba(139, 92, 246, 0.3) 100%
  );
  transform: translateY(-2px);
  box-shadow: 
    0 8px 12px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    0 0 20px rgba(139, 92, 246, 0.4);
}

/* Светлая тема - .stat-badgeSubs */
html:not(.dark) .stat-badgeSubs {
  text-align: center;
  color: #5b21b6; /* Темный цвет текста для подписок */
  text-shadow: 0 2px 4px rgba(139, 92, 246, 0.1);
  font-weight: 500;
  border-radius: 15px;
  padding: 12px 20px;
  width: auto;
  margin-left: 20px;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.05) 0%,
    rgba(124, 58, 237, 0.1) 50%,
    rgba(139, 92, 246, 0.05) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.1);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.5),
    0 0 15px rgba(139, 92, 246, 0.1);
  transition: all 0.4s ease;
}

html:not(.dark) .stat-badgeSubs:hover {
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.1) 0%,
    rgba(124, 58, 237, 0.2) 50%,
    rgba(139, 92, 246, 0.1) 100%
  );
  transform: translateY(-2px);
  box-shadow: 
    0 8px 12px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.6),
    0 0 20px rgba(139, 92, 246, 0.2);
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

/* Темная тема - .about-section */
html.dark .about-section {
  width: 99%;
  min-height: 150px;
  margin:  0 0 5px;
  margin-top: 15px;
  background: linear-gradient(145deg, rgba(19, 25, 37, 0.95), rgba(19, 25, 37, 0.85));
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 0 60px rgba(99, 102, 241, 0.03);
  backdrop-filter: blur(10px);
}

/* Светлая тема - .about-section */
html:not(.dark) .about-section {
  width: 99%;
  min-height: 150px;
  margin: 1.5% 0 0 5px;
  background: linear-gradient(145deg, rgba(241, 245, 249, 0.95), rgba(241, 245, 249, 0.85));
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 12px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    inset 0 0 60px rgba(99, 102, 241, 0.02);
  backdrop-filter: blur(10px);
}

/* Темная тема - .about-section :deep(.el-card__header) */
html.dark .about-section :deep(.el-card__header) {
  padding: 18px 24px;
  background: transparent;
  border-bottom: 1px solid rgba(99, 102, 241, 0.15);
}

/* Светлая тема - .about-section :deep(.el-card__header) */
html:not(.dark) .about-section :deep(.el-card__header) {
  padding: 18px 24px;
  background: transparent;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

/* Темная тема - .about-section :deep(.el-card__body) */
html.dark .about-section :deep(.el-card__body) {
  padding: 20px 24px;
  color: rgba(255, 255, 255, 0.95);
}

/* Светлая тема - .about-section :deep(.el-card__body) */
html:not(.dark) .about-section :deep(.el-card__body) {
  padding: 20px 24px;
  color: #1f2937;
}

/* Темная тема - .about-header .title */
html.dark .about-header .title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #818cf8;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Светлая тема - .about-header .title */
html:not(.dark) .about-header .title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4338ca;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Темная тема - .about-content */
html.dark .about-content {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Светлая тема - .about-content */
html:not(.dark) .about-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #1f2937;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Темная тема - .about-section :deep(.el-card) */
html.dark .about-section :deep(.el-card) {
  background: transparent;
  border: none;
  color: white;
}

/* Светлая тема - .about-section :deep(.el-card) */
html:not(.dark) .about-section :deep(.el-card) {
  background: transparent;
  border: none;
  color: #1f2937;
}

/* Темная тема - .about-content:empty и .about-content:contains('Описание не добавлено') */
html.dark .about-content:empty::before,
html.dark .about-content:contains('Описание не добавлено') {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

/* Светлая тема - .about-content:empty и .about-content:contains('Описание не добавлено') */
html:not(.dark) .about-content:empty::before,
html:not(.dark) .about-content:contains('Описание не добавлено') {
  color: rgba(0, 0, 0, 0.5);
  font-style: italic;
}



/* Стили кнопок подписки */
.action-buttonFreeSubscribe,
.action-buttonYearSub,
.action-buttonMonthSub {
  width: 99%;
  height: auto !important;
  align-self: center;
  font-weight: bold;
  padding: 15px 20px;
  margin: 10px 0;
  border: none !important;
  border-radius: 12px;
  color: white !important;
  font-size: 1.25rem !important;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Стили для бесплатной подписки */
.action-buttonFreeSubscribe.el-button--primary {
  background: linear-gradient(-45deg, #f6c13b,  #6366f1, #8b5cf6) !important;
  background-size: 200% 200%;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  animation: gradientBG 10s ease infinite;
}

.action-buttonFreeSubscribe.el-button--success {
  background: linear-gradient(-45deg, #34d399, #059669, #10b981) !important;
  background-size: 200% 200%;
  box-shadow: 0 4px 15px rgba(52, 211, 153, 0.3);
  animation: gradientBG 10s ease infinite;
}

.subscribe-button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.subscribe-main-text {
  font-size: 1.25rem;
  font-weight: bold;
}

.subscribe-sub-text {
  font-size: 0.875rem;
  font-weight: normal;
  opacity: 0.9;
}

/* Стили для платных подписок */
.action-buttonYearSub {
  background: linear-gradient(-45deg, #7c3aed, #4f46e5, #ec4899) !important;
  background-size: 200% 200%;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  animation: gradientBG 10s ease infinite;
}

.action-buttonMonthSub {
  background: linear-gradient(-45deg, #6366f1, #3b82f6, #8b5cf6) !important;
  background-size: 200% 200%;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  animation: gradientBG 10s ease infinite;
}

/* Общие эффекты для всех кнопок */
.action-buttonYearSub::before,
.action-buttonMonthSub::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  animation: rotate 10s linear infinite;
  pointer-events: none;
}

.action-buttonFreeSubscribe:hover,
.action-buttonYearSub:hover,
.action-buttonMonthSub:hover {
  transform: translateY(-2px);
}

.action-buttonFreeSubscribe.el-button--primary:hover {
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.action-buttonFreeSubscribe.el-button--success:hover {
  box-shadow: 0 8px 25px rgba(52, 211, 153, 0.4);
}

.action-buttonYearSub:hover {
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
}

.action-buttonMonthSub:hover {
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

@keyframes gradientBG {
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

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Enhanced Chat Button Styles */
.action-Chat {
  width: 99%;
  height: auto !important;
  align-self: center;
  font-weight: bold;
  padding: 15px 20px;
  margin: 10px 0;
  border: 2px solid #67c23a !important;
  border-radius: 12px;
  color: #67c23a !important;
  font-size: 1.25rem !important;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Icon styles */
.action-Chat::before {
  content: "✏️";
  font-size: 1.2rem;
  margin-right: 4px;
  transition: transform 0.3s ease;
}

/* Underline animation */
.action-Chat::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #67c23a, #95d475, #67c23a);
  background-size: 200% 100%;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

/* Hover effects */
.action-Chat:hover {
  background-color: rgba(103, 194, 58, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);
}

.action-Chat:hover::before {
  transform: rotate(-10deg);
}

.action-Chat:hover::after {
  transform: scaleX(1);
  animation: shimmer 2s infinite linear;
}

/* Shimmer animation for underline */
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Темная тема - .loading-container */
html.dark .loading-container {
  padding: 20px;
  background: #0a0f16;
  min-height: 100vh;
}

/* Светлая тема - .loading-container */
html:not(.dark) .loading-container {
  padding: 20px;
  background: #f0f4f8;
  min-height: 100vh;
}

/* Темная тема - .loading-card */
html.dark .loading-card {
  background: #131925;
  border: none;
  border-radius: 16px;
  overflow: hidden;
}

/* Светлая тема - .loading-card */
html:not(.dark) .loading-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Темная тема - .loading-card :deep(.el-card__body) */
html.dark .loading-card :deep(.el-card__body) {
  padding: 0;
}

/* Светлая тема - .loading-card :deep(.el-card__body) */
html:not(.dark) .loading-card :deep(.el-card__body) {
  padding: 0;
}

/* Темная тема - .loading-card :deep(.el-skeleton__item) */
html.dark .loading-card :deep(.el-skeleton__item) {
  background: linear-gradient(90deg, #1a2332 25%, #2d3748 50%, #1a2332 75%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
}

/* Светлая тема - .loading-card :deep(.el-skeleton__item) */
html:not(.dark) .loading-card :deep(.el-skeleton__item) {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
}

/* Анимация остается одинаковой для обеих тем */
@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@media (max-width: 480px) {

  .action-Chat {
    width: 100% !important;
    font-size: 17px !important;
    height: 40px !important;

  }

  .content-container {
    flex-direction: column !important;
    width: 98%;
  }
  
  .layout {
    width: 100%;
    margin-left: 0;
    padding: 10px;
  }

  .header-image {
    border-radius: 12px;
    max-height: 200px !important;
  }

  .main {
    width: 100%;
    padding: 0 15px;
  }
  
  .aside {
    width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center !important;
    justify-content: center !important;
    padding: 20px;
  }
  
  .profile-image {
    width: 25%;
    margin-right: 10px;
  }
  
  .username {
    font-size: 14px;
    width: 30%;
  }
  
  .stat-badge,
  .stat-badgeLikes, 
  .stat-badgeSubs {
    width: 60.6% !important;
    padding: 5px;
    margin: 5px;
    margin-top: 15px;
  }
  
  .stat-badge :deep(.el-text),
  .stat-badgeLikes :deep(.el-text),
  .stat-badgeSubs :deep(.el-text) {
    font-size: 12px !important;
  }
  
  .about-section {
    width: 103% !important;
    margin: 0px 0;
    margin-left: -10px !important;
    margin-top: 10px;
  }
  
  .collapse-header .title,
  .collapse-content {
    font-size: 14px;
  }

  .action-buttonFreeSubscribe,
  .action-buttonYearSub,
  .action-buttonMonthSub {
    width: 100%;
    margin: 5px 0;
    padding: 12px;
    font-size: 0.75rem !important;
    height: auto;
  }

  .subscribe-main-text {
    font-size: 0.875rem;
  }

  .subscribe-sub-text {
    font-size: 0.75rem;
  }

  .loading-container {
    padding: 10px;
  }

  .loading-card :deep(.el-skeleton__item) {
    margin-bottom: 10px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .main {
    width: 90%;
  }
  
  .action-buttonFreeSubscribe,
  .action-buttonYearSub,
  .action-buttonMonthSub {
    width: 95%;
    font-size: 1rem !important;
  }
  
  .subscribe-main-text {
    font-size: 1rem;
  }
  
  .subscribe-sub-text {
    font-size: 0.8rem;
  }
  
  .stat-badge,
  .stat-badgeLikes,
  .stat-badgeSubs {
    width: auto !important;
    margin: 5px;
  }
}
</style>