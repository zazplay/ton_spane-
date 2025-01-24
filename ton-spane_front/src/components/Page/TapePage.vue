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
/* Существующие стили */
.logo-container img {
   height: 50px;
   margin-left: 70px;
}

.demo-tabs>.el-tabs__content {
 color: #6b778c;
 font-size: 32px;
 font-weight: 600;
 
 
}

.containet-style {
 width: 100% -20px;
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

/* Стили для состояния загрузки */
.loading-container {
 padding: 20px;
 width: 100% !important;
 margin-left: -20px;
 margin-top: -20px;

}

/* Темная тема */
html.dark .loading-card {
 margin-bottom: 20px;
 background: #161b22;
 border: none;
 border-radius: 16px;
 overflow: hidden;
 width: 100% !important;

}

html.dark .loading-card :deep(.el-skeleton__item) {
 background: linear-gradient(90deg, #1c2128 25%, #2d333b 50%, #1c2128 75%);
 background-size: 400% 100%;
 animation: skeleton-loading 1.4s ease infinite;
}

/* Светлая тема */
html:not(.dark) .loading-card {
 margin-bottom: 20px;
 background: #ffffff;
 border: none;
 border-radius: 16px;
 overflow: hidden;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

html:not(.dark) .loading-card :deep(.el-skeleton__item) {
 background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
 background-size: 400% 100%;
 animation: skeleton-loading 1.4s ease infinite;
}

/* Темная тема - пустое состояние */
html.dark .empty-card {
 width: 100%;
 max-width: 500px;
 background: #161b22;
 border: 1px solid rgba(0, 149, 255, 0.1);
 border-radius: 15px;
 overflow: hidden;
 box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
 transition: all 0.3s ease;
}

html.dark .empty-card:hover {
 border-color: rgba(0, 149, 255, 0.3);
 transform: translateY(-2px);
 box-shadow: 
   0 8px 25px rgba(0, 0, 0, 0.3),
   0 0 20px rgba(0, 149, 255, 0.1);
}

html.dark .empty-content {
 display: flex;
 flex-direction: column;
 align-items: center;
 padding: 40px 20px;
 text-align: center;
 background: linear-gradient(
   135deg,
   rgba(0, 149, 255, 0.1) 0%,
   rgba(0, 89, 255, 0.2) 50%,
   rgba(0, 149, 255, 0.1) 100%
 );
}

html.dark .empty-icon {
 font-size: 64px;
 margin-bottom: 20px;
 color: #58a6ff;
 opacity: 0.8;
}

html.dark .empty-title {
 font-size: 1.25rem;
 font-weight: 600;
 color: #e6edf3;
 margin-bottom: 10px;
 margin: 0;
}

html.dark .empty-description {
 color: #8b949e;
 margin: 10px 0 0 0;
}

/* Светлая тема - пустое состояние */
html:not(.dark) .empty-card {
 width: 100%;
 max-width: 500px;
 background: #ffffff;
 border: 1px solid rgba(0, 149, 255, 0.1);
 border-radius: 15px;
 overflow: hidden;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
 transition: all 0.3s ease;
}

html:not(.dark) .empty-card:hover {
 border-color: rgba(0, 149, 255, 0.2);
 transform: translateY(-2px);
 box-shadow: 
   0 8px 20px rgba(0, 0, 0, 0.12),
   0 0 15px rgba(0, 149, 255, 0.08);
}

html:not(.dark) .empty-content {
 display: flex;
 flex-direction: column;
 align-items: center;
 padding: 40px 20px;
 text-align: center;
 background: linear-gradient(
   135deg,
   rgba(0, 149, 255, 0.05) 0%,
   rgba(0, 89, 255, 0.1) 50%,
   rgba(0, 149, 255, 0.05) 100%
 );
}

html:not(.dark) .empty-icon {
 font-size: 64px;
 margin-bottom: 20px;
 color: #0284c7;
 opacity: 0.9;
}

html:not(.dark) .empty-title {
 font-size: 1.25rem;
 font-weight: 600;
 color: #1f2937;
 margin-bottom: 10px;
 margin: 0;
}

html:not(.dark) .empty-description {
 color: #6b7280;
 margin: 10px 0 0 0;
}

.empty-state {
 padding: 40px 20px;
 display: flex;
 justify-content: center;
 align-items: center;
 min-height: 300px;
}

@keyframes skeleton-loading {
 0% {
   background-position: 100% 50%;
 }
 100% {
   background-position: 0 50%;
 }
}

/* Скроллбар */
.el-scrollbar ::-webkit-scrollbar {
 height: 8px;
 background: rgba(0, 0, 0, 0.1);
}

html.dark .el-scrollbar ::-webkit-scrollbar-track {
 background: rgba(17, 24, 39, 0.2);
 border-radius: 4px;
}

html:not(.dark) .el-scrollbar ::-webkit-scrollbar-track {
 background: rgba(0, 0, 0, 0.05);
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

/* Медиа-запросы */
@media (max-width: 1200px) {
 .containet-style {
   width: 100% !important;
   padding: 0 !important;
 }

 .main-container-content {
   padding: 5px !important;
   padding-top: 0 !important;
   margin-left: 0px;

 }

 .loading-container {
   padding: 10px;
 }

 .loading-card {
   margin-bottom: 10px;
 }

 .empty-state {
   padding: 20px 10px;
 }

 .empty-card {
   max-width: 100%;
 }

 .empty-content {
   padding: 30px 15px;
 }

 .empty-icon {
   font-size: 48px;
 }

 .empty-title {
   font-size: 1rem;
 }
}

@media screen and (max-width: 768px) {
   .logo-container img {
       height: 40px;
       margin-left: 40px;
   }
}

@media screen and (max-width: 480px) {
   .logo-container img {
       margin-left: 25px;
   }

   .logo-icon{
    margin-left: 30px
   }
   
}

@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap');

.logo-container {
 display: flex;
 align-items: center;
 justify-content: center;
 font-family: 'Comfortaa', cursive;
 border-radius: 8px;
 padding-top: 10px;
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

.text-gradient {
 background: linear-gradient(45deg, #ffffff, #f0f8ff);
 -webkit-background-clip: text;
 -webkit-text-fill-color: transparent;
}

/* Header light/dark theme */
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

html:not(.dark) .text-gradient {
 background: linear-gradient(45deg, #1f2937, #4B5563);
 -webkit-background-clip: text;
 -webkit-text-fill-color: transparent;
}
</style>