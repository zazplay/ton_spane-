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

<template>
  <el-scrollbar height="calc(100vh - 64px)" class="scrollbar-container">
    <div class="profiles-container">
      <!-- Search and Controls -->
      <el-card class="control-panel" shadow="never">
        <div class="control-panel__content">
          <div class="control-panel__left">
            <el-input
              v-model="searchQuery"
              placeholder="Поиск по имени..."
              :prefix-icon="Search"
              clearable
              class="search-input"
            />
            <el-button type="primary" :icon="Plus" @click="dialogVisible = true">
              Добавить модель
            </el-button>
          </div>

          <div class="control-panel__right" v-if="selectedUsers.length > 0">
            <el-tag type="info" class="selection-tag">
              Выбрано: {{ selectedUsers.length }}
            </el-tag>
            <el-button-group>
              <el-button type="danger" :icon="Delete" @click="showDeleteConfirmation">
                Удалить
              </el-button>
              <el-button :icon="Close" @click="selectedUsers = []">
                Сбросить
              </el-button>
            </el-button-group>
          </div>
        </div>
      </el-card>

      <!-- Users Grid with Loading State -->
      <div class="content-wrapper">
        <el-skeleton 
          :loading="loading" 
          animated 
          :count="8"
          class="skeleton-grid"
        >
          <template #template>
            <div class="skeleton-card">
              <el-skeleton-item variant="image" class="skeleton-image" />
              <div class="skeleton-content">
                <el-skeleton-item variant="text" style="width: 70%" />
                <el-skeleton-item variant="text" style="width: 50%" />
              </div>
            </div>
          </template>

          <template #default>
            <el-empty
              v-if="filteredUsers.length === 0"
              description="Пользователи не найдены"
              class="empty-state"
            >
              <template #image>
                <el-icon :size="60"><UserFilled /></el-icon>
              </template>
            </el-empty>

            <div v-else class="users-grid">
              <el-card
                v-for="user in filteredUsers"
                :key="user.id"
                class="user-card"
                :class="{ 'user-card--selected': selectedUsers.includes(user.id) }"
                shadow="hover"
              >
                <div class="user-card__selection">
                  <el-checkbox
                    :model-value="selectedUsers.includes(user.id)"
                    @change="val => handleUserSelection(val, user.id)"
                  />
                </div>

                <div class="user-card__main" @click="handleUserSelect(user)">
                  <el-avatar
                    :size="100"
                    :src="user.profilePicture || defaultUserImg"
                    @error="e => e.target.src = defaultUserImg"
                    class="user-card__avatar"
                  />
                  <div class="user-card__info">
                    <h3 class="user-card__username">{{ user.username }}</h3>
                    <p class="user-card__description" v-if="user.profileDescription">
                      {{ truncateText(user.profileDescription, 50) }}
                    </p>
                  </div>
                </div>
              </el-card>
            </div>
          </template>
        </el-skeleton>
      </div>

      <!-- Add User Dialog -->
      <el-dialog
        v-model="dialogVisible"
        title="Добавить профиль"
        width="500px"
        destroy-on-close
        class="user-dialog"
      >
        <el-form 
          ref="formRef"
          :model="newUser"
          :rules="validationRules"
          label-position="top"
          class="user-form"
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
              resize="none"
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

      <!-- Delete Confirmation Dialog -->
      <el-dialog
        v-model="deleteDialogVisible"
        title="Подтверждение удаления"
        width="400px"
        destroy-on-close
        class="delete-dialog"
      >
        <template #default>
          <el-alert
            type="warning"
            :closable="false"
            show-icon
          >
            <p>Вы действительно хотите удалить {{ selectedUsers.length }} пользователя(ей)?</p>
            <p class="alert-subtitle">Это действие нельзя отменить</p>
          </el-alert>
        </template>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">Отменить</el-button>
            <el-button type="danger" @click="deleteUsers">Удалить</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>

<style scoped>
.scrollbar-container {
  height: calc(100vh - 64px);
  width: 100%;
}

.scrollbar-container :deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

.profiles-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 1rem;
  min-height: 100%;
}

/* Control Panel Styles */
.control-panel {
  position: sticky;
  top: 1rem;
  z-index: 10;
  background: var(--el-bg-color);
  margin-bottom: 1rem;
}

.control-panel__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.control-panel__left {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex: 1;
}

.search-input {
  max-width: 300px;
}

.control-panel__right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.selection-tag {
  font-size: 14px;
  padding: 8px 12px;
}

/* Grid Styles */
.content-wrapper {
  flex: 1;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem 0;
}

/* Skeleton Styles */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.skeleton-card {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 1rem;
  height: 200px;
}

.skeleton-image {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

/* User Card Styles */
.user-card {
  position: relative;
  transition: all 0.3s ease;
  height: 100%;
}

.user-card:hover {
  transform: translateY(-2px);
}

.user-card--selected {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.user-card__selection {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1;
}

.user-card__main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
}

.user-card__avatar {
  transition: transform 0.2s ease;
}

.user-card:hover .user-card__avatar {
  transform: scale(1.05);
}

.user-card__info {
  text-align: center;
  width: 100%;
}

.user-card__username {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
  color: var(--el-text-color-primary);
}

.user-card__description {
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
  margin: 0;
  line-height: 1.4;
}

/* Dialog Styles */
.user-dialog :deep(.el-dialog__body) {
  padding-top: 0;
}

.user-form {
  margin-top: 1rem;
}

.error-message {
  color: var(--el-color-danger);
  font-size: 12px;
  margin-top: 4px;
}

.alert-subtitle {
  font-size: 0.9em;
  margin-top: 0.5em;
  color: var(--el-text-color-secondary);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Empty State */
.empty-state {
  padding: 2rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .profiles-container {
    padding: 0.5rem;
  }

  .control-panel__content {
    flex-direction: column;
    align-items: stretch;
  }

  .control-panel__left {
    flex-direction: column;
  }

  .search-input {
    max-width: 100%;
  }

  .users-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.5rem;
  }

  .user-card__main {
    padding: 0.5rem;
  }

  .el-dialog {
    width: 90% !important;
    margin: 0 auto;
  }
}

/* Touch Device Optimization */
@media (hover: none) {
  .user-card:hover {
    transform: none;
  }

  .user-card:hover .user-card__avatar {
    transform: none;
  }
}

/* Custom Scrollbar */
:deep(*) {
  scrollbar-width: thin;
  scrollbar-color: var(--el-color-primary-light-3) transparent;
}

:deep(*::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(*::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(*::-webkit-scrollbar-thumb) {
  background-color: var(--el-color-primary-light-3);
  border-radius: 3px;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background-color: var(--el-color-primary);
}
</style>