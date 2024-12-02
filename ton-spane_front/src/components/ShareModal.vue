<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Message, CopyDocument, Promotion, defineProps, defineEmits  } from '@element-plus/icons-vue'

const props = defineProps({
  dialogVisible: { type: Boolean, required: true }
})

const emit = defineEmits(['update:dialogVisible'])
const shareLink = ref('https://example.com/share/123')

// v-model для диалога
const isOpen = computed({
  get: () => props.dialogVisible,
  set: (value) => emit('update:dialogVisible', value)
})

// Обработка шеринга в соцсети
const shareToSocial = (platform) => {
  const urls = {
    instagram: `https://instagram.com/share?url=${encodeURIComponent(shareLink.value)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareLink.value)}`,
    email: `mailto:?subject=Check this out&body=${encodeURIComponent(shareLink.value)}`
  }
  window.open(urls[platform], '_blank')
}

// Копирование ссылки
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    ElMessage({ message: 'Ссылка скопирована', type: 'success' })
  } catch {
    ElMessage({ message: 'Ошибка копирования', type: 'error' })
  }
}
</script>

<template>
  <el-dialog
    v-model="isOpen"
    title="Поделиться"
    width="500px"
    :show-close="true"
    :lock-scroll="false"
  >
    <div class="share-options">
      <!-- Кнопки соцсетей -->
      <el-row :gutter="20" justify="center">
        <!-- Instagram -->
        <el-col :span="8">
          <el-button 
            circle 
            class="social-button"
            @click="shareToSocial('instagram')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0,0,260,260">
              <g fill="#22c3e6" transform="scale(5.12,5.12)">
                <path d="M16,3c-7.16752,0 -13,5.83248 -13,13v18c0,7.16752 5.83248,13 13,13h18c7.16752,0 13,-5.83248 13,-13v-18c0,-7.16752 -5.83248,-13 -13,-13zM16,5h18c6.08648,0 11,4.91352 11,11v18c0,6.08648 -4.91352,11 -11,11h-18c-6.08648,0 -11,-4.91352 -11,-11v-18c0,-6.08648 4.91352,-11 11,-11zM37,11c-1.10457,0 -2,0.89543 -2,2c0,1.10457 0.89543,2 2,2c1.10457,0 2,-0.89543 2,-2c0,-1.10457 -0.89543,-2 -2,-2zM25,14c-6.06329,0 -11,4.93671 -11,11c0,6.06329 4.93671,11 11,11c6.06329,0 11,-4.93671 11,-11c0,-6.06329 -4.93671,-11 -11,-11zM25,16c4.98241,0 9,4.01759 9,9c0,4.98241 -4.01759,9 -9,9c-4.98241,0 -9,-4.01759 -9,-9c0,-4.98241 4.01759,-9 9,-9z"/>
              </g>
            </svg>
          </el-button>
        </el-col>
        
        <!-- Telegram -->
        <el-col :span="8">
          <el-button 
            circle 
            class="social-button"
            @click="shareToSocial('telegram')"
          >
            <el-icon size="35px"><Promotion /></el-icon>
          </el-button>
        </el-col>
        
        <!-- Email -->
        <el-col :span="8">
          <el-button 
            circle 
            type="info"
            class="social-button"
            @click="shareToSocial('email')"
          >
            <el-icon size="35px"><Message /></el-icon>
          </el-button>
        </el-col>
      </el-row>

      <!-- Поле с ссылкой -->
      <el-row :gutter="20" class="link-row">
        <el-col :span="24">
          <el-input
            v-model="shareLink"
            placeholder="Ссылка для sharing"
            readonly
          >
            <template #append>
              <el-button @click="copyLink">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<style scoped>
.share-options {
  padding: 10px 0;
}

.social-button {
  height: 70px;
  width: 70px;
}

.link-row {
  margin-top: 20px;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  text-align: center;
  margin-right: 0;
  padding: 15px;
}

.el-button.is-circle {
  padding: 8px;
}

svg {
  vertical-align: middle;
}
</style>