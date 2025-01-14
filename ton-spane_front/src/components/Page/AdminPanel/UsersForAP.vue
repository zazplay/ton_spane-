<template>
  <div class="profiles-container">
    <!-- Панель управления пользователями -->
    <div class="control-panel">
      <div class="control-panel__left">
        <el-button type="primary" @click="dialogVisible = true">
          Добавить профиль
        </el-button>
        <el-input
          v-model="searchQuery"
          placeholder="Поиск по имени"
          clearable
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
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
              v-for="user in filteredUsers"
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
                  {{ user.username || user.email }}
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
        placeholder="Введите пароль"
        show-password
        @input="validatePassword"
      />
      <span v-if="errors.password" class="error-message">
        {{ errors.password }}
      </span>
    </el-form-item>
  </el-form>
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="dialogVisible = false">Отмена</el-button>
      <el-button type="primary" @click="saveUser" :disabled="!isFormValid">Сохранить</el-button>
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
import { ref, onMounted, defineEmits, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'
import config from '@/config'
import { validateInputToScript, removeTagsOperators, validateLogin } from "../../Validation"

// Определяем emit
const emit = defineEmits(['select-user'])

// Константы
const defaultUserImg = "https://img.icons8.com/?size=100&id=83151&format=png&color=22C3E6" // или другой надежный URL
const API_URL = `${config.API_BASE_URL}/users`

// Состояние компонента
const formRef = ref(null)
const scrollContainer = ref(null)
const loading = ref(true)
const users = ref([])
const searchQuery = ref('')
const selectedUsers = ref([])
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const dragState = ref({ isDragging: false, startX: 0, scrollLeft: 0 })

// Вычисляемые свойства
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(user => 
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Состояния
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

// Валидация email
const validateEmail = () => {
  errors.value.email = ''
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(newUser.value.email)) {
    errors.value.email = 'Введите корректный email'
  }
}

// Валидация пароля
const validatePassword = () => {
  errors.value.password = ''
  if (newUser.value.password.length < 6) {
    errors.value.password = 'Пароль должен быть не менее 6 символов'
  }
}

// Проверка валидности формы
const isFormValid = computed(() => {
  return !errors.value.username && 
         !errors.value.email && 
         !errors.value.password &&
         newUser.value.username &&
         newUser.value.email &&
         newUser.value.password
})
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

    // Отправляем только необходимые поля в нужном формате
    const userData = {
      username: newUser.value.username,
      email: newUser.value.email,
      password: newUser.value.password
    }

    console.log('Sending user data:', userData)

    await axios.post(API_URL, userData)
    
    ElMessage.success('Профиль успешно добавлен')
    dialogVisible.value = false
    
    // Очищаем форму
    newUser.value = { 
      username: '',
      email: '',
      password: '',
      description: ''
    }
    
    await fetchUsers()
  } catch (error) {
    console.error('Full error:', error)
    console.error('Response data:', error.response?.data)
    
    if (error.response?.status === 500) {
      ElMessage.error('Ошибка сервера при сохранении профиля. Проверьте правильность данных')
    } else {
      ElMessage.error('Ошибка при сохранении профиля')
    }
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