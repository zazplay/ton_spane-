<template>
  <div class="common-layout containet-style">
    <el-container style="padding: 0 !important;">
      <!-- Заголовок с добавленной иконкой -->
      <el-header class="header-style">
        <div class="header-content">
          <el-text class="site-name">
            <div class="logo-container">
              <img src="./../../assets/horizontal-logo.png" alt="Logo">
          </div>
          </el-text>
          <div class="icon-container">
            <router-link to="/app/notifications">
              <el-icon class="icon-style">
                <BellFilled />
              </el-icon>
            </router-link>
            <AddPostForm :isOpen="isFormOpen" @close="closeForm" />
          </div>
        </div>
      </el-header>

      <!-- Основной контент -->
      <el-main class="main-container-content">
        <el-container>
          <el-tabs v-model="activeTab" class="demo-tabs containet-style">
            <el-tab-pane label="Для вас" name="first">
              <!-- Состояние загрузки -->
              <div v-if="!isDataLoaded" class="loading-container">
                <el-row :gutter="20">
                  <el-col :span="24" v-for="n in 3" :key="n">
                    <el-card class="loading-card">
                      <el-skeleton animated>
                        <template #template>
                          <!-- Аватар и имя пользователя -->
                          <div style="display: flex; align-items: center; margin-bottom: 20px">
                            <el-skeleton-item variant="circle" style="width: 40px; height: 40px; margin-right: 16px"/>
                            <el-skeleton-item variant="text" style="width: 30%"/>
                          </div>
                          <!-- Изображение поста -->
                          <el-skeleton-item variant="image" style="width: 100%; height: 240px"/>
                          <!-- Описание и действия -->
                          <div style="padding: 14px">
                            <el-skeleton-item variant="p" style="width: 90%"/>
                            <el-skeleton-item variant="text" style="width: 60%; margin-top: 16px"/>
                          </div>
                        </template>
                      </el-skeleton>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
              <ListPostCards v-else :posts="posts" />
            </el-tab-pane>
            <el-tab-pane label="Подписки" name="second">
              <FollowingPage />
            </el-tab-pane>
            <el-tab-pane label="Понравилось" name="third">Role</el-tab-pane>
          </el-tabs>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { BellFilled } from '@element-plus/icons-vue'
import ListPostCards from '../ListPostCards.vue'
import AddPostForm from '../AddPostForm.vue'
import {  computed } from 'vue'
import FollowingPage from './FollowingPage/FollowingPage.vue'
import config from '../../config'
import { useStore } from 'vuex'

export default {
  components: {
    AddPostForm,
    ListPostCards,
    BellFilled,
    FollowingPage
  },
  data() {
    const store = useStore()
    const userId = computed(() => store.getters.getSub)
    
    return {
      isFormOpen: false,
      activeTab: 'first',
      isDataLoaded: false,
      posts: {
        id: '',
        caption: '',
        comments: [],
        createdAt: '',
        imageUrl: '',
        isBlurred: false,
        isLikedByCurrentUser: false,
        likes: [],
        price: '0',
        updatedAt: '',
        user: {
          id: '',
          username: null,
          email: '',
          password: '',
          profilePicture: null,
          profileHeader: null,
          profileDescription: null,
          createdAt: '',
          updatedAt: ''
        }
      },
      userId
    }
  },
  methods: {
    openForm() {
      this.isFormOpen = true
    },
    closeForm() {
      this.isFormOpen = false
    },
    async fetchPosts() {
      try {
        this.isDataLoaded = false
        const response = await fetch(`${config.API_BASE_URL}/posts/requester/${this.userId}`)
        const data = await response.json()
        console.log('Posts data:', data)
        
        // Трансформируем данные с нужной структурой
        this.posts = data.map(post => ({
          id: post.id || '',
          caption: post.caption || '',
          comments: post.comments || [],
          createdAt: post.createdAt || '',
          imageUrl: post.imageUrl || '',
          isBlurred: post.isBlurred || false,
          isLikedByCurrentUser: post.isLikedByCurrentUser || false,
          likes: post.likes || [],
          price: post.price || '0',
          updatedAt: post.updatedAt || '',
          user: {
            id: post.user?.id || '',
            username: post.user?.username || null,
            email: post.user?.email || '',
            password: post.user?.password || '',
            profilePicture: post.user?.profilePicture || null,
            profileHeader: post.user?.profileHeader || null,
            profileDescription: post.user?.profileDescription || null,
            createdAt: post.user?.createdAt || '',
            updatedAt: post.user?.updatedAt || ''
          }
        }))

        setTimeout(() => {
          this.isDataLoaded = true
        }, 1000)
      } catch (error) {
        console.error('Error fetching posts:', error)
        this.isDataLoaded = true
      }
    }
  },
  mounted() {
    this.fetchPosts()
  }
}
</script>

<style scoped>


.logo-container img {
    height: 50px;
    margin-left: 70px;
}

/* Стили для мобильных устройств */
@media screen and (max-width: 768px) {
    .logo-container img {
        height: 40px; /* Немного уменьшаем высоту на телефоне */
        margin-left: 40px; /* Уменьшаем отступ слева для мобильных устройств */
    }
}

/* Стили для очень маленьких экранов */
@media screen and (max-width: 480px) {
    .logo-container img {
        margin-left: 25px; /* Еще меньший отступ для самых маленьких экранов */
    }
}
.demo-tabs>.el-tabs__content {
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.containet-style {
  width: 100%;
}

.icon-style {
  font-size: 1.5em;
  cursor: pointer;
  color: #E5EAF3;
  padding: 0.3em;
  transition: transform 0.3s ease;
}

.icon-style:hover {
  transform: scale(1.2);
  color: #8D9095;
}

.header-style {
  color: #E5EAF3;
  height: max-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 !important;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 !important;
}

.site-name {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  flex: 1;
}

.icon-container {
  display: flex;
  padding-right: 20px !important;
}

/* Стили для состояния загрузки */
.loading-container {
  padding: 20px;
}

.loading-card {
  margin-bottom: 20px;
  background: #161b22;
  border: none;
  border-radius: 16px;
  overflow: hidden;
}

.loading-card :deep(.el-card__body) {
  padding: 20px;
}

.loading-card :deep(.el-skeleton__item) {
  background: linear-gradient(90deg, #1c2128 25%, #2d333b 50%, #1c2128 75%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@media (max-width: 1200px) {
  .containet-style {
    width: 100% !important;
    padding: 0 !important;
  }

  .main-container-content {
    padding: 5px !important;
    padding-top: 0 !important;
  }

  .loading-container {
    padding: 10px;
  }

  .loading-card {
    margin-bottom: 10px;
  }

  .loading-card :deep(.el-skeleton__item) {
    margin-bottom: 8px;
  }
}
</style>