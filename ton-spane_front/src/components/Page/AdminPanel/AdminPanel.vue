<!-- LayoutComponent.vue -->
<template>
  <div class="layout-container">
    <!-- Fixed Navigation Menu -->
    <nav class="fixed-tabs">
      <el-menu
        :default-active="activeTab"
        mode="horizontal"
        @select="handleTabSelect"
        background-color="rgb(22, 22, 22)"
        text-color="#fff"
        active-text-color="#409EFF"
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
        v-if="currentComponent"
        :is="currentComponent"
        :selectedUser="selectedUser"
        :user="selectedUser"
        :showAddButton="true"
        @user-selected="handleUserSelect"
      />
      <div v-else>
        {{ activeTab }} - Компонент не загружен
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, markRaw } from 'vue'
import UsersForAp from './UsersForAP.vue'
import ModelsPage from './Models/ModelsPage.vue'
import PostsAP from './PostsAPAll.vue'
import Clips from './Models/ClipsForAP.vue'

const activeTab = ref('users')
const selectedUser = ref(null)

const tabs = [
  { id: 'users', label: 'Пользователи', component: markRaw(UsersForAp) },
  { id: 'models', label: 'Модели', component: markRaw(ModelsPage) },
  { id: 'posts', label: 'Посты', component: markRaw(PostsAP) },
  { id: 'clips', label: 'Клипы', component: markRaw(Clips) }
]

const currentComponent = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab?.component
})

const handleTabSelect = (tabId) => {
  activeTab.value = tabId
  selectedUser.value = null 
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
  min-height: 100vh;
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
  margin-top: 20px;
}

/* Element Plus overrides */
:deep(.el-menu) {
  width: 100%;
  border-bottom: none !important;
}

:deep(.el-menu-item) {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .layout-container,
  .fixed-tabs {
    width: 100%;
  }

  .content {
    padding: 20px 10px;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .layout-container {
    padding-top: 50px;
  }

  :deep(.el-menu-item) {
    padding: 0 10px;
  }
}
</style>