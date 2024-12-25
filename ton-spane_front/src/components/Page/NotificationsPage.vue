<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import ListPostCards from '../ListPostCards.vue' // Assuming this is the correct path

const store = useStore()
const followingList = ref([])
const allPosts = ref([])
const loading = ref(true)
const CurrUserId = computed(() => store.getters.getSub)

// Format image URL if needed
const formatImageUrl = (url) => url // Add any URL formatting logic if needed

// Fetch posts for a single model
const fetchModelPosts = async (modelId, modelData) => {
  try {
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/posts/user/${modelId}/requester/${CurrUserId.value}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!Array.isArray(data)) {
      console.error('Posts data is not an array:', data)
      return []
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
        id: modelData.id,
        username: modelData.username,
        email: modelData.email || '',
        profilePicture: modelData.profilePicture
      },
      initialLiked: post.isLikedByCurrentUser || false,
      initialShared: false,
      initialDonated: false,
      initialSubscribed: post.isSubscribed || false
    }))
  } catch (error) {
    console.error('Error fetching model posts:', error)
    ElMessage.error(`Ошибка при загрузке постов пользователя ${modelData.username}`)
    return []
  }
}


// Fetch following list and their posts
const fetchAllModelPosts = async () => {
  if (sessionStorage.getItem("userType").toString() == "user"){

  try {
    // Fetch following list
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/${CurrUserId.value}/following`,
      {
        headers: {
          'accept': '*/*'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch following list')
    }
    
    followingList.value = await response.json()
    
    // Fetch posts for each model
    const allModelPosts = await Promise.all(
      followingList.value.map(model => fetchModelPosts(model.id, model))
    )
    
    // Flatten and sort posts by date
    allPosts.value = allModelPosts
      .flat()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
    loading.value = false
  } catch (error) {
    console.error('Error fetching all model posts:', error)
    ElMessage.error('Ошибка при загрузке постов')
    loading.value = false
  }
}
}

onMounted(() => {
  fetchAllModelPosts()
})
</script>

<template>
  
  
  <div class="title">Последние действия:</div>
  <div v-if="loading" class="loading">
    <el-loading />
  </div>
  <ListPostCards 
    v-else-if="allPosts.length > 0" 
    :posts="allPosts" 
    style="margin-top: 20px;"
  />
  <el-empty
    v-else
    description="Нет доступных постов"
    :image-size="200"
  />
</template>


<style scoped>
.title {
 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif;
 font-size: 24px;
 font-weight: 700;
 margin: 5px 0;
 padding: 0 5px;
 letter-spacing: 0.5px;
 position: relative;
 display: inline-block;
 background: linear-gradient(135deg, #9bbdff 0%, #3568c7 100%);
 -webkit-background-clip: text;
 -webkit-text-fill-color: transparent;
 text-shadow: 2px 2px 4px rgba(79, 140, 255, 0.3);
}

.title::after {
 content: '';
 position: absolute;
 bottom: -2px;
 left: 0;
 width: 100%;
 height: 2px;
 background: linear-gradient(90deg, transparent, #80aaff, transparent);
 opacity: 0.7;
}


@keyframes glow {
 0%, 100% {
   filter: drop-shadow(0 0 2px rgba(128, 170, 255, 0.4));
 }
 50% {
   filter: drop-shadow(0 0 5px rgba(79, 140, 255, 0.6));
 }
}

.el-card {
  width: auto;
  margin-bottom: 10px;
  background: linear-gradient(165deg, #1f2937, #111827);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25),
              0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  margin-left: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.el-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(0, 180, 219, 0.3);
}

.el-card__header {
  padding: 15px;
  border-bottom: 1px solid rgba(0, 180, 219, 0.2);
  background: linear-gradient(to right, #1f2937, #111827);
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.el-card__body {
  padding: 0px !important;
  background: rgba(17, 24, 39, 0.98);
}

.el-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: contrast(1.05) brightness(1.05);
}

.scrollbar-flex-content {
  display: flex;
  gap: 20px;
  padding: 4px;
}

.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  text-align: center;
  width: auto;
}

.el-scrollbar ::-webkit-scrollbar {
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
}

.el-scrollbar ::-webkit-scrollbar-track {
  background: rgba(17, 24, 39, 0.2);
  border-radius: 4px;
}

.el-scrollbar ::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #00b4db, #0083b0);
  border-radius: 4px;
  transition: background 0.3s ease;
}

.el-scrollbar ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #0083b0, #00b4db);
}

@media (max-width: 480px) {
  .el-card {
    width: 95%;
    align-self: center;
  }
  
  .el-card__header {
    font-size: 16px;
    padding: 12px;
  }
}
</style>