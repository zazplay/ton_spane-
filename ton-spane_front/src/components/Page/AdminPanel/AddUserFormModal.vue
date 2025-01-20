// components/modals/UserCreateModal.vue
<template>
  <el-dialog
    v-model="dialogVisible"
    title="Добавить профиль"
    width="500px"
    destroy-on-close
    @closed="handleClose"
    style="margin-top: 50px;"
  >
    <el-form 
      ref="formRef"
      :model="newUser"
      label-position="top"
    >
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleImageChange"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>

      <el-form-item label="Имя" prop="username">
        <el-input
          v-model="newUser.username"
          @input="validateUsername"
          placeholder="Введите имя профиля"
        />
        <span v-if="errors.username" class="error-message">
          {{ errors.username }}
        </span>
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input
          v-model="newUser.email"
          type="email"
          placeholder="Введите email"
          @input="validateEmail"
        />
        <span v-if="errors.email" class="error-message">
          {{ errors.email }}
        </span>
      </el-form-item>

      <el-form-item label="Пароль" prop="password">
        <el-input
          v-model="newUser.password"
          type="password"
          placeholder="Введите пароль (минимум 6 символов)"
          show-password
          @input="validatePassword"
        />
        <div class="password-requirements">
          <div :class="{'requirement-met': hasMinLength}">• Минимум 6 символов</div>
          <div :class="{'requirement-met': hasUpperCase}">• Одна заглавная буква</div>
          <div :class="{'requirement-met': hasNumber}">• Одна цифра</div>
        </div>
        <span v-if="errors.password" class="error-message">
          {{ errors.password }}
        </span>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeModal">Отмена</el-button>
        <el-button type="primary" @click="saveUser" :disabled="!isFormValid">
          Сохранить
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed,defineProps,defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'
import config from '@/config'
import { validateInputToScript, removeTagsOperators, validateLogin } from "../../Validation"

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'user-created'])

const API_URL = `${config.API_BASE_URL}/users`
const formRef = ref(null)
const imageUrl = ref('')
const imageFile = ref(null)

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Состояния формы
const newUser = ref({
  username: '',
  email: '',
  password: ''
})

const errors = ref({
  username: '',
  email: '',
  password: ''
})

// Валидация пароля
const hasMinLength = computed(() => newUser.value.password.length >= 6)
const hasUpperCase = computed(() => /[A-Z]/.test(newUser.value.password))
const hasNumber = computed(() => /\d/.test(newUser.value.password))

// Методы валидации
const validateEmail = () => {
  errors.value.email = ''
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(newUser.value.email)) {
    errors.value.email = 'Введите корректный email'
  }
}

const validatePassword = () => {
  errors.value.password = ''
  
}

const validateUsername = () => {
  errors.value.username = ''
  const lengthLogin = validateLogin(newUser.value.username)
  if (!lengthLogin.executionResult) {
    errors.value.username = lengthLogin.messange
  }
  
  const result = validateInputToScript(newUser.value.username)
  if (!result.executionResult) {
    errors.value.username = result.messange
    newUser.value.username = removeTagsOperators(newUser.value.username)
  }
}

// Проверка валидности формы
const isFormValid = computed(() => {
  return !errors.value.username && 
         !errors.value.email && 
         !errors.value.password &&
         newUser.value.username &&
         newUser.value.email &&
         newUser.value.password &&
         hasMinLength.value &&
         hasUpperCase.value &&
         hasNumber.value
})

// Обработчики
const handleImageChange = (file) => {
  imageFile.value = file.raw
  imageUrl.value = URL.createObjectURL(file.raw)
}

const closeModal = () => {
  dialogVisible.value = false
}

const resetForm = () => {
  newUser.value = {
    username: '',
    email: '',
    password: ''
  }
  errors.value = {
    username: '',
    email: '',
    password: ''
  }
  imageUrl.value = ''
  imageFile.value = null
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const handleClose = () => {
  resetForm()
}

// Сохранение пользователя
const saveUser = async () => {
  if (!formRef.value) return

  try {
    const formData = new FormData()
    formData.append('email', newUser.value.email)
    formData.append('password', newUser.value.password)
    formData.append('username', newUser.value.username)
    
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    const response = await axios.post(`${API_URL}/simple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    ElMessage.success('Профиль успешно добавлен')
    emit('user-created', response.data)
    closeModal()
    resetForm()
  } catch (error) {
    console.error('Error:', error.response?.data)
    
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('Ошибка при сохранении профиля')
    }
  }
}
</script>

<style scoped>
.avatar-uploader {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-uploader .avatar {
  width: 150px;
  height: 150px;
  border-radius: 6px;
}

.avatar-uploader .el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-icon.avatar-uploader-icon:hover {
  border-color: var(--el-color-primary);
}

.password-requirements {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.requirement-met {
  color: #67C23A;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}
</style>