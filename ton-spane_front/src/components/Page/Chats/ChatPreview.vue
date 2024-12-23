<template>
    <el-card 
      class="chat-preview" 
      shadow="never" 
      @click="openChat"
    >
      <div class="preview-container">
        <el-avatar 
          :size="48" 
          src="" 
          class="avatar-wrapper"
        >
          <template #default>
            <el-icon><User /></el-icon>
          </template>
        </el-avatar>
        <div class="status-indicator" :class="{ 'online': isOnline }"></div>
        
        <div class="chat-content">
          <div class="chat-header">
            <el-text class="username" size="large">John Doe</el-text>
            <el-text class="timestamp" type="info" size="small">14:32</el-text>
          </div>
          
          <div class="chat-footer">
            <el-text class="message-preview" truncated>
              The last message preview goes here...
            </el-text>
            
            <div class="indicators">
              <el-badge 
                v-if="unreadCount" 
                :value="unreadCount" 
                class="unread-badge" 
                type="primary"
              />
              <el-icon v-if="isPinned" class="pinned-icon" :size="16">
                <Position />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </template>
  
  <script setup>
  /* eslint-disable */
  // Only import the icons we need
  import { User, Position } from '@element-plus/icons-vue'
  
  // defineProps is automatically available in <script setup>
  const props = defineProps({
    isOnline: {
      type: Boolean,
      default: true
    },
    unreadCount: {
      type: Number,
      default: 3
    },
    isPinned: {
      type: Boolean,
      default: true
    }
  })
  
  // Add eslint-disable-next-line for unused props
  // eslint-disable-next-line no-unused-vars
  const openChat = () => {
    console.log('Opening chat...')
  }
  </script>
  
  <style scoped>
  .chat-preview {
  width: 92%;
  margin: 20px 0 0 30px;
  cursor: pointer;
  border-radius: 20px !important;
  background-color: var(--el-bg-color-page);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chat-preview:hover {
  background-color: var(--el-bg-color-overlay);
}

.preview-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.status-indicator {
  position: absolute;
  left: 48px;
  top: 36px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--el-text-color-disabled);
  border: 2px solid var(--el-bg-color-page);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.status-indicator.online {
  background-color: var(--el-color-success);
}

.chat-content {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.username {
  font-weight: 600;
  margin-right: 8px;
  color: var(--el-text-color-primary);
}

.timestamp {
  white-space: nowrap;
  color: var(--el-text-color-secondary);
  font-size: 0.9em;
}

.chat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-preview {
  flex: 1;
  margin-right: 8px;
  color: var(--el-text-color-secondary);
}

.indicators {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unread-badge :deep(.el-badge__content) {
  min-width: 20px;
}

.pinned-icon {
  color: var(--el-text-color-disabled);
}

:deep(.el-card__body) {
  padding: 12px 16px;
}
@media (max-width: 580px) {
    .chat-preview {
  margin-left: 10px;
  width: 93%;
}
}
  </style>