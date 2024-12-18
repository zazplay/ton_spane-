<template>
    <div class="layout-container">
      <!-- Fixed Navigation Menu -->
      <nav class="fixed-tabs">
        <el-menu 
          :default-active="activeTab" 
          mode="horizontal" 
          @select="handleTabSelect"
        >
          <el-menu-item v-for="tab in tabs" 
            :key="tab.id" 
            :index="tab.id"
          >
            {{ tab.label }}
          </el-menu-item>
        </el-menu>
      </nav>
  
      <!-- Main Content Area -->
      <main class="content">
        <component 
          :is="currentComponent"
          :selectedUser="selectedUser"
          @user-selected="handleUserSelect"
        />
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import ProfilesForAp from './Models/ProfilesForAP.vue'
  import ModelsPage from './Models/ModelsPage.vue'
  import PostsAP from './PostsAP.vue'
  
  // State
  const activeTab = ref('users')
  const selectedUser = ref(null)
  
  // Tabs Configuration
  const tabs = [
    { id: 'users', label: 'Пользователи', component: ProfilesForAp },
    { id: 'models', label: 'Модели', component: ModelsPage },
    { id: 'posts', label: 'Посты', component: PostsAP }
  ]
  
  // Computed
  const currentComponent = computed(() => {
    const tab = tabs.find(t => t.id === activeTab.value)
    return tab?.component
  })
  
  // Event Handlers
  const handleTabSelect = (tabId) => {
    activeTab.value = tabId
    selectedUser.value = null // Reset selected user when changing tabs
  }
  
  const handleUserSelect = (userId) => {
    selectedUser.value = userId
  }
  </script>
  
  <style scoped>
  .layout-container {
    width: 80vw;
    margin: 0 auto;
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .fixed-tabs {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    width: 80vw;
    background-color: rgb(22, 22, 22);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .content {
    padding: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  /* Responsive Styles */
  @media (max-width: 1200px) {
    .layout-container,
    .fixed-tabs {
      width: 100%;
    }
  
    .content {
      padding-top: 0;
      max-width: 100%;
    }
  }
  </style>