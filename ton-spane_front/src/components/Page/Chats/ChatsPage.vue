<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <el-container class="container-header">
          <el-icon class="back-arrow" @click="goBack">
            <ArrowLeftBold />
          </el-icon>
          <el-text class="header-title">Чаты</el-text>
          <el-icon class="placeholder-icon">
            <!-- <Edit /> -->
          </el-icon>
        </el-container>
      </el-header>

      <el-main class="main-content">
        <!-- Search Input -->
        <div class="search-container">
          <el-input
            v-model="searchQuery"
            placeholder="Поиск чатов..."
            class="search-input"
            :prefix-icon="Search"
            clearable
          />
        </div>

        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="Все" name="all">
            <ChatPrev
              v-for="chat in filteredChats"
              :key="chat.id"
              :chat-id="chat.id"
              :username="userType === 'model' ? 
                (chat.user.username || chat.user.email) : 
                (chat.model.username || 'Пользователь')"
              :avatar-url="userType === 'model' ? 
                (chat.user.profilePicture || '/default-avatar.png') : 
                (chat.model.profilePicture || '/default-avatar.png')"
              :timestamp="formatDate(chat.createdAt)"
              last-message="Начните общение"
              :is-online="true"
              :unread-count="0"
              :is-pinned="false"
            />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <el-container>
   </el-container>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import ChatPrev from './ChatPreview.vue';
import { ArrowLeftBold, Search } from '@element-plus/icons-vue';

export default {
  name: 'ChatView',
  components: {
    ChatPrev,
    ArrowLeftBold
    
  },
  setup() {
    const store = useStore();
    const userId = computed(() => store.getters.getSub);
    const chats = ref([]);
    const userType = ref(sessionStorage.getItem('userType') || '');
    const searchQuery = ref('');

    const filteredChats = computed(() => {
      if (!searchQuery.value) return chats.value;
      
      const query = searchQuery.value.toLowerCase();
      return chats.value.filter(chat => {
        const username = userType.value === 'model' 
          ? (chat.user.username || chat.user.email)
          : (chat.model.username || 'Пользователь');
        return username.toLowerCase().includes(query);
      });
    });

    const fetchChats = async () => {
      try {
        const endpoint = userType.value === "user"
          ? `https://ton-back-e015fa79eb60.herokuapp.com/api/chats/user/${userId.value}`
          : `https://ton-back-e015fa79eb60.herokuapp.com/api/chats/model/${userId.value}`;

        const response = await fetch(endpoint);
        const data = await response.json();
        chats.value = data;
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    onMounted(() => {
      userType.value = sessionStorage.getItem('userType');
      fetchChats();
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    return {
      chats,
      formatDate,
      userType,
      searchQuery,
      filteredChats,
      Search
    };
  },
  data() {
    return {
      activeName: 'all'
    };
  },
  methods: {
    handleClick(tab) {
      console.log(tab);
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.common-layout {
  width: 100%;
  height: 100vh;
}

/* Базовые стили */
.header {
  padding: 0 20px;
  transition: all 0.3s ease;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  background-color: transparent !important;
  border-radius: 15px;

}

.container-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 0px;
  background: transparent;
  
}

.header-title {
  font-size: 25px;
  font-weight: 500;
  transition: color 0.3s ease;
  font-weight: 600 !important;


}

.back-arrow {
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
}

.back-arrow:hover {
  transform: translateX(-2px);
}

.placeholder-icon {
  width: 20px;
}

.main-content {
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  padding: 0 5%;
}

.search-input {
  width: 100%;
  background: transparent;
  border-radius: 16px;
}

/* Темная тема */
html.dark .header {
  background: linear-gradient(145deg, #1a1f25, #161b22);
  border-bottom-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

html.dark .container-header {
  color: #e6edf3;
}

html.dark .header-title {
  color: #e6edf3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

html.dark .back-arrow {
  color: #e6edf3;
}

html.dark .search-input :deep(.el-input__wrapper) {
  background: linear-gradient(145deg, #1a1f25, #161b22);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

html.dark .search-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

html.dark .search-input :deep(.el-input__inner) {
  color: #e6edf3;
}

html.dark .search-input :deep(.el-input__prefix-icon) {
  color: #8b949e;
}

/* Светлая тема */
html:not(.dark) .header {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-bottom-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

html:not(.dark) .container-header {
  color: #1f2937;
}

html:not(.dark) .header-title {
  color: #1f2937;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

html:not(.dark) .back-arrow {
  color: #1f2937;
}

html:not(.dark) .search-input :deep(.el-input__wrapper) {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

html:not(.dark) .search-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

html:not(.dark) .search-input :deep(.el-input__inner) {
  color: #1f2937;
}

html:not(.dark) .search-input :deep(.el-input__prefix-icon) {
  color: #6b7280;
}

/* Медиа-запросы */
@media (max-width: 480px) {
  .header {
    padding: 0 15px;
  }

  .header-title {
    font-size: 20px;
  }

  .search-container {
    padding: 0 3%;
  }

  .main-content {
    padding: 15px;
  }
}/* Базовые стили */
.header {
  padding: 0 20px;
  transition: all 0.3s ease;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

.container-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 0px;
}

.header-title {
  font-size: 25px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.back-arrow {
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
}

.back-arrow:hover {
  transform: translateX(-2px);
}

.placeholder-icon {
  width: 20px;
}

.main-content {
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  padding: 0 5%;
}

.search-input {
  width: 100%;
  background: transparent;
  border-radius: 16px;
}

/* Темная тема */
html.dark .header {
  background: linear-gradient(145deg, #1a1f25, #161b22);
  border-bottom-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

html.dark .container-header {
  color: #e6edf3;
}

html.dark .header-title {
  color: #e6edf3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

html.dark .back-arrow {
  color: #e6edf3;
}

html.dark .search-input :deep(.el-input__wrapper) {
  background: linear-gradient(145deg, #1a1f25, #161b22);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

html.dark .search-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

html.dark .search-input :deep(.el-input__inner) {
  color: #e6edf3;
}

html.dark .search-input :deep(.el-input__prefix-icon) {
  color: #8b949e;
}

/* Светлая тема */
html:not(.dark) .header {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-bottom-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

html:not(.dark) .container-header {
  color: #1f2937;
}

html:not(.dark) .header-title {
  color: #1f2937;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

html:not(.dark) .back-arrow {
  color: #1f2937;
}

html:not(.dark) .search-input :deep(.el-input__wrapper) {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

html:not(.dark) .search-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

html:not(.dark) .search-input :deep(.el-input__inner) {
  color: #1f2937;
}

html:not(.dark) .search-input :deep(.el-input__prefix-icon) {
  color: #6b7280;
}

/* Медиа-запросы */
@media (max-width: 480px) {
  .header {
    padding: 0 15px;
  }

  .header-title {
    font-size: 20px;
  }

  .search-container {
    padding: 0 3%;
  }

  .main-content {
    padding: 15px;
  }
}

.demo-tabs {
  margin-top: 20px;
}

.demo-tabs :deep(.el-tabs__header) {
  width: 90%;
  margin: 0 auto;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

.demo-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: transparent;
}

.demo-tabs :deep(.el-tabs__item) {
  color: #9ca3af;
  font-size: 16px;
  padding: 0 20px;
  transition: all 0.3s ease;
}

.demo-tabs :deep(.el-tabs__item:hover) {
  color: #818cf8;
}

.demo-tabs :deep(.el-tabs__item.is-active) {
  color: #6366f1;
}

.demo-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #6366f1, #4f46e5);
  height: 3px;
  border-radius: 3px;
}

.demo-tabs>.el-tabs__content {
  margin-top: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>