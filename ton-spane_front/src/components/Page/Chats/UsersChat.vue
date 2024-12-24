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
                {{ isOnline ? 'Онлайн' : 'Оффлайн' }}
              </span>
            </div>
          </div>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <div v-if="isLoading" class="loading-messages">
            Загрузка сообщений...
          </div>
          <template v-else>
            <div v-for="message in messages" 
                 :key="message.id" 
                 class="message" 
                 :class="{ 'message-sent': message.sender === username, 'message-received': message.sender !== username }">
              <div class="message-content">
                <p class="message-text">{{ message.text }}</p>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
            </div>
          </template>
        </div>

        <div class="chat-input">
          <el-input
            v-model="messageText"
            type="textarea"
            :rows="2"
            placeholder="Введите сообщение..."
            @keyup.enter.prevent="sendMessage"
            class="chat-input-field"
          />
          <button class="send-button" @click="sendMessage">Отправить</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, onUnmounted, nextTick } from 'vue'
import { ElAvatar, ElInput } from 'element-plus'
import { io } from 'socket.io-client'
import axios from 'axios'

// Определяем реактивные переменные
const socket = ref(null)
const messageText = ref('')
const messages = ref([])
const messagesContainer = ref(null)
const isLoading = ref(false)

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

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleMessage = (message) => {
  if (message && message.content) {
    messages.value.push({
      id: Date.now(),
      text: message.content,
      sender: message.senderId,
      timestamp: new Date().toISOString()
    })
    scrollToBottom()
  }
}

const sendMessage = () => {
  if (messageText.value.trim()) {
    const messageData = {
      chatId: props.chatId,
      senderId: props.username,
      senderType: "user",
      content: messageText.value.trim()
    }
    
    // Отправляем сообщение через сокет
    socket.value.emit('sendMessage', messageData)
    
    // Очищаем поле ввода
    messageText.value = ''
  }
}

const handleClose = () => {
  emit('update:show', false)
  emit('close')
}

// Загрузка истории сообщений
const loadChatHistory = async () => {
  try {
    isLoading.value = true
    const response = await axios.get(`https://ton-back-e015fa79eb60.herokuapp.com/api/chats/${props.chatId}/messages`)
    
    if (response.data) {
      messages.value = response.data.map(msg => ({
        id: msg.id || Date.now(),
        text: msg.content,
        sender: msg.senderId,
        timestamp: msg.timestamp || new Date().toISOString()
      }))
      scrollToBottom()
    }
  } catch (error) {
    console.error('Error loading chat history:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Загружаем историю сообщений
  await loadChatHistory()
  
  // Инициализируем socket подключение
  socket.value = io('https://ton-back-e015fa79eb60.herokuapp.com', {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  })
  
  // Обработка событий подключения
  socket.value.on('connect', () => {
    console.log('Connected to socket server')
    socket.value.emit('joinChat', { chatId: props.chatId })
  })

  socket.value.on('connect_error', (error) => {
    console.error('Connection error:', error)
  })

  socket.value.on('disconnect', (reason) => {
    console.log('Disconnected:', reason)
  })
  
  // Слушаем новые сообщения
  socket.value.on('message', (message) => {
    console.log('Received message:', message)
    handleMessage(message)
  })
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('message', handleMessage)
    socket.value.disconnect()
  }
})
</script>




<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.chat-modal {
  width: 50%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border-radius: 30px;
  transform: translateY(0);
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Темная тема */
html.dark .chat-modal {
  background: #161b22;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

html.dark .modal-header,
html.dark .chat-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

html.dark .modal-header h2 {
  color: #e6edf3;
}

html.dark .close-button {
  color: #8b949e;
}

html.dark .close-button:hover {
  color: #e6edf3;
  background: rgba(255, 255, 255, 0.1);
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



/* Светлая тема */
html:not(.dark) .chat-modal {
  background: #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

html:not(.dark) .modal-header,
html:not(.dark) .chat-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: #f8fafc;
}

html:not(.dark) .modal-header h2 {
  color: #1f2937;
}

html:not(.dark) .close-button {
  color: #6b7280;
}

html:not(.dark) .close-button:hover {
  color: #1f2937;
  background: rgba(0, 0, 0, 0.05);
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



/* Общие стили */
.modal-header {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  border-radius: 30px 30px 0 0;
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
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.chat-header {
  padding: 16px 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chat-avatar {
  border: 2px solid rgba(0, 180, 219, 0.3);
  box-shadow: 0 0 20px rgba(0, 180, 219, 0.2);
  background-image: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  
  :deep(.el-avatar--circle) {
    background-image: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  }
}

.chat-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(0, 180, 219, 0.3);
}

.user-status {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.status {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status.online::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #34d399;
  border-radius: 50%;
  margin-right: 4px;
}

.chat-messages {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  height: calc(100vh - 400px);
  transition: all 0.3s ease;
  scroll-behavior: smooth;
}

.message {
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  max-width: fit-content;
  animation: messageAppear 0.3s ease;
}

@keyframes messageAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-sent {
  align-self: self-end;
  margin-left: auto; /* Добавляем для гарантии позиционирования справа */

}

.message-received {
  align-self: flex-start;
  margin-right: auto; /* Добавляем для гарантии позиционирования слева */

}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  transition: all 0.3s ease;
}

.message-sent .message-content {
  background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 15px rgba(0, 180, 219, 0.2);
}

.message-received .message-content {
  background: #f0f0f0;
  color: #1f2937;
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

html.dark .message-received .message-content {
  background: #1f2937;
  color: #e6edf3;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.message-text {
  margin: 0;
  word-wrap: break-word;
  line-height: 1.5;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 6px;
  display: block;
}

.loading-messages {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #6b7280;
  font-size: 0.875rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

html.dark .loading-messages {
  color: #8b949e;
}

.chat-input {
  max-height: 50px;
  padding: 20px 24px;
  display: flex;
  gap: 16px;
  transition: all 0.3s ease;
  border-radius: 0 0 30px 30px;
}

.chat-input-field {
  flex: 1;

  :deep(.el-textarea__inner) {
    border-radius: 16px;
    resize: none;
    font-family: inherit;
    font-size: 0.975rem;
    line-height: 1.5;
    transition: all 0.3s ease;
    padding: 12px 16px;
    min-height: 24px;
    max-height: 30px;
  }

  :deep(.el-input__wrapper) {
    box-shadow: none !important;
    background-color: transparent;
  }
}

.send-button {
  padding: 12px 24px;
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}

.send-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  
  transition: 0.5s;
}

.send-button:hover {
  background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  transform: translateY(-2px);
}

.send-button:hover::before {
  left: 100%;
}

.send-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
}

/* Темная тема */
html.dark .send-button {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

html.dark .send-button:hover {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
}

@media (max-width: 768px) {
  .chat-modal {
    width: 90%;
    height: 80vh;
    margin: 20px;
  }
  
  .chat-messages {
    height: calc(80vh - 260px);
  }
  
  .modal-header,
  .chat-header,
  .chat-input {
    padding: 12px 10px;
  }
  
  .send-button {
    padding: 10px 20px;
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .chat-modal {
    width: 100%;
    height: 100vh;
    margin: 0;
    border-radius: 0;
  }
  
  .modal-header {
    border-radius: 0;
  }
  
  .chat-messages {
    height: calc(100vh - 180px);
  }
  
  .message {
    max-width: 85%;
  }
}
</style>