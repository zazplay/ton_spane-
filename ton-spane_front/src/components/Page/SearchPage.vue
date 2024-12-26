<template>
  <div class="layout">
    <div class="search-container">
      <h2 class="search-title">Поиск пользователей</h2>
      <el-input
        v-model="searchQuery"
        placeholder="Введите имя пользователя..."
        class="search-input"
        :prefix-icon="Search"
      />
    </div>

    <div v-if="isLoading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>

    <div v-else class="users-container">
      <el-empty
        v-if="filteredUsers.length === 0"
        description="Пользователи не найдены"
      />
      <el-card v-else v-for="user in filteredUsers" :key="user.id" class="user-card">
        <div class="user-info">
          <el-avatar 
            :size="50" 
            :src="user.profilePicture" 
            class="user-avatar"
          >
            {{ getInitials(user.username || user.email) }}
          </el-avatar>
          <div class="user-details">
            <router-link 
              :to="`/app/user/${user.id}`" 
              class="username"
            >
              {{ user.username || formatEmail(user.email) }}
            </router-link>
            <div class="stats">
              <span class="stat-item">
                <span class="stat-value">{{ getUserPostsCount(user.id) }}</span>
                постов
              </span>
              <span class="stat-item">
                <span class="stat-value">{{ getUserTotalLikes(user.id) }}</span>
                лайков
              </span>
              <span class="stat-item">
                <span class="stat-value">{{ user.comments?.length || 0 }}</span>
                комментариев
              </span>
            </div>
          </div>
          <el-button 
            :type="isUserSubscribed(user.id) ? 'success' : 'primary'"
            @click="handleFreeSubscribe(user.id)"
            class="subscribe-button"
            :size="'small'"
            :disabled="!userId"
          >
            {{ isUserSubscribed(user.id) ? 'Подписан' : 'Подписаться' }}
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()
const userId = computed(() => store.getters.getSub)

const searchQuery = ref('')
const isLoading = ref(false)
const users = ref([])
const subscribedUsers = ref(new Set())
const userPosts = ref({})

const validateSubscriptionState = (targetUserId) => {
  if (!userId.value) {
    ElMessage.error('Необходимо авторизоваться')
    return false
  }
  
  if (!targetUserId) {
    ElMessage.error('Ошибка идентификации пользователя')
    return false
  }
  
  return true
}

const handleFreeSubscribe = async (targetUserId) => {
  if (!validateSubscriptionState(targetUserId)) return
  
  const isCurrentlySubscribed = subscribedUsers.value.has(targetUserId)
  const endpoint = isCurrentlySubscribed ? 'unfollow' : 'follow'
  const method = isCurrentlySubscribed ? 'DELETE' : 'POST'
  
  try {
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/${userId.value}/${endpoint}/${targetUserId}`,
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
    
    // Update local subscription state
    if (isCurrentlySubscribed) {
      subscribedUsers.value.delete(targetUserId)
    } else {
      subscribedUsers.value.add(targetUserId)
    }
    
    ElMessage.success(isCurrentlySubscribed ? 'Вы отписались' : 'Вы подписались')
    await fetchUserSubscriptions()
  } catch (error) {
    console.error('Error toggling subscription:', error)
    ElMessage.error('Ошибка при изменении подписки')
    await fetchUserSubscriptions()
  }
}

const fetchUserSubscriptions = async () => {
  if (!userId.value) return
  
  try {
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/${userId.value}/following`,
      {
        headers: {
          'Accept': '*/*'
        }
      }
    )

    if (!response.ok) throw new Error('Failed to fetch subscriptions')
    
    const followingList = await response.json()
    subscribedUsers.value = new Set(followingList.map(user => user.id))
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
  }
}

// Rest of your existing computed properties and methods
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => {
    const username = (user.username || '').toLowerCase()
    const email = (user.email || '').toLowerCase()
    return username.includes(query) || email.includes(query)
  })
})

const getInitials = (text) => {
  if (!text) return '?'
  return text.split(' ')[0][0].toUpperCase()
}

const formatEmail = (email) => {
  return email?.split('@')[0] || 'Пользователь'
}

const isUserSubscribed = (targetUserId) => {
  return subscribedUsers.value.has(targetUserId)
}

const getUserPostsCount = (userId) => {
  return userPosts.value[userId]?.length || 0
}

const getUserTotalLikes = (userId) => {
  const posts = userPosts.value[userId] || []
  return posts.reduce((total, post) => total + (post.likes?.length || 0), 0)
}

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await fetch('https://ton-back-e015fa79eb60.herokuapp.com/api/models', {
      headers: {
        'accept': '*/*'
      }
    })
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    users.value = data
    await fetchAllUsersPosts()
  } catch (error) {
    console.error('Error fetching users:', error)
    ElMessage.error('Ошибка при загрузке пользователей')
  } finally {
    isLoading.value = false
  }
}

const fetchAllUsersPosts = async () => {
  userPosts.value = {}
  
  try {
    const fetchPromises = users.value.map(async (user) => {
      try {
        const response = await fetch(
          `https://ton-back-e015fa79eb60.herokuapp.com/api/posts/user/${user.id}/requester/${userId.value}`,
          {
            headers: {
              'Accept': '*/*'
            }
          }
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const posts = await response.json()
        return { userId: user.id, posts }
      } catch (error) {
        console.error(`Error fetching posts for user ${user.id}:`, error)
        return { userId: user.id, posts: [] }
      }
    })

    const results = await Promise.all(fetchPromises)
    
    results.forEach(({ userId, posts }) => {
      userPosts.value[userId] = posts
    })
  } catch (error) {
    console.error('Error in fetchAllUsersPosts:', error)
  }
}

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchUserSubscriptions()])
})
</script>

<style scoped>
.layout {
 width: 100%;
 max-width: 800px;
 margin: 0 auto;
 padding: 24px;
}

.search-container {
 margin-bottom: 36px;
 text-align: center;
}

/* Темная тема */
html.dark .search-title {
 color: #e6edf3;
 font-size: 2rem;
 margin-bottom: 20px;
 font-weight: 600;
 text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Светлая тема */
html:not(.dark) .search-title {
 color: #1f2937;
 font-size: 2rem;
 margin-bottom: 20px;
 font-weight: 600;
 text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.search-input {
 width: 100%;
 max-width: 500px;
 margin: 0 auto;
}

/* Темная тема - поле поиска */
html.dark .search-input :deep(.el-input__wrapper) {
 background: rgba(255, 255, 255, 0.05);
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
 border-radius: 12px;
 padding: 8px 16px;
 transition: all 0.3s ease;
}

html.dark .search-input :deep(.el-input__wrapper:hover) {
 background: rgba(255, 255, 255, 0.08);
}

html.dark .search-input :deep(.el-input__inner) {
 color: #e6edf3;
 font-size: 1rem;
}

html.dark .search-input :deep(.el-input__prefix-icon) {
 color: #8b949e;
 font-size: 1.2rem;
}

/* Светлая тема - поле поиска */
html:not(.dark) .search-input :deep(.el-input__wrapper) {
 background: rgba(0, 0, 0, 0.03);
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
 border-radius: 12px;
 padding: 8px 16px;
 transition: all 0.3s ease;
}

html:not(.dark) .search-input :deep(.el-input__wrapper:hover) {
 background: rgba(0, 0, 0, 0.05);
}

html:not(.dark) .search-input :deep(.el-input__inner) {
 color: #1f2937;
 font-size: 1rem;
}

html:not(.dark) .search-input :deep(.el-input__prefix-icon) {
 color: #6b7280;
 font-size: 1.2rem;
}

.users-container {
 display: flex;
 flex-direction: column;
 gap: 20px;
}

/* Темная тема - карточка пользователя */
html.dark .user-card {
 background: rgba(22, 27, 34, 0.8);
 border: 1px solid rgba(99, 179, 237, 0.15);
 border-radius: 16px;
 backdrop-filter: blur(10px);
 transition: transform 0.3s ease, box-shadow 0.3s ease;
 overflow: hidden;
}

/* Светлая тема - карточка пользователя */
html:not(.dark) .user-card {
 background: rgba(255, 255, 255, 0.9);
 border: 1px solid rgba(99, 179, 237, 0.15);
 border-radius: 16px;
 backdrop-filter: blur(10px);
 transition: transform 0.3s ease, box-shadow 0.3s ease;
 overflow: hidden;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-info {
 display: flex;
 align-items: center;
 gap: 20px;
 padding: 20px;
}

/* Темная тема - аватар */
html.dark .user-avatar {
 border: 3px solid rgba(99, 179, 237, 0.3);
 background: linear-gradient(135deg, #1f2937, #111827);
 color: #e6edf3;
 transition: transform 0.3s ease, border-color 0.3s ease;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Светлая тема - аватар */
html:not(.dark) .user-avatar {
 border: 3px solid rgba(99, 179, 237, 0.3);
 background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
 color: #1f2937;
 transition: transform 0.3s ease, border-color 0.3s ease;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-card:hover .user-avatar {
 border-color: rgba(99, 179, 237, 0.5);
 transform: scale(1.05);
}

.user-details {
 flex: 1;
 min-width: 0;
}

/* Темная тема - имя пользователя */
html.dark .username {
 color: #e6edf3;
 text-decoration: none;
 font-weight: 600;
 font-size: 1.1rem;
 display: block;
 margin-bottom: 8px;
 transition: color 0.3s ease;
}

html.dark .username:hover {
 color: #63b3ed;
}

/* Светлая тема - имя пользователя */
html:not(.dark) .username {
 color: #1f2937;
 text-decoration: none;
 font-weight: 600;
 font-size: 1.1rem;
 display: block;
 margin-bottom: 8px;
 transition: color 0.3s ease;
}

html:not(.dark) .username:hover {
 color: #3182ce;
}

/* Темная тема - статистика */
html.dark .stats {
 display: flex;
 gap: 20px;
 color: #8b949e;
 font-size: 0.9rem;
}

/* Светлая тема - статистика */
html:not(.dark) .stats {
 display: flex;
 gap: 20px;
 color: #6b7280;
 font-size: 0.9rem;
}

.stat-item {
 display: flex;
 align-items: center;
 gap: 6px;
 transition: transform 0.3s ease;
}

.stat-item:hover {
 transform: translateY(-1px);
}

/* Темная тема - значение статистики */
html.dark .stat-value {
 color: #63b3ed;
 font-weight: 600;
}

/* Светлая тема - значение статистики */
html:not(.dark) .stat-value {
 color: #3182ce;
 font-weight: 600;
}

.subscribe-button {
 min-width: 120px;
 height: 36px;
 border-radius: 10px;
 font-weight: 500;
 transition: all 0.3s ease;
}

.subscribe-button:not(:disabled):hover {
 transform: translateY(-1px);
 box-shadow: 0 4px 12px rgba(0, 149, 255, 0.2);
}

/* Кнопки для обеих тем */
.el-button--primary {
 background: linear-gradient(135deg, #3182ce, #2c5282);
 border: none;
}

.el-button--success {
 background: linear-gradient(135deg, #38a169, #2f855a);
 border: none;
}

.el-button--primary:not(:disabled):hover,
.el-button--success:not(:disabled):hover {
 opacity: 0.9;
}

/* Темная тема - отключенная кнопка */
html.dark .el-button:disabled {
 background: #2d3748;
 border: 1px solid #4a5568;
 opacity: 0.7;
 cursor: not-allowed;
}

/* Светлая тема - отключенная кнопка */
html:not(.dark) .el-button:disabled {
 background: #e5e7eb;
 border: 1px solid #d1d5db;
 opacity: 0.7;
 cursor: not-allowed;
}

@media (max-width: 480px) {
 .layout {
   padding: 16px;
 }

 .search-title {
   font-size: 1.5rem;
 }

 .user-info {
   flex-wrap: wrap;
   gap: 15px;
   padding: 15px;
 }
 
 .subscribe-button {
   width: 100%;
   margin-top: 10px;
 }
 
 .stats {
   flex-wrap: wrap;
   gap: 12px;
 }
 
 .user-avatar {
   width: 40px;
   height: 40px;
 }
}


</style>