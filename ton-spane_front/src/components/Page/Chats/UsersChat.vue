# UsersChat.vue
<template>
  <teleport to="body">
    <div v-if="show" class="modal-overlay">
      <div class="chat-modal">
        <div class="modal-header">
          <h2>{{ username }}</h2>
          <button class="close-button" @click="handleClose">&times;</button>
        </div>

        <div class="chat-header">
          <div class="user-info">
            <el-avatar
              :size="40"
              :src="avatarUrl"
              class="chat-avatar"
            >
              <template #default>
                {{ username.charAt(0).toUpperCase() }}
              </template>
            </el-avatar>
            <div class="user-status">
              <span class="username">{{ username }}</span>
              <span class="status" :class="{ 'online': isOnline }">
                {{ isOnline ? 'Online' : 'Offline' }}
              </span>
            </div>
          </div>
        </div>

        <div class="chat-messages">
          <div class="message-placeholder">
            Chat ID: {{ chatId }}
          </div>
        </div>

        <div class="chat-input">
          <el-input
            v-model="messageText"
            type="textarea"
            :rows="3"
            placeholder="Type a message..."
            @keyup.enter="sendMessage"
            class="chat-input-field"
          />
          <button class="send-button" @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { ElAvatar, ElInput } from 'element-plus'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
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
    default: false
  }
})

const emit = defineEmits(['update:show', 'close'])

const messageText = ref('')

const handleClose = () => {
  emit('update:show', false)
  emit('close')
}

const sendMessage = () => {
  if (messageText.value.trim()) {
    console.log('Sending message:', messageText.value, 'to chat:', props.chatId)
    messageText.value = ''
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.chat-modal {
  width: 50%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  border-radius: 30px;
}

/* Темная тема */
html.dark .chat-modal {
  background: #161b22;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

html.dark .modal-header,
html.dark .chat-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark .modal-header h2 {
  color: #e6edf3;
}

html.dark .close-button {
  color: #8b949e;
}

html.dark .close-button:hover {
  color: #e6edf3;
}

html.dark .username {
  color: #e6edf3;
}

html.dark .status {
  color: #8b949e;
}

html.dark .chat-messages {
  background: #0d1117;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark .message-placeholder {
  color: #8b949e;
}

html.dark .chat-input {
  background: #161b22;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark textarea {
  background: #0d1117;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e6edf3;
}

html.dark textarea:focus {
  border-color: #00b4db;
  box-shadow: 0 0 0 2px rgba(0, 180, 219, 0.2);
}

html.dark .send-button {
  background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  box-shadow: 0 4px 15px rgba(0, 180, 219, 0.3);
}

html.dark .send-button:hover {
  background: linear-gradient(135deg, #00d2ff 0%, #00b4db 100%);
  box-shadow: 0 6px 20px rgba(0, 180, 219, 0.4);
}

/* Светлая тема */
html:not(.dark) .chat-modal {
  background: #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

html:not(.dark) .modal-header,
html:not(.dark) .chat-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

html:not(.dark) .modal-header h2 {
  color: #1f2937;
}

html:not(.dark) .close-button {
  color: #6b7280;
}

html:not(.dark) .close-button:hover {
  color: #1f2937;
}

html:not(.dark) .username {
  color: #1f2937;
}

html:not(.dark) .status {
  color: #6b7280;
}

html:not(.dark) .chat-messages {
  background: #f9fafb;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

html:not(.dark) .message-placeholder {
  color: #6b7280;
}

html:not(.dark) .chat-input {
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

html:not(.dark) textarea {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #1f2937;
}

html:not(.dark) textarea:focus {
  border-color: #00b4db;
  box-shadow: 0 0 0 2px rgba(0, 180, 219, 0.2);
}

html:not(.dark) .send-button {
  background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  box-shadow: 0 4px 15px rgba(0, 180, 219, 0.3);
}

html:not(.dark) .send-button:hover {
  background: linear-gradient(135deg, #00d2ff 0%, #00b4db 100%);
  box-shadow: 0 6px 20px rgba(0, 180, 219, 0.4);
}

/* Общие стили */
.modal-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.3s ease;
}

.chat-header {
  padding: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  border: 2px solid rgba(0, 180, 219, 0.3);
  box-shadow: 0 0 20px rgba(0, 180, 219, 0.2);
  background-image: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  color: white;
  font-weight: 600;
  
  :deep(.el-avatar--circle) {
    background-image: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  }
}

.user-status {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  transition: all 0.3s ease;
}

.status {
  font-size: 0.875rem;
}

.status.online {
  color: #34d399;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  height: calc(100vh - 400px);
  transition: all 0.3s ease;
}

.message-placeholder {
  text-align: center;
  padding: 20px;
}

.chat-input {
  padding: 16px;
  display: flex;
  gap: 12px;
  transition: all 0.3s ease;
  border-radius: 20px;

}

.chat-input-field {
  flex: 1;

  :deep(.el-textarea__inner) {
    border-radius: 8px;
    resize: none;
    font-family: inherit;
    font-size: 0.875rem;
    line-height: 1.5;
    transition: all 0.3s ease;
    padding: 8px 12px;
  }

  :deep(.el-input__wrapper) {
    box-shadow: none !important;
    background-color: transparent;
  }

  html.dark & :deep(.el-textarea__inner) {
    background: #0d1117;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #e6edf3;

    &:focus {
      border-color: #00b4db;
      box-shadow: 0 0 0 2px rgba(0, 180, 219, 0.2);
    }
  }

  html:not(.dark) & :deep(.el-textarea__inner) {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    color: #1f2937;

    &:focus {
      border-color: #00b4db;
      box-shadow: 0 0 0 2px rgba(0, 180, 219, 0.2);
    }
  }
}

.send-button {
  padding: 8px 16px;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button:hover {
  transform: translateY(-1px);
}

.send-button:active {
  transform: translateY(1px);
}

@media (max-width: 580px) {
  .chat-modal {
    width: 90%;
    height: 700px;
    margin-bottom: 100px;
  }
  
  .chat-messages {
    height: calc(100vh - 300px);
  }
  
  .avatar {
    width: 40px;
    height: 40px;
  }
  
  .username {
    font-size: 14px;
  }
  
  .status {
    font-size: 12px;
  }
  
  .send-button {
    padding: 8px 12px;
    font-size: 14px;
  }
}
</style>