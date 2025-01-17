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
        v-if="paginatedUsers.length === 0"
        description="Пользователи не найдены"
      />
      <el-card v-else v-for="user in paginatedUsers" :key="user.id" class="user-card">
        <div class="user-info">
          <el-avatar 
            :size="60"
            :src="user.profilePicture" 
            class="user-avatar"
          >
            {{ getInitials(user.username) }}
          </el-avatar>
          <div class="user-details">
            <router-link 
              :to="`/app/user/${user.id}`" 
              class="username"
            >
              {{ user.username }}
            </router-link>
            <div class="stats">
              <span class="stat-item">
                <el-icon class="stat-icon"><Document /></el-icon>
                <span class="stat-value">{{ user.postsCount }}</span>
                <span class="stat-label">постов</span>
              </span>
              <span class="stat-item">
                <svg viewBox="0 0 24 24" class="heart-icon">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span class="stat-value">{{ user.totalLikes }}</span>
                <span class="stat-label">лайков</span>
              </span>
              <span class="stat-item">
                <el-icon class="stat-icon"><User /></el-icon>
                <span class="stat-value">{{ user.followersCount }}</span>
                <span class="stat-label">подписчиков</span>
              </span>
            </div>
          </div>
          <el-button 
            :type="isUserSubscribed(user.id) ? 'success' : 'primary'"
            @click="handleFreeSubscribe(user.id)"
            class="subscribe-button"
            :size="'default'"
            :disabled="!userId"
          >
            {{ isUserSubscribed(user.id) ? 'Подписан' : 'Подписаться' }}
          </el-button>
        </div>
      </el-card>
 
      <!-- Пагинация -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredUsers.length"
          layout="prev, pager, next"
          class="pagination"
          @current-change="handlePageChange"
          :background="true"
        />
      </div>
    </div>
  </div>
 </template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Document, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()
const userId = computed(() => store.getters.getSub)

const searchQuery = ref('')
const isLoading = ref(false)
const users = ref([])
const subscribedUsers = ref(new Set())
const pageSize = 15
const currentPage = ref(1)

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await fetch('https://ton-back-e015fa79eb60.herokuapp.com/api/models/summary', {
      headers: {
        'accept': '*/*'
      }
    })
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    users.value = data
  } catch (error) {
    console.error('Error fetching users:', error)
    ElMessage.error('Ошибка при загрузке пользователей')
  } finally {
    isLoading.value = false
  }
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => {
    return user.username.toLowerCase().includes(query)
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredUsers.value.slice(start, end)
})

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getInitials = (username) => {
  if (!username) return '?'
  return username.split(' ')[0][0].toUpperCase()
}

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
    
    if (!response.ok) throw new Error(`Failed to ${endpoint}`)
    
    if (isCurrentlySubscribed) {
      subscribedUsers.value.delete(targetUserId)
    } else {
      subscribedUsers.value.add(targetUserId)
    }
    
    ElMessage.success(isCurrentlySubscribed ? 'Вы отписались' : 'Вы подписались')
    await fetchUsers()
  } catch (error) {
    console.error('Error toggling subscription:', error)
    ElMessage.error('Ошибка при изменении подписки')
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

const isUserSubscribed = (targetUserId) => {
  return subscribedUsers.value.has(targetUserId)
}

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchUserSubscriptions()])
})
</script>


<style scoped>
.layout {
 width: 100%;
 max-width: 900px;
 margin: 0 auto;
 padding: 20px;
}

.search-container {
 margin-bottom: 36px;
 text-align: center;
}

html.dark .search-title {
 color: #e6edf3;
 font-size: 28px;
 margin-bottom: 20px;
 text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
 background-color: #191E25;
 padding: 15px;
 border-radius: 15px;
 border-bottom: 1px solid rgba(99, 179, 237, 0.3);
 font-weight: 600;
}

html:not(.dark) .search-title {
 color: #2563eb;
 font-size: 28px;
 margin-bottom: 20px;
 font-weight: 600;
 text-shadow: 0 1px 2px rgba(37, 99, 235, 0.1);
}

.search-input {
 width: 100%;
 max-width: 500px;
 margin: 0 auto;
}

html.dark .search-input :deep(.el-input__wrapper) {
 background: rgba(255, 255, 255, 0.05);
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
 border-radius: 12px;
 padding: 8px 16px;
 height: 45px;
}

html:not(.dark) .search-input :deep(.el-input__wrapper) {
 background: white;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
 border-radius: 12px;
 padding: 8px 16px;
 height: 45px;
}

.users-container {
 display: flex;
 flex-direction: column;
 gap: 20px;
}

html.dark .user-card {
 background: rgba(22, 27, 34, 0.8);
 border: 1px solid rgba(99, 179, 237, 0.15);
 border-radius: 16px;
 backdrop-filter: blur(10px);
 transition: all 0.3s ease;
}

html.dark .user-card:hover {
 transform: translateY(-3px);
 border-color: rgba(99, 179, 237, 0.3);
 box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

html:not(.dark) .user-card {
 background: white;
 border: 1px solid rgba(99, 179, 237, 0.15);
 border-radius: 16px;
 transition: all 0.3s ease;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

html:not(.dark) .user-card:hover {
 transform: translateY(-3px);
 box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.user-info {
 display: flex;
 align-items: center;
 gap: 20px;
 padding: 20px;
}

html.dark .user-avatar {
 border: 3px solid rgba(99, 179, 237, 0.3);
 background: linear-gradient(135deg, #1f2937, #111827);
 color: #e6edf3;
 transition: all 0.3s ease;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

html:not(.dark) .user-avatar {
 border: 3px solid #3b82f6;
 background: linear-gradient(135deg, #3b82f6, #2563eb);
 color: white;
 transition: all 0.3s ease;
 box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.user-details {
 flex: 1;
 min-width: 0;
}

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
 color: #3b82f6;
}

.stats {
 display: flex;
 gap: 20px;
 margin-top: 8px;
}

.stat-item {
 display: flex;
 align-items: center;
 gap: 8px;
 transition: all 0.3s ease;
 padding: 6px 12px;
 border-radius: 8px;
}

html.dark .stat-item {
 background: rgba(255, 255, 255, 0.05);
}

html:not(.dark) .stat-item {
 background: #f3f4f6;
}

.stat-icon {
  font-size: 1.2em;
  color: #3b82f6; /* Синий цвет */
  transition: all 0.3s ease;
}

/* Для темной темы можно сделать иконки немного светлее */
html.dark .stat-icon {
  color: #60a5fa;
}

/* Можно добавить эффект при наведении */
.stat-item:hover .stat-icon {
  transform: scale(1.1);
}

.heart-icon {
  width: 1.2em;
  height: 1.2em;
  color: #ff0000; /* Ярко-красный цвет */
  fill: #ff0000; /* Добавляем заливку */
  filter: drop-shadow(0 0 2px rgba(255, 0, 0, 0.3)); /* Добавляем небольшое свечение */
  transition: all 0.3s ease;
}

.stat-item:hover .heart-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.5));
}

html.dark .stat-value {
 color: #e6edf3;
 font-weight: 600;
 font-size: 1rem;
}

html:not(.dark) .stat-value {
 color: #1f2937;
 font-weight: 600;
 font-size: 1rem;
}

.stat-label {
 color: #6b7280;
 font-size: 0.9rem;
}

.subscribe-button {
 min-width: 120px;
 height: 36px;
 border-radius: 10px;
 font-weight: 500;
 transition: all 0.3s ease;
}

html.dark .el-button--primary {
 background: linear-gradient(135deg, #3b82f6, #2563eb);
 border: none;
}

html.dark .el-button--success {
 background: linear-gradient(135deg, #10b981, #059669);
 border: none;
}

html:not(.dark) .el-button--primary {
 background: linear-gradient(135deg, #3b82f6, #2563eb);
 border: none;
}

html:not(.dark) .el-button--success {
 background: linear-gradient(135deg, #10b981, #059669);
 border: none;
}

.subscribe-button:not(:disabled):hover {
 transform: translateY(-2px);
 box-shadow: 0 4px 12px rgba(0, 149, 255, 0.2);
}

.pagination-container {
 display: flex;
 justify-content: center;
 margin: 30px 0;
}

html.dark .pagination :deep(.el-pager li) {
 background-color: rgba(255, 255, 255, 0.05);
 color: #e6edf3;
 border: 1px solid rgba(99, 179, 237, 0.15);
}

html.dark .pagination :deep(.el-pager li.is-active) {
 background-color: #3b82f6;
 color: white;
 border-color: #3b82f6;
}

html:not(.dark) .pagination :deep(.el-pager li) {
 background-color: white;
 border: 1px solid #e5e7eb;
}

html:not(.dark) .pagination :deep(.el-pager li.is-active) {
 background-color: #3b82f6;
 color: white;
 border-color: #3b82f6;
}

@media (max-width: 768px) {
 .layout {
   padding: 15px;
 }

 .user-info {
   flex-wrap: wrap;
   gap: 15px;
   padding: 15px;
 }

 .stats {
   flex-wrap: wrap;
   gap: 10px;
 }

 .stat-item {
   flex: 1;
   justify-content: center;
   min-width: 100px;
 }

 .subscribe-button {
   width: 100%;
   margin-top: 10px;
 }
}
</style>