<template>
  <div  >
    <el-container>
      <el-header style="padding: 10px 20px; border-bottom: 1px solid var(--el-border-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100% !important;">
          <el-icon style="cursor: pointer" @click="handleClose">
            <ArrowLeftBold />
          </el-icon>
          <span style="font-size: 20px; font-weight: 500;">Чаты</span>
          <div style="width: 20px"></div>
        </div>
      </el-header>

      <el-main style="padding: 20px;">
        <el-input
          v-model="searchQuery"
          placeholder="Поиск чатов..."
          :prefix-icon="Search"
          clearable
          style="margin-bottom: 20px;"
        />

        <el-tabs v-model="activeName">
          <el-tab-pane label="Все" name="all">
            <ChatPreview
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
              :is-online="true"
              :unread-count="0"
            />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, onMounted } from 'vue';
import ChatPreview from './ChatPreview.vue';
import { ArrowLeftBold, Search } from '@element-plus/icons-vue';

const props = defineProps({
  modelId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

const chats = ref([]);
const searchQuery = ref('');
const activeName = ref('all');
const userType = ref('model');

const handleClose = () => {
  emit('close');
};

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
    const response = await fetch(
      `https://ton-back-e015fa79eb60.herokuapp.com/api/chats/model/${props.modelId}`
    );
    if (!response.ok) throw new Error('Failed to fetch chats');
    const data = await response.json();
    chats.value = data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    chats.value = [];
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

onMounted(() => {
  fetchChats();
});
</script>

<style scoped>
.el-header {
  background-color: var(--el-bg-color);
  
}

.el-main {
  background-color: var(--el-bg-color-page);
  
}
</style>