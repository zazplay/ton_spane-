<template>
  <div class="common-layout containet-style">
    <el-container style="padding: 0 !important;">
      <!-- Заголовок с добавленной иконкой -->
      <el-header class="header-style">
        <div class="header-content">
          <el-text class="site-name">DreamScape</el-text>
          <div class="icon-container">
            <router-link to="/app/notifications">
              <el-icon class="icon-style">
                <BellFilled />
              </el-icon>
            </router-link>
            <el-icon class="icon-style" @click="openForm">
              <CirclePlusFilled />
            </el-icon>
            <!-- Передача пропа isOpen -->
            <AddPostForm :isOpen="isFormOpen" @close="closeForm" />
          </div>
        </div>
      </el-header>

      <!-- Основной контент -->
      <el-main class="main-container-content">
        <el-container>
          <el-tabs v-model="activeTab" class="demo-tabs containet-style">
            <el-tab-pane label="Для вас" name="first">
              <ListPostCards :posts="posts" />
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

import { BellFilled, CirclePlusFilled } from '@element-plus/icons-vue';
import ListPostCards from '../ListPostCards.vue';
import AddPostForm from '../AddPostForm.vue';
import { ref } from 'vue'
import FollowingPage from './FollowingPage/FollowingPage.vue';
import config from '../../config';

export default {
  components: {
    AddPostForm,
    ListPostCards,
    BellFilled,
    CirclePlusFilled,
    FollowingPage
  },
  data() {
    return {
      isFormOpen: false,
      activeTab: 'first',
      isDataLoaded: false,
      posts: ref([])
    };
  },
  methods: {
    openForm() {
      this.isFormOpen = true; // Відкриваємо форму
    },
    closeForm() {
      this.isFormOpen = false; // Закриваємо форму
    },
    async fetchPosts() {
      try {
        const response = await fetch(`${config.API_BASE_URL}/posts`)
        const data = await response.json()
        console.log('Posts data:', data)
        this.posts = data
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
  },
  mounted() {
    this.fetchPosts()
  }
};
</script>

<style scoped>

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

@media (max-width: 1200px) {
  .containet-style {
    width: 100% !important;
    padding: 0 !important;
  }

  .main-container-content {
    padding: 5px !important;
    padding-top: 0 !important;
  }
}
</style>