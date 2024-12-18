<template>
  <div class="profiles-container">
    <!-- Панель управления пользователями -->
    <div class="control-panel">
      <div class="control-panel__left">
        <el-button type="primary" @click="dialogVisible = true">
          Добавить профиль
        </el-button>
      </div>
      <div class="control-panel__right">
        <template v-if="selectedUsers.length > 0">
          <el-button type="danger" @click="showDeleteConfirmation">
            Удалить ({{ selectedUsers.length }})
          </el-button>
          <el-button type="info" @click="selectedUsers = []">
            Cбросить
          </el-button>
        </template>
      </div>
    </div>

    <!-- Список пользователей с загрузчиком -->
    <el-space style="width: 100%" fill>
      <el-skeleton 
        style="display: flex; gap: 8px" 
        :loading="loading" 
        animated 
        :count="3"
      >
        <template #template>
          <div style="flex: 1">
            <el-skeleton-item variant="image" style="height: 240px" />
            <div style="padding: 14px">
              <el-skeleton-item variant="h3" style="width: 50%" />
              <div style="display: flex; align-items: center; margin-top: 16px; height: 16px;">
                <el-skeleton-item variant="text" style="margin-right: 16px" />
                <el-skeleton-item variant="text" style="width: 30%" />
              </div>
            </div>
          </div>
        </template>

        <template #default>
          <div 
            class="user-grid"
            ref="scrollContainer"
            @mousedown="startDrag"
            @mousemove="handleDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
          >
            <el-card
              v-for="user in users"
              :key="user.id"
              :body-style="{ padding: '0px', marginBottom: '1px' }"
              class="user-card"
            >
              <img
                :src="user.profilePicture || defaultUserImg"
                class="user-card__image"
                @click="handleUserSelect(user)"
                @error="e => e.target.src = defaultUserImg"
              />
              <div class="user-card__content">
                <el-text class="user-card__username" @click="handleUserSelect(user)">
                  {{ user.username }}
                </el-text>
                <div class="user-card__checkbox">
                  <el-checkbox
                    :model-value="selectedUsers.includes(user.id)"
                    @change="val => handleUserSelection(val, user.id)"
                  />
                </div>
              </div>
            </el-card>
          </div>
        </template>
      </el-skeleton>
    </el-space>

    <!-- Диалог добавления пользователя -->
    <el-dialog
      v-model="dialogVisible"
      title="Добавить профиль"
      width="500px"
      destroy-on-close
    >
      <el-form 
        ref="formRef"
        :model="newUser"
        :rules="validationRules"
        label-position="top"
      >
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

        <el-form-item label="Пароль" prop="password">
          <el-input
            v-model="newUser.password"
            type="password"
            placeholder="Введите пароль"
            show-password
          />
        </el-form-item>

        <el-form-item label="Описание" prop="description">
          <el-input
            v-model="newUser.description"
            type="textarea"
            :rows="4"
            @input="validateDescription"
            placeholder="Введите описание"
          />
          <span v-if="errors.description" class="error-message">
            {{ errors.description }}
          </span>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Отмена</el-button>
          <el-button type="primary" @click="saveUser">Сохранить</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Диалог подтверждения удаления -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="Подтверждение удаления"
      width="400px"
      destroy-on-close
    >
      <span>Вы действительно хотите удалить {{ selectedUsers.length }} пользователя(ей)?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">Отменить</el-button>
          <el-button type="danger" @click="deleteUsers">Удалить</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted,defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import config from '@/config'
import { validateInputToScript, removeTagsOperators, validateLogin } from "../../../Validation"

// Определяем emit
const emit = defineEmits(['select-user'])

// Константы
const defaultUserImg = "https://via.placeholder.com/150"
const API_URL = `${config.API_BASE_URL}/models`

// Состояние компонента
const formRef = ref(null)
const scrollContainer = ref(null)
const loading = ref(true)
const users = ref([])
const selectedUsers = ref([])
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const dragState = ref({ isDragging: false, startX: 0, scrollLeft: 0 })

const newUser = ref({
  username: '',
  password: '',
  description: ''
})

const errors = ref({
  username: '',
  description: ''
})

// Правила валидации
const validationRules = {
  username: [
    { required: true, message: 'Введите имя пользователя', trigger: 'blur' },
    { min: 3, message: 'Минимум 3 символа', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Введите пароль', trigger: 'blur' },
    { min: 6, message: 'Минимум 6 символов', trigger: 'blur' }
  ],
  description: [
    { required: true, message: 'Введите описание', trigger: 'blur' }
  ]
}

// Методы для работы с API
const fetchUsers = async () => {
  try {
    const { data } = await axios.get(API_URL)
    users.value = data
  } catch (error) {
    ElMessage.error('Ошибка при получении данных')
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

const saveUser = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    await axios.post(API_URL, {
      username: newUser.value.username,
      password: newUser.value.password,
      profileDescription: newUser.value.description
    })
    
    ElMessage.success('Профиль успешно добавлен')
    dialogVisible.value = false
    newUser.value = { username: '', password: '', description: '' }
    await fetchUsers()
  } catch (error) {
    ElMessage.error('Ошибка при сохранении профиля')
    console.error('Error saving user:', error)
  }
}

const deleteUsers = async () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('Выберите пользователей для удаления')
    return
  }

  try {
    await Promise.all(
      selectedUsers.value.map(id => axios.delete(`${API_URL}/${id}`))
    )
    
    ElMessage.success('Пользователи успешно удалены')
    selectedUsers.value = []
    deleteDialogVisible.value = false
    await fetchUsers()
  } catch (error) {
    ElMessage.error('Ошибка при удалении пользователей (удалите все посты пользователя перед удалением пользователя)')
    console.error('Error deleting users:', error)
  }
}

// Обработчики событий
const handleUserSelect = (user) => {
  emit('select-user', user.id)
}

const handleUserSelection = (checked, id) => {
  if (checked) {
    selectedUsers.value.push(id)
  } else {
    selectedUsers.value = selectedUsers.value.filter(userId => userId !== id)
  }
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

const validateDescription = () => {
  errors.value.description = ''
  const result = validateInputToScript(newUser.value.description)
  if (!result.executionResult) {
    errors.value.description = result.messange
    newUser.value.description = removeTagsOperators(newUser.value.description)
  }
}

// Обработчики drag-scroll
const startDrag = (event) => {
  dragState.value = {
    isDragging: true,
    startX: event.pageX - event.target.offsetLeft,
    scrollLeft: event.target.scrollLeft
  }
}

const handleDrag = (event) => {
  if (!dragState.value.isDragging) return
  event.preventDefault()
  const x = event.pageX - event.target.offsetLeft
  const walk = (x - dragState.value.startX) * 3
  event.target.scrollLeft = dragState.value.scrollLeft - walk
}

const stopDrag = () => {
  dragState.value.isDragging = false
}

const showDeleteConfirmation = () => {
  deleteDialogVisible.value = true
}

// Инициализация
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.profiles-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e4e7ed;
}

.control-panel__left {
  display: flex;
  gap: 8px;
}

.control-panel__right {
  display: flex;
  gap: 8px;
}

.user-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px 0;
}

.user-card {
  position: relative;
  width: 150px;
  height: 180px;
  border: none;
  transition: transform 0.2s ease-in-out;
  text-align: center;
  background-color: transparent;
  cursor: pointer;
}

.user-card:hover {
  transform: scale(1.05);
}

.user-card__image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
}

.user-card__content {
  padding: 8px;
  position: relative;
}

.user-card__username {
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
}

.user-card__checkbox {
  position: absolute;
  bottom: 5px;
  left: 5px;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}

.user-grid::-webkit-scrollbar {
  height: 8px;
}

.user-grid::-webkit-scrollbar-thumb {
  background-color: #909399;
  border-radius: 4px;
}

.user-grid::-webkit-scrollbar-track {
  background-color: #f4f4f5;
}

@media (max-width: 1200px) {
  .control-panel {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    padding: 12px;
  }

  .control-panel__right {
    width: 100%;
    justify-content: flex-start;
  }

  .user-grid {
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    cursor: grab;
    padding: 0;
    margin-bottom: 10px;
  }

  .user-card {
    flex: 0 0 90px;
    height: 160px;
  }

  .user-card__image {
    width: 90px;
    height: 85px;
  }
}
</style>