# ChatPreview.vue
<template>
  <el-card
    v-if="isVisible"
    style="margin-bottom: 16px; cursor: pointer;"
    shadow="hover"
    @click="openChatModal"
  >
    <div style="display: flex; align-items: center; gap: 16px;">
      <el-avatar
        :size="48"
        :src="avatarUrl"
      >
        <template #default>
          <el-icon><User /></el-icon>
        </template>
      </el-avatar>
      
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <el-text size="large" style="font-weight: 500;">{{ username }}</el-text>
          <el-text type="info" size="small">{{ timestamp }}</el-text>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <el-text 
            style="color: var(--el-text-color-secondary); width: 70%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
            truncated
          >
            {{ lastMessageText }}
          </el-text>
          
          <el-badge
            v-if="unreadCount"
            :value="unreadCount"
            type="primary"
          />
        </div>
      </div>
    </div>
  </el-card>

  <UsersChat
    v-if="showChat"
    :show="showChat"
    :chat-id="chatId"
    :username="username"
    :avatar-url="avatarUrl"
    :is-online="isOnline"
    @update:show="showChat = false"
  />
</template>

<script setup>
/* eslint-disable */
import { ref } from 'vue'
import { User } from '@element-plus/icons-vue'
import UsersChat from './UsersChat.vue'

defineProps({
  chatId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  timestamp: {
    type: String,
    required: true
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  isOnline: {
    type: Boolean,
    default: true
  }
})

const isVisible = ref(true)
const showChat = ref(false)
const lastMessageText = ref('Начните общение')

const openChatModal = () => {
  showChat.value = true
}
</script>