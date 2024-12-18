<template>
    <el-dialog
        v-model="deleteDialogVisible"
        title="Подтверждение удаления"
        width="400px"
        destroy-on-close
    >
        <span>Вы действительно хотите удалить {{ selectedUsers.length }} пользователя(ей)?</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeDeleteDialog">Отменить</el-button>
                <el-button type="danger" @click="deleteSelectedUsers">Удалить</el-button>
            </div>
        </template>
    </el-dialog>

    <div class="container-btn">
        <div class="btn-add-profile">
            <el-button type="primary" @click="dialogVisible = true">
                Добавить профиль
            </el-button>
        </div>
        <div class="btn-add-profile" style="margin-left: 6px;">
            <template v-if="selectedUsers.length > 0">
                <el-button type="danger" @click="showDeleteConfirmation">
                    Удалить ({{ selectedUsers.length }})
                </el-button>
                <el-button type="info" @click="resetSelection">
                    Cбросить
                </el-button>
            </template>
        </div>
    </div>

    <el-dialog
        v-model="dialogVisible"
        title="Добавить профиль"
        width="500px"
        destroy-on-close
    >
        <el-form 
            ref="formRef"
            :model="newProfile"
            :rules="rules"
            label-position="top"
        >
            <el-form-item label="Имя" prop="username">
                <el-input
                    v-model="newProfile.username"
                    @input="handleInputName"
                    placeholder="Введите имя профиля"
                />
                <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
            </el-form-item>

            <el-form-item label="Пароль" prop="password">
                <el-input
                    v-model="newProfile.password"
                    type="password"
                    placeholder="Введите пароль"
                    show-password
                />
            </el-form-item>

            <el-form-item label="Описание" prop="description">
                <el-input
                    v-model="newProfile.description"
                    type="textarea"
                    :rows="4"
                    @input="handleInputDescription"
                    placeholder="Введите описание"
                />
                <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">Отмена</el-button>
                <el-button type="primary" @click="saveNewProfile">Сохранить</el-button>
            </div>
        </template>
    </el-dialog>

    <el-space style="width: 100%" fill>
        <el-skeleton style="display: flex; gap: 8px" :loading="loading" animated :count="3">
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
                    class="scroll-container" 
                    @mousedown="startDrag" 
                    @mousemove="dragging" 
                    @mouseup="stopDrag"
                    @mouseleave="stopDrag"
                >
                    <el-card
                        v-for="item in lists"
                        :key="item.id"
                        :body-style="{ padding: '0px', marginBottom: '1px' }"
                        class="card"
                    >
                        <img
                            :src="item.profilePicture || defaultUserImage"
                            class="image"
                            @click="handleCardClick(item)"
                            @error="handleImageError"
                        />
                        <div class="card-content">
                            <el-text class="username" @click="handleCardClick(item)">
                                {{ item.username }}
                            </el-text>
                            <div class="checkbox-delete">
                                <el-checkbox
                                    :model-value="selectedUsers.includes(item.id)"
                                    @change="(val) => handleCheckboxChange(val, item.id)"
                                />
                            </div>
                        </div>
                    </el-card>
                </div>
            </template>
        </el-skeleton>
    </el-space>
</template>

<script setup>
import { ref, onMounted,defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import config from '@/config'
import { validateInputToScript, removeTagsOperators, validateLogin } from "../../../Validation"

const emit = defineEmits(['select-user'])
const formRef = ref(null)
const defaultUserImage = "https://via.placeholder.com/150"

const loading = ref(true)
const lists = ref([])
const selectedUsers = ref([])
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)

const newProfile = ref({
    username: '',
    password: '',
    description: ''
})

const errors = ref({
    username: '',
    description: ''
})

const rules = {
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

let isDragging = false
let startX = 0
let scrollLeft = 0

const fetchData = async () => {
    try {
        const response = await axios.get(`${config.API_BASE_URL}/models`)
        lists.value = response.data
        loading.value = false
    } catch (error) {
        console.error("Ошибка при получении данных:", error)
        ElMessage.error('Ошибка при получении данных')
        loading.value = false
    }
}

const handleCardClick = (item) => {
    emit('select-user', item.id)
}

const handleCheckboxChange = (checked, id) => {
    if (checked) {
        selectedUsers.value.push(id)
    } else {
        selectedUsers.value = selectedUsers.value.filter(userId => userId !== id)
    }
}

const handleImageError = (e) => {
    e.target.src = defaultUserImage
}

const startDrag = (event) => {
    isDragging = true
    startX = event.pageX - event.target.offsetLeft
    scrollLeft = event.target.scrollLeft
}

const dragging = (event) => {
    if (!isDragging) return
    event.preventDefault()
    const x = event.pageX - event.target.offsetLeft
    const walk = (x - startX) * 3
    event.target.scrollLeft = scrollLeft - walk
}

const stopDrag = () => {
    isDragging = false
}

const handleInputName = () => {
    errors.value.username = ''
    const lengthLogin = validateLogin(newProfile.value.username)
    if (!lengthLogin.executionResult) {
        errors.value.username = lengthLogin.messange
    }
    
    const result = validateInputToScript(newProfile.value.username)
    if (!result.executionResult) {
        errors.value.username = result.messange
        newProfile.value.username = removeTagsOperators(newProfile.value.username)
    }
}

const handleInputDescription = () => {
    errors.value.description = ''
    const result = validateInputToScript(newProfile.value.description)
    if (!result.executionResult) {
        errors.value.description = result.messange
        newProfile.value.description = removeTagsOperators(newProfile.value.description)
    }
}

const saveNewProfile = async () => {
    if (!formRef.value) return

    try {
        const valid = await formRef.value.validate()
        if (!valid) return

        await axios.post(`${config.API_BASE_URL}/models`, {
            username: newProfile.value.username,
            password: newProfile.value.password,
            profileDescription: newProfile.value.description
        })
        
        ElMessage.success('Профиль успешно добавлен')
        dialogVisible.value = false
        newProfile.value = { username: '', password: '', description: '' }
        await fetchData()
    } catch (error) {
        ElMessage.error('Ошибка при сохранении профиля')
        console.error('Ошибка при сохранении профиля:', error)
    }
}

const showDeleteConfirmation = () => {
    deleteDialogVisible.value = true
}

const closeDeleteDialog = () => {
    deleteDialogVisible.value = false
}

const resetSelection = () => {
    selectedUsers.value = []
}

const deleteSelectedUsers = async () => {
    if (selectedUsers.value.length === 0) {
        ElMessage.warning('Выберите пользователей для удаления')
        return
    }

    try {
        for (const id of selectedUsers.value) {
            await axios.delete(`${config.API_BASE_URL}/models/${id}`)
        }
        
        ElMessage.success('Пользователи успешно удалены')
        selectedUsers.value = []
        deleteDialogVisible.value = false
        await fetchData()
    } catch (error) {
        ElMessage.error('Ошибка при удалении пользователей')
        console.error('Ошибка при удалении пользователей:', error)
    }
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.scroll-container {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0;
}

.scroll-container::-webkit-scrollbar {
    height: 8px;
}

.scroll-container::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 10px;
}

.scroll-container::-webkit-scrollbar-track {
    background-color: lightgrey;
}

.container-btn {
    display: flex;
    flex-direction: row;
    position: relative;
}

.el-card {
    position: relative;
    flex: 0 0 auto;
    width: 150px;
    height: 180px;
    border: none;
    transition: transform 0.2s ease-in-out;
    text-align: center;
    background-color: transparent;
    cursor: pointer;
    scroll-snap-align: start;
    margin: 6px 6px;
}

.image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
}

.card:hover {
    transform: scale(1.1);
}

.card-content {
    padding: 5px 0;
    font-size: 14px;
}

.btn-add-profile {
    display: flex;
    justify-content: end;
    padding-right: 15px;
    position: static;
}

.error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
}

.checkbox-delete {
    margin-top: 0 !important;
    position: absolute;
    bottom: 5px;
    left: 5px;
}

@media (max-width: 1200px) {
    .scroll-container {
        flex-wrap: nowrap;
        overflow-x: auto;
        gap: 10px;
        scroll-snap-type: x mandatory;
        cursor: grab;
        padding: 0;
        margin-bottom: 10px;
    }

    .el-card {
        flex: 0 0 90px;
        height: 160px;
    }

    .image {
        width: 90px;
        height: 85px;
    }

    .btn-add-profile {
        padding-right: 5px;
        margin: 10px 0 20px;
    }
}
</style>