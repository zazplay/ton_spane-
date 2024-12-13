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
            @click="handleSubscribe(user)"
            class="subscribe-button"
            :size="'small'"
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

const searchQuery = ref('')
const isLoading = ref(false)
const users = ref([])
const subscribedUsers = ref(new Set())
const userPosts = ref({}) // Хранение постов пользователей

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

const isUserSubscribed = (userId) => {
  return subscribedUsers.value.has(userId)
}

// Получение количества постов пользователя
const getUserPostsCount = (userId) => {
  return userPosts.value[userId]?.length || 0
}

// Получение общего количества лайков пользователя
const getUserTotalLikes = (userId) => {
  const posts = userPosts.value[userId] || []
  return posts.reduce((total, post) => total + (post.likes?.length || 0), 0)
}

// Загрузка пользователей
const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await fetch('https://ton-back-e015fa79eb60.herokuapp.com/api/users')
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

// Загрузка постов для всех пользователей
const fetchAllUsersPosts = async () => {
  for (const user of users.value) {
    try {
      const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/posts/requester/${user.id}`)
      if (!response.ok) continue
      const posts = await response.json()
      userPosts.value[user.id] = posts
    } catch (error) {
      console.error(`Error fetching posts for user ${user.id}:`, error)
    }
  }
}

const handleSubscribe = async (user) => {
  try {
    if (subscribedUsers.value.has(user.id)) {
      subscribedUsers.value.delete(user.id)
      ElMessage.success('Вы отписались от пользователя')
    } else {
      subscribedUsers.value.add(user.id)
      ElMessage.success('Вы подписались на пользователя')
    }
  } catch (error) {
    console.error('Error toggling subscription:', error)
    ElMessage.error('Ошибка при изменении подписки')
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.layout {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  margin-bottom: 30px;
  text-align: center;
}

.search-title {
  color: #e6edf3;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
  max-width: 500px;
}

.users-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-card {
  background: #161b22;
  border: 1px solid rgba(0, 149, 255, 0.1);
  border-radius: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
}

.user-avatar {
  border: 2px solid rgba(0, 149, 255, 0.3);
  background: #1f2937;
  color: #e6edf3;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.username {
  color: #e6edf3;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  display: block;
  margin-bottom: 5px;
}

.stats {
  display: flex;
  gap: 15px;
  color: #8b949e;
  font-size: 0.875rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stat-value {
  color: #58a6ff;
  font-weight: 500;
}

.subscribe-button {
  min-width: 100px;
}

@media (max-width: 480px) {
  .user-info {
    flex-wrap: wrap;
  }
  
  .subscribe-button {
    width: 100%;
    margin-top: 10px;
  }
  
  .stats {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>