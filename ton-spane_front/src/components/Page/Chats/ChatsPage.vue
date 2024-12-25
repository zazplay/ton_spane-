<template>
  <div class="common-layout" style="width: 100%;">
    <el-container>
      <el-header>
        <el-container class="container-header">
          <el-icon class="back-arrow" @click="goBack">
            <ArrowLeftBold />
          </el-icon>
          <el-text style="font-size: 25px; align-self: center;">Чаты</el-text>
          <el-icon>
            <!-- <Edit /> -->
          </el-icon>
        </el-container>
      </el-header>

      <el-main>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="Все" name="all" style="color: white;">
            <ChatPrev 
              v-for="chat in chats" 
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
      <MessageUser />
    </el-container>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import ChatPrev from './ChatPreview.vue';
import { ArrowLeftBold } from '@element-plus/icons-vue';


export default {
  name: 'ChatView',
  components: {
    ChatPrev,
    ArrowLeftBold,
    // Edit
  },
  setup() {
    const store = useStore();
    const userId = computed(() => store.getters.getSub);
    const chats = ref([]);
    const userType = ref(sessionStorage.getItem('userType') || '');

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
      userType // Возвращаем userType чтобы использовать в template
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
.container-header {
  display: flex;
  justify-content: space-between;
  color: white;
  width: 100%;
  margin-top: 1em;
  font-size: x-large;
}

.demo-tabs>.el-tabs__content {
  margin-top: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.demo-tabs :deep(.el-tabs__header) {
  width: 90%;
  margin: 0 auto;
}
</style>