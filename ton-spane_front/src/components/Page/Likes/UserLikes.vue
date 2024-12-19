<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { ElLoading } from 'element-plus'
import ListPostCards from '../../ListPostCards.vue'

const store = useStore()
const likedPosts = ref([])
const loading = ref(true)
const CurrUserId = computed(() => store.getters.getSub)
const loadingInstance = ref(null)

const fetchLikedPosts = async () => {
  try {
    loadingInstance.value = ElLoading.service({
      fullscreen: true,
      text: 'Загрузка...'
    })
    
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/posts/requester/${CurrUserId.value}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const posts = await response.json()
    if (!Array.isArray(posts)) {
      console.error('Posts data is not an array:', posts)
      return
    }

    // Filter only posts that are liked by current user
    likedPosts.value = posts
      .filter(post => post.isLikedByCurrentUser)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
  } catch (error) {
    console.error('Error fetching posts:', error)
    ElMessage.error('Ошибка при загрузке постов')
  } finally {
    loading.value = false
    if (loadingInstance.value) {
      loadingInstance.value.close()
    }
  }
}

onMounted(() => {
  fetchLikedPosts()
})
</script>

<template>
  <div class="title">Ваши лайки:</div>
  <ListPostCards 
    v-if="!loading && likedPosts.length > 0" 
    :posts="likedPosts" 
    style="margin-top: 20px;"
  />
  <el-empty
    v-else-if="!loading"
    description="Нет лайкнутых постов"
    :image-size="200"
  />
</template>

<style scoped>
.title {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif;
  font-size: 24px;
  font-weight: 700;
  margin: 5px 0;
  padding: 0 15px 0 5px;
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
  background: linear-gradient(135deg, #ff9bb9 0%, #ff4778 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(255, 71, 120, 0.3);
  animation: heartbeat 1.5s ease-in-out infinite;
}

.title::before {
  content: '♥';
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  background: linear-gradient(135deg, #ff4778 0%, #ff9bb9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff4778, transparent);
  opacity: 0.7;
}


</style>