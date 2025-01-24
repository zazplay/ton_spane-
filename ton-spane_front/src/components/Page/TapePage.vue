<template>
  <div class="common-layout containet-style">
    <el-container style="padding: 0 !important;">
      <el-header class="header-style">
        <div class="header-content">
          <el-text class="site-name">
            <div class="logo-container">
              <div class="logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M17.516 3c2.382 0 4.487 1.564 4.487 4.712 0 4.963-6.528 8.297-10.003 11.935-3.475-3.638-10.002-6.971-10.002-11.934 0-3.055 2.008-4.713 4.487-4.713 3.18 0 4.846 3.644 5.515 5.312.667-1.666 2.333-5.312 5.516-5.312zm0-2c-2.174 0-4.346 1.062-5.516 3.419-1.17-2.357-3.342-3.419-5.515-3.419-3.403 0-6.484 2.39-6.484 6.689 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-4.586-3.414-6.689-6.484-6.689z" />
                </svg>
              </div>
              <div class="logo-text">
                <span class="text-gradient">Dream</span>scape
              </div>  
            </div>
          </el-text>

          <el-icon 
            v-if="userType === 'model'" 
            class="icon-style" 
            @click="openForm"
          ><CirclePlusFilled /></el-icon>


          <div class="icon-container">
            <router-link to="/app/notifications">
              <el-icon class="icon-style">
                <BellFilled />
              </el-icon>
            </router-link>
            <AddPostForm 
              :isOpen="isFormOpen" 
              @close="closeForm" 
            />
          </div>
        </div>
      </el-header>

      <el-main class="main-container-content">
 <el-container>
   <CustomTabs>
     <template #first>
       <div v-if="!isDataLoaded" class="loading-container">
         <el-row :gutter="20">
           <el-col :span="24" v-for="n in 3" :key="n">
             <el-card class="loading-card">
               <el-skeleton animated>
                 <template #template>
                   <div style="display: flex; align-items: center; margin-bottom: 20px">
                     <el-skeleton-item variant="circle" style="width: 40px; height: 40px; margin-right: 16px"/>
                     <el-skeleton-item variant="text" style="width: 30%"/>
                   </div>
                   <el-skeleton-item variant="image" style="width: 100%; height: 240px"/>
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
       <div v-else-if="posts.length === 0" class="empty-state">
         <el-card class="empty-card">
           <div class="empty-content">
             <el-icon class="empty-icon"><Box /></el-icon>
             <h3 class="empty-title">Здесь пока пусто</h3>
             <p class="empty-description">Публикации появятся позже</p>
           </div>
         </el-card>
       </div>
       <ListPostCards v-else :posts="posts" />
     </template>
     
     <template #second>
       <keep-alive>
         <FollowingPage />
       </keep-alive>
     </template>
     
     <template #third>
       <UserLikes />
     </template>
   </CustomTabs>
 </el-container>
</el-main>
    </el-container>
  </div>
</template>

<script setup>
import CustomTabs from './CustomTabs.vue'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex';
import { BellFilled, Box, CirclePlusFilled } from '@element-plus/icons-vue';
import ListPostCards from '../ListPostCards.vue';
import FollowingPage from './FollowingPage/FollowingPage.vue';
import config from '../../config';
import UserLikes from './Likes/UserLikes.vue';
import AddPostForm from './AddPostForm.vue'

const store = useStore();
const userId = computed(() => store.getters.getSub);
const userType = ref(sessionStorage.getItem('userType'));

const isFormOpen = ref(false);
const isDataLoaded = ref(false);
const posts = ref([]);

const openForm = () => {
  isFormOpen.value = true; // открываем форму при клике
};

const closeForm = () => {
  isFormOpen.value = false; // закрываем форму
};

const fetchPosts = async () => {
  try {
    isDataLoaded.value = false;
    const authToken = sessionStorage.getItem("authToken");
    const url = authToken 
      ? `${config.API_BASE_URL}/posts/requester/${userId.value}`
      : `${config.API_BASE_URL}/posts/admin`;

    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    posts.value = data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    posts.value = [];
  } finally {
    isDataLoaded.value = true;
  }
};

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap');

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Comfortaa', cursive;
  border-radius: 8px;
  padding-top: 10px;
}

.logo-container img {
  height: 50px;
  margin-left: 70px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(45deg, #007bff, #00bfff);
  border-radius: 50%;
  margin-right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-icon svg {
  width: 28px; 
  height: 28px;
  fill: white;
}

.logo-text {
  font-size: 28px;
  background: linear-gradient(45deg, #007bff, #00bfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.icon-style {
  font-size: 1.6em;
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

/* Light/dark theme */
html.dark .icon-style {
  color: #E5EAF3;
}

html.dark .icon-style:hover {
  color: #8D9095;
}

html:not(.dark) .icon-style {
  color: #1f2937;
}

html:not(.dark) .icon-style:hover {
  color: #4B5563;
}

.text-gradient {
  background: linear-gradient(45deg, #ffffff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

html:not(.dark) .text-gradient {
  background: linear-gradient(45deg, #1f2937, #4B5563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media screen and (max-width: 768px) {
  .logo-container img {
    height: 40px;
    margin-left: 40px;
  }
  
  .icon-style {
    font-size: 1.4em;
    padding: 0.2em;
  }
  
  .header-content {
    padding: 0 10px !important;
  }
  
  .icon-container {
    padding-right: 10px !important;
  }
}

@media screen and (max-width: 480px) {
  .logo-container img {
    margin-left: 25px;
  }

  .logo-icon {
    margin-left: 30px
  }
}
</style>