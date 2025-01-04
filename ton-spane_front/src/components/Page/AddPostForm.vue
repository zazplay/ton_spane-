<template>
    <el-dialog
      style="margin-top: 10px; max-height: 700px;"
      v-model="localDialogVisible"
      title="Создать пост"
      width="90%"
      max-width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :fullscreen="isMobile"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="submitForm"
      >
        <!-- Image Upload -->
        <el-form-item label="Изображение" prop="image">
          <el-upload
            class="upload-container"
            drag
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleImageChange"
            accept="image/*"
          >
            <template v-if="!imageUrl">
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                Перетащите изображение сюда или <em>нажмите для загрузки</em>
              </div>
            </template>
            <template v-else>
              <img :src="imageUrl" class="preview-image" />
            </template>
          </el-upload>
          <el-button 
            v-if="imageUrl" 
            type="danger" 
            size="small" 
            @click="removeImage"
            class="mt-2"
          >
            Удалить изображение
          </el-button>
        </el-form-item>
  
        <!-- Caption -->
        <el-form-item label="Описание" prop="caption">
          <el-input
            v-model="form.caption"
            type="textarea"
            :rows="isMobile ? 2 : 3"
            placeholder="Добавьте описание к вашему посту..."
          />
        </el-form-item>
  
        <!-- Price -->
        <el-form-item label="Цена" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            :step="0.01"
            controls-position="right"
          />
        </el-form-item>
  
        <!-- Blur Toggle -->
        <el-form-item>
          <el-switch
            v-model="form.isBlurred"
            :active-text="isMobile ? 'Размытое' : 'Размытое изображение'"
            :inactive-text="isMobile ? 'Четкое' : 'Четкое изображение'"
          />
        </el-form-item>
      </el-form>
  
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">Отмена</el-button>
          <el-button
            type="primary"
            @click="submitForm"
            :loading="loading"
            :disabled="!imageUrl"
          >
            Опубликовать
          </el-button>
        </div>
      </template>
    </el-dialog>
</template>
  
<script setup>
/* eslint-disable */
import { ref, watch, reactive, onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import config from '@/config'
  
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})
  
const emit = defineEmits(['close'])
  
// Определяем, является ли устройство мобильным
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// Создаем локальную копию для v-model диалога
const localDialogVisible = ref(props.isOpen)
  
// Следим за изменениями props.isOpen
watch(() => props.isOpen, (newValue) => {
  console.log('Props isOpen changed:', newValue)
  localDialogVisible.value = newValue
})
  
// Следим за изменениями localDialogVisible
watch(localDialogVisible, (newValue) => {
  console.log('Dialog visibility changed:', newValue)
  if (!newValue) {
    handleClose()
  }
})
  
const loading = ref(false)
const imageUrl = ref('')
const imageFile = ref(null)
const formRef = ref(null)
  
const form = reactive({
  caption: '',
  price: 0,
  isBlurred: false,
  image: null,
})
  
const rules = {
  caption: [
    { required: true, message: 'Пожалуйста, добавьте описание', trigger: 'blur' },
    { max: 500, message: 'Максимальная длина 500 символов', trigger: 'blur' }
  ],
  image: [
    { required: true, message: 'Пожалуйста, загрузите изображение', trigger: 'change' }
  ]
}
  
const handleImageChange = (file) => {
  if (!file) return
  
  const isImage = file.raw.type.startsWith('image/')
  const isLt5M = file.raw.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('Можно загружать только изображения!')
    return
  }

  if (!isLt5M) {
    ElMessage.error('Размер изображения не должен превышать 5MB!')
    return
  }

  imageFile.value = file.raw
  imageUrl.value = URL.createObjectURL(file.raw)
  form.image = file.raw
}
  
const removeImage = () => {
  imageUrl.value = ''
  imageFile.value = null
  form.image = null
}
  
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.caption = ''
  form.price = 0
  form.isBlurred = false
  removeImage()
}
  
const handleClose = () => {
  resetForm()
  emit('close')
}
  
const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    loading.value = true
    const formData = new FormData()
    formData.append('image', imageFile.value)
    formData.append('caption', form.caption)
    formData.append('price', form.price)
    formData.append('isBlurred', form.isBlurred)
    formData.append('userId', sessionStorage.getItem('userId'))

    const response = await fetch(`${config.API_BASE_URL}/posts`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error('Ошибка при создании поста')

    ElMessage.success('Пост успешно создан!')
    handleClose()
    
  } catch (error) {
    console.error('Error:', error)
    ElMessage.error('Произошла ошибка при создании поста')
  } finally {
    loading.value = false
  }
}
</script>
  
<style scoped>
.upload-container {
  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration);
  width: 100%;
}
  
.upload-container:hover {
  border-color: var(--el-color-primary);
}
  
.preview-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}
  
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

/* Mobile Styles */
@media (max-width: 767px) {

    .upload-container {
        max-height: 200px;
    }
    .preview-image {
        max-height: 200px;
    }
    .dialog-footer {
    
    margin-top: -20px;
    }
  :deep(.el-dialog__body) {
    padding: 16px;
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }
}
  
/* Dark theme adjustments */
:deep(html.dark) .upload-container {
  background: var(--el-bg-color-overlay);
}
  
:deep(html.dark) .el-upload__text {
  color: var(--el-text-color-regular);
}
  
.mt-2 {
  margin-top: 0.5rem;
}
</style>