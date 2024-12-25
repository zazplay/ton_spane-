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
            <Edit />
          </el-icon>
        </el-container>
      </el-header>

      <el-main>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="Все" name="all" style="color: white;"></el-tab-pane>
          <el-tab-pane label="Онлайн" name="Onlin"></el-tab-pane>
          <ChatPrev 
            v-for="chat in chats" 
            :key="chat.id"
            :chat-id="chat.id"
            :username="chat.model.username"
            :avatar-url="chat.model.profilePicture"
            :timestamp="formatDate(chat.createdAt)"
            last-message="Начните общение"
            :is-online="true"
            :unread-count="0"
            :is-pinned="false">
          </ChatPrev>
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
import { ArrowLeftBold, Edit } from '@element-plus/icons-vue';

export default {
  name: 'ChatView',
  components: {
    ChatPrev,
    
    ArrowLeftBold,
    Edit
  },
  setup() {
    const store = useStore();
    const userId = computed(() => store.getters.getSub);
    const chats = ref([]);
    console.log(userId.value);

    const fetchChats = async () => {
      try {
        const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/chats/model/${userId.value}`);
        const data = await response.json();
        chats.value = data;
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    onMounted(() => {
      fetchChats();
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    return { chats, formatDate };
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