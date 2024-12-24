<template>
  <el-card
    class="chat-preview"
    shadow="never"
    @click="openChatModal"
  >
    <div class="preview-container">
      <div class="avatar-container">
        <el-avatar
          :size="52"
          :src="avatarUrl"
          class="avatar-wrapper"
        >
          <template #default>
            <el-icon><User /></el-icon>
          </template>
        </el-avatar>
        
      </div>
      
      <div class="chat-content">
        <div class="chat-header">
          <div class="name-container">
            <el-text class="username" size="large">{{ username }}</el-text>
            <el-icon 
              v-if="isPinned" 
              class="pinned-icon" 
              :size="16"
            >
              <Position />
            </el-icon>
          </div>
          <el-text class="timestamp" type="info" size="small">{{ timestamp }}</el-text>
        </div>
        
        <div class="chat-footer">
          <el-text class="message-preview" truncated>
            {{ lastMessage }}
          </el-text>
          
          <el-badge
            v-if="unreadCount"
            :value="unreadCount"
            class="unread-badge"
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
    @update:show="showChat = $event"
  />
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { User, Position } from '@element-plus/icons-vue'
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
  isOnline: {
    type: Boolean,
    default: true
  },
  lastMessage: {
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
  isPinned: {
    type: Boolean,
    default: false
  }
})

const showChat = ref(false)

const openChatModal = () => {
  showChat.value = true
}
</script>

<style scoped>
.chat-preview {
  width: 94%;
  margin: 16px auto;
  cursor: pointer;
  border-radius: 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

/* Темная тема */
html.dark .chat-preview {
  background: linear-gradient(145deg, #1a1f25, #161b22);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

html.dark .chat-preview:hover {
  background: linear-gradient(145deg, #1c2128, #1a1f25);
  transform: translateY(-2px) scale(1.01);
  border-color: rgba(99, 102, 241, 0.1);
}

html.dark .username {
  color: #f3f4f6;
}

html.dark .timestamp,
html.dark .message-preview {
  color: #9ca3af;
}

html.dark .status-indicator {
  border: 2px solid #161b22;
}

/* Светлая тема */
html:not(.dark) .chat-preview {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

html:not(.dark) .chat-preview:hover {
  background: linear-gradient(145deg, #f8fafc, #f1f5f9);
  transform: translateY(-2px) scale(1.01);
  border-color: rgba(99, 102, 241, 0.1);
}

html:not(.dark) .username {
  color: #111827;
}

html:not(.dark) .timestamp,
html:not(.dark) .message-preview {
  color: #6b7280;
}

/* Общие стили */
.preview-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.avatar-wrapper {
  background: linear-gradient(145deg, #6366f1, #4f46e5);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.avatar-wrapper:hover {
  transform: scale(1.05);
  border-color: rgba(99, 102, 241, 0.2);
}

.status-indicator {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.status-indicator.online {
  background: linear-gradient(145deg, #34d399, #059669);
  box-shadow: 0 2px 4px rgba(52, 211, 153, 0.3);
}

.status-indicator.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(52, 211, 153, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
  }
}

.chat-content {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.name-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-weight: 600;
  position: relative;
  transition: all 0.3s ease;
}

.username::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: linear-gradient(90deg, #6366f1, #4f46e5);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.chat-preview:hover .username::after {
  width: 100%;
}

.pinned-icon {
  color: #6366f1;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.chat-preview:hover .pinned-icon {
  transform: rotate(45deg);
  opacity: 1;
}

.timestamp {
  font-size: 0.85em;
  font-weight: 500;
  transition: color 0.3s ease;
}

.chat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.message-preview {
  flex: 1;
  font-size: 0.95em;
  transition: color 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  :deep(.el-badge__content) {
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    font-size: 0.85em;
    font-weight: 600;
    background: linear-gradient(145deg, #6366f1, #4f46e5);
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
    transition: all 0.3s ease;
  }
}

.unread-badge:hover :deep(.el-badge__content) {
  transform: scale(1.1);
}

@media (max-width: 580px) {
  .chat-preview {
    width: 96%;
    margin: 12px auto;
  }
  
  .preview-container {
    padding: 12px 14px;
  }
  
  .avatar-wrapper {
    width: 46px;
    height: 46px;
  }
  
  .status-indicator {
    width: 12px;
    height: 12px;
  }
  
  .username {
    font-size: 0.95em;
  }
  
  .timestamp,
  .message-preview {
    font-size: 0.85em;
  }
}
</style>