<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="modal-overlay"
      @click="closeModal"
    >
      <div 
        class="modal-container"
        @click.stop
      >
        <div class="modal-header">
          <h3>Поделиться</h3>
          <button class="close-btn" @click="closeModal">
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="share-actions">
            <button 
              class="share-btn instagram"
              @click="shareToSocial('instagram')"
            >
              <svg viewBox="0 0 24 24" class="instagram-icon">
                <path fill="currentColor" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
              </svg>
              <span>Instagram</span>
            </button>

            <button 
              class="share-btn telegram"
              @click="shareToSocial('telegram')"
            >
              <el-icon><Promotion /></el-icon>
              <span>Telegram</span>
            </button>

            <button 
              class="share-btn email"
              @click="shareToSocial('email')"
            >
              <el-icon><Message /></el-icon>
              <span>Email</span>
            </button>
          </div>

          <div class="link-container">
            <input 
              type="text" 
              :value="shareLink" 
              readonly 
              ref="linkInput"
              class="link-input"
            >
            <button class="copy-btn" @click="copyLink">
              <el-icon><CopyDocument /></el-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Message, CopyDocument, Promotion, Close,defineProps,defineEmits } from '@element-plus/icons-vue'

const props = defineProps({
  dialogVisible: { type: Boolean, required: true }
})

const emit = defineEmits(['update:dialogVisible'])
const shareLink = 'https://example.com/share/123'
const linkInput = ref(null)

const isOpen = computed({
  get: () => props.dialogVisible,
  set: (value) => emit('update:dialogVisible', value)
})

const closeModal = () => {
  isOpen.value = false
}

const shareToSocial = (platform) => {
  const urls = {
    instagram: `https://instagram.com/share?url=${encodeURIComponent(shareLink)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareLink)}`,
    email: `mailto:?subject=Check this out&body=${encodeURIComponent(shareLink)}`
  }
  window.open(urls[platform], '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink)
    ElMessage({ 
      message: 'Ссылка скопирована', 
      type: 'success',
      offset: 60
    })
  } catch {
    ElMessage({ 
      message: 'Ошибка копирования', 
      type: 'error',
      offset: 60
    })
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: Arial, Helvetica, sans-serif;
}

.modal-container {
  position: fixed;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
  background: var(--el-bg-color);
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  animation: modalAppear 0.2s ease-out;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.close-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--el-fill-color-light);
}

.modal-body {
  padding: 20px;
}

.share-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.share-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition: all 0.2s;
}

.share-btn:hover {
  background: var(--el-fill-color);
  transform: translateY(-2px);
}

.share-btn .el-icon,
.instagram-icon {
  font-size: 24px;
  width: 24px;
  height: 24px;
}

.share-btn span {
  font-size: 12px;
  font-weight: 500;
}

.instagram {
  color: #E1306C;
}

.telegram {
  color: #0088cc;
}

.email {
  color: #4CAF50;
}

.link-container {
  display: flex;
  gap: 8px;
  background: var(--el-fill-color-light);
  padding: 4px;
  border-radius: 8px;
}

.link-input {
  flex: 1;
  border: none;
  background: none;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  outline: none;
}

.copy-btn {
  background: var(--el-color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  width: 36px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn:hover {
  opacity: 0.9;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@media (max-width: 480px) {
  .modal-container {
    width: 85%;
  }

  .modal-header {
    padding: 12px 16px;
  }

  .modal-header h3 {
    font-size: 16px;
  }

  .modal-body {
    padding: 16px;
  }

  .share-btn {
    padding: 10px;
  }

  .share-btn .el-icon,
  .instagram-icon {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  .share-btn span {
    font-size: 11px;
  }

  .link-input {
    font-size: 13px;
  }

  .copy-btn {
    width: 32px;
  }
}
</style>