<!--ProfileContent-->
<!-- <script lang="js" setup>
import { ref, onMounted, defineProps, watch } from 'vue'
import ListPostCards from '../../ListPostCards.vue'
import config from '@/config';

const props = defineProps({
    userIdProp: {
        type: String,
        required: false, // Параметр не обов'язковий
    },
});

console.log("props.userIdProp", props.userIdProp)
const userId = props.userIdProp || 'f26088fd-d4aa-4420-a7f6-1f89baa915c3';

const S3_BASE_URL = 'https://tonimages.s3.us-east-1.amazonaws.com/'
const DEFAULT_HEADER = 'https://placehold.co/600x200'
const DEFAULT_AVATAR = 'https://img.icons8.com/?size=100&id=83151&format=png&color=22C3E6'

const isLoaded = ref(false)
const userData = ref({
    id: userId,
    username: '',
    profilePicture: '',
    profileHeader: '',
    posts: [],
    likes: [],
})
const activeNames = ref(['1'])

const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    return imageUrl.startsWith('http') ? imageUrl : `${S3_BASE_URL}${imageUrl}`
}

const preparePostsData = (posts) => {
    return posts.map(post => ({
        ...post,
        id: post.id,
        userId: userId,
        imageUrl: formatImageUrl(post.imageUrl),
        price: String(post.price),
        isBlurred: post.isBlurred || false,
        caption: post.caption || ''
    }))
}

const fetchUserData = async () => {
    console.log("userId", userId)
    try {
        const response = await fetch(`${config.API_BASE_URL}/users/${props.userIdProp}`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()

        userData.value = {
            ...data,
            id: userId,
            profilePicture: formatImageUrl(data.profilePicture) || DEFAULT_AVATAR,
            profileHeader: formatImageUrl(data.profileHeader) || DEFAULT_HEADER,
            posts: preparePostsData(data.posts || []),
            likes: data.likes || [],
        }
        isLoaded.value = true
    } catch (err) {
        console.error('Error fetching user data:', err)
        isLoaded.value = true
    }
}

const fetchUserPosts = async () => {
    console.log("userId", userId)
    try {
        const response = await fetch(`${config.API_BASE_URL}/posts/user/${props.userIdProp}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const formattedPosts = data.map(post => ({
            ...post,
            id: post.id,
            imageUrl: formatImageUrl(post.imageUrl),
            caption: post.caption || '',
            price: String(post.price),
            isBlurred: post.isBlurred || false,
            createdAt: post.createdAt,
            user: {
                id: userId,
                username: userData.value.username,
                email: userData.value.email || '',
                profilePicture: userData.value.profilePicture
            },
            // Include other boolean flags
            initialLiked: false,
            initialShared: false,
            initialDonated: false,
            initialSubscribed: false
        }));

        userData.value.posts = formattedPosts;
    } catch (err) {
        console.error('Error fetching user posts:', err);
        userData.value.posts = [];
    }
};

const handleImageError = (type) => {
    if (type === 'header') {
        userData.value.profileHeader = DEFAULT_HEADER
    } else if (type === 'avatar') {
        userData.value.profilePicture = DEFAULT_AVATAR
    }
}

// Sequential fetching to ensure user data is loaded first
const initializeUserData = async () => {
    await fetchUserData()
    await fetchUserPosts()
}

// Наблюдатель за изменением userIdProp
watch(() => props.userIdProp, (newValue) => {
    console.log(props.userIdProp, newValue)
    if (newValue) {
        initializeUserData(); // Загружаем данные при изменении userIdProp
    }
});

onMounted(initializeUserData)
</script>

<template>
    <div v-if="isLoaded" class="layout">
        <el-container>
            <el-header class="header">
                <el-image class="header-image" :src="userData.profileHeader" fit="cover"
                    @error="() => handleImageError('header')" />
            </el-header>

            <el-container class="content-container">
                <el-aside class="aside">
                    <div class="profile-image">
                        <el-image :src="userData.profilePicture" @error="() => handleImageError('avatar')" />
                    </div>

                    <el-text tag="h2" class="username">
                        {{ userData.username }}
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20"
                            viewBox="0,0,256,256">
                            <g fill="#25c1fd" fill-rule="nonzero">
                                <g transform="scale(5.12,5.12)">
                                    <path
                                        d="M25,2c-12.682,0 -23,10.318 -23,23c0,12.683 10.318,23 23,23c12.683,0 23,-10.317 23,-23c0,-12.682 -10.317,-23 -23,-23zM35.827,16.562l-11.511,16.963l-8.997,-8.349c-0.405,-0.375 -0.429,-1.008 -0.053,-1.413c0.375,-0.406 1.009,-0.428 1.413,-0.053l7.29,6.764l10.203,-15.036c0.311,-0.457 0.933,-0.575 1.389,-0.266c0.458,0.31 0.577,0.932 0.266,1.39z">
                                    </path>
                                </g>
                            </g>
                        </svg>
                    </el-text>
                    <el-text class="stat-badge" type="primary">
                        <el-text class="stat-text">{{ userData.posts.length }} публикации</el-text>
                    </el-text>
                    <el-text class="stat-badge" type="primary">
                        <el-text class="stat-text">{{ userData.likes.length }} лайков</el-text>
                    </el-text>
                </el-aside>
            </el-container>

            <el-container>
                <el-main class="main">
                    <el-collapse v-model="activeNames" class="about-section">
                        <el-collapse-item name="1">
                            <template #title>
                                <div class="collapse-header">
                                    <span class="title">О себе</span>
                                </div>
                            </template>
                            <div class="collapse-content">
                                {{ userData.profileDescription }}
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-main>
            </el-container>

            <el-button type="warning" class="action-button" plain >
                Станьте спонсором всего за 5$ первый месяц
            </el-button>
            <el-button type="success" class="action-button" plain >
                Купить годовую подписку за 150$
            </el-button>
        </el-container>

        <ListPostCards v-if="userData.posts.length" :posts="userData.posts" :user="userData" />
    </div>
</template>

<style scoped>
/* Стили остаются без изменений */
.layout {
    width: 95%;
    align-self: center;
    margin-left: 10px;
}

.header {
    height: 100%;
    padding: 0;
    display: flex;
    justify-content: center;
}

.header-image {
    width: 100%;
    max-height: 300px !important;
    border-radius: 20px;
    margin-bottom: 10px;
}

.aside {
    width: 100%;
    display: flex;
    align-items: center;
}

.profile-image {
    width: 15%;
    margin-right: 20px;
}

.profile-image :deep(.el-image) {
    border-radius: 20px;
    align-self: flex-start;
    justify-self: flex-start;
}

.username {
    display: inline-flex;
    align-items: center;
    font-weight: 600;
    font-size: 1.25rem;
    margin: 0;
    padding: 0;
    width: 43%;
}

.stat-badge {
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
    font-weight: 500;
    border-radius: 15px;
    padding: 12px 20px;
    width: auto;
    margin-left: 20px;
    background: linear-gradient(135deg,
            rgba(64, 158, 255, 0.15) 0%,
            rgba(100, 180, 255, 0.25) 50%,
            rgba(64, 158, 255, 0.15) 100%);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(64, 158, 255, 0.2);
    box-shadow:
        0 4px 6px rgba(64, 158, 255, 0.1),
        inset 0 1px 2px rgba(255, 255, 255, 0.1);
    transition: all 0.4s ease;
}

.stat-badge:hover {
    background: linear-gradient(135deg,
            rgba(64, 158, 255, 0.25) 0%,
            rgba(100, 180, 255, 0.35) 50%,
            rgba(64, 158, 255, 0.25) 100%);
    transform: translateY(-2px);
    box-shadow:
        0 8px 12px rgba(64, 158, 255, 0.15),
        inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 70%;
    padding: 0;
    overflow: hidden;
    margin-bottom: 0px;
}

.about-section {
    width: 99%;
    min-height: 150px;
    margin: 1.5% 0 0 5px;
    background: transparent;
    border: 1px solid rgba(var(--el-color-primary-rgb), 0.08);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
    margin-bottom: 0px;
}

.about-section:hover {
    border-color: rgba(var(--el-color-primary-rgb), 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.about-section :deep(.el-collapse-item__header) {
    padding: 0.4rem 0.6rem;
    background: transparent;
    border-bottom: 1px solid rgba(var(--el-color-primary-rgb), 0.08);
}

.about-section :deep(.el-collapse-item__content) {
    padding: 0.4rem 0.6rem;
    width: 95%;
}

.collapse-header .title {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--el-color-primary);
}

.collapse-content {
    font-size: 0.875rem;
    line-height: 1.4;
    color: var(--el-text-color-regular);
}

.action-button {
    font-weight: bold;
    font-size: 1.25rem;
    margin-bottom: 25px;
    width: 99%;
    height: 5.7%;
    align-self: center;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-left: 0;
}

.loading-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
}

@media (max-width: 480px) {
    .content-container {
        flex-direction: column !important;
        width: 98%;

    }

    .main {
        width: 100%;
        padding: 0 15px;
    }

    .username {
        font-size: 14px;
        width: 30%;
        flex-wrap: wrap;
        gap: 5px;
    }

    .profile-image {
        width: 40%;
        margin-right: 20px;
    }

    .stat-badge {
        width: 70.6% !important;
        padding: 10px;
        margin: 5px;
    }

    .stat-badge :deep(.el-text) {
        font-size: 12px !important;
    }

    .about-section {
        width: 100%;
        margin: 0px 0;
    }

    .collapse-header .title,
    .collapse-content {
        font-size: 14px;
    }

    .action-button {
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 1rem !important;
        height: auto;
        padding: 10px;
    }
}
</style> -->

<script lang="js" setup>
// import ListPostCards from '../../ListPostCards.vue'
import { ref, onMounted, defineProps, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import config from '@/config'

const props = defineProps({
    userIdProp: {
        type: String,
        required: false, // Параметр не обов'язковий
    },
});

console.log("props.userIdProp", props.userIdProp)
// const userId = props.userIdProp || 'f26088fd-d4aa-4420-a7f6-1f89baa915c3';

const S3_BASE_URL = 'https://tonimages.s3.us-east-1.amazonaws.com/'
const DEFAULT_HEADER = 'https://placehold.co/600x200'
const DEFAULT_AVATAR = 'https://img.icons8.com/?size=100&id=83151&format=png&color=22C3E6'

const isLoaded = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const isUploadingAvatar = ref(false)
const isUploadingHeader = ref(false)
const activeNames = ref(['1'])

const userData = ref({
  id: '',
  username: '',
  email: '',
  profilePicture: '',
  profileHeader: '',
  profileDescription: '',
  createdAt: '',
//   post:[],
  likes: [],
});

const editableData = ref({
  username: '',
  profileDescription: '',
})

const editFormRules = {
  username: [
    { required: true, message: 'Пожалуйста, введите имя пользователя', trigger: 'blur' },
    { min: 3, message: 'Минимум 3 символа', trigger: 'blur' }
  ]
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  return imageUrl.startsWith('http') ? imageUrl : `${S3_BASE_URL}${imageUrl}`
}

const handleImageError = (type) => {
  if (type === 'header') {
    userData.value.profileHeader = DEFAULT_HEADER
  } else if (type === 'avatar') {
    userData.value.profilePicture = DEFAULT_AVATAR
  }
}

const uploadImage = async (file, type) => {
  const formData = new FormData()
  formData.append('image', file)

  const loadingState = type === 'avatar' ? isUploadingAvatar : isUploadingHeader
  const endpoint = type === 'avatar' ? 'profile-image' : 'profile-header'

  try {
    loadingState.value = true
    
    const response = await fetch(`${config.API_BASE_URL}/users/${props.userIdProp}/${endpoint}`, {
      method: 'PATCH',
      body: formData
    })

    if (!response.ok) throw new Error('Failed to upload image')

    const contentType = response.headers.get("content-type");
    let data = {};
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = {
        [type === 'avatar' ? 'profilePicture' : 'profileHeader']: URL.createObjectURL(file)
      };
    }
    
    if (type === 'avatar') {
      userData.value.profilePicture = formatImageUrl(data.profilePicture) || URL.createObjectURL(file);
    } else {
      userData.value.profileHeader = formatImageUrl(data.profileHeader) || URL.createObjectURL(file);
    }

    ElMessage({
      message: 'Изображение успешно обновлено',
      type: 'success'
    })

    await fetchUserData();

  } catch (error) {
    console.error('Error uploading image:', error)
    ElMessage({
      message: 'Ошибка при загрузке изображения',
      type: 'error'
    })
  } finally {
    loadingState.value = false
  }
}

const handleFileChange = async (event, type) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage({
      message: 'Пожалуйста, выберите изображение',
      type: 'error'
    })
    return
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage({
      message: 'Размер файла не должен превышать 5MB',
      type: 'error'
    })
    return
  }

  await uploadImage(file, type)
}

const startEditing = () => {
  editableData.value = {
    username: userData.value.username || '',
    profileDescription: userData.value.profileDescription || '',
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editableData.value = {
    username: '',
    profileDescription: '',
  }
}

const saveChanges = async () => {
  try {
    isSubmitting.value = true

    const updateData = {}
    if (editableData.value.username) updateData.username = editableData.value.username
    if (editableData.value.profileDescription) updateData.profileDescription = editableData.value.profileDescription

    const response = await fetch(`${config.API_BASE_URL}/users/${props.userIdProp}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })
    
    if (!response.ok) throw new Error('Failed to update profile')
    
    userData.value = {
      ...userData.value,
      username: editableData.value.username || userData.value.username,
      profileDescription: editableData.value.profileDescription || userData.value.profileDescription
    }

    ElMessage({
      message: 'Профиль успешно обновлен',
      type: 'success'
    })

    isEditing.value = false
  } catch (error) {
    console.error('Error updating profile:', error)
    ElMessage({
      message: 'Ошибка при обновлении профиля',
      type: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const fetchUserData = async () => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/users/${props.userIdProp}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    
    userData.value = {
      ...data,
      profilePicture: formatImageUrl(data.profilePicture) || DEFAULT_AVATAR,
      profileHeader: formatImageUrl(data.profileHeader) || DEFAULT_HEADER,
    }
    isLoaded.value = true
  } catch (err) {
    console.error('Error fetching user data:', err)
    isLoaded.value = true
  }
}

// Наблюдатель за изменением userIdProp
watch(() => props.userIdProp, (newValue) => {
    console.log(props.userIdProp, newValue)
    if (newValue) {
        console.log("reload");
        fetchUserData();// initializeUserData(); // Загружаем данные при изменении userIdProp
    }
});

onMounted(fetchUserData)
</script>

<template>
  <div v-if="isLoaded" class="layout">
    <el-container>
      <el-header class="header">
        <div class="header-wrapper">
          <el-image 
            class="header-image" 
            :src="userData.profileHeader"
            fit="cover"
            @error="() => handleImageError('header')"
          />
          <div v-if="isEditing" class="image-upload-overlay">
            <label class="upload-button">
              <input
                type="file"
                accept="image/*"
                @change="(e) => handleFileChange(e, 'header')"
                class="file-input"
              />
              <el-icon v-if="isUploadingHeader" class="loading"><Loading /></el-icon>
              <span v-else>Изменить шапку профиля</span>
            </label>
          </div>
        </div>
      </el-header>
      
      <el-container class="content-container">
        <el-aside class="aside">
          <div class="profile-image">
            <div class="image-wrapper">
              <el-image 
                :src="userData.profilePicture"
                @error="() => handleImageError('avatar')"
              />
              <div v-if="isEditing" class="image-upload-overlay">
                <label class="upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    @change="(e) => handleFileChange(e, 'avatar')"
                    class="file-input"
                  />
                  <el-icon v-if="isUploadingAvatar" class="loading"><Loading /></el-icon>
                  <span v-else>Изменить аватар</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="user-info">
            <template v-if="!isEditing">
              <el-text tag="h2" class="username">
                {{ userData.username || 'Пользователь' }}
              </el-text>
              <el-text class="email">{{ userData.email }}</el-text>
            </template>
            
            <template v-else>
              <el-form 
                :model="editableData"
                :rules="editFormRules"
                label-position="top"
                class="edit-form"
              >
                <el-form-item 
                  label="Имя пользователя" 
                  prop="username"
                >
                  <el-input
                    v-model="editableData.username"
                    placeholder="Введите имя пользователя"
                  />
                </el-form-item>
              </el-form>
            </template>
          </div>

          <div class="stats">
            <el-text class="stat-badge">
              <el-text class="stat-text">{{ userData.likes.length }} лайков</el-text>
            </el-text>
            <el-text class="stat-date">
              На сайте с {{ formatDate(userData.createdAt) }}
            </el-text>
          </div>
        </el-aside>
      </el-container>

      <el-container>
        <el-main class="main">
          <el-collapse v-model="activeNames" class="about-section">
            <el-collapse-item name="1">
              <template #title>
                <div class="collapse-header">
                  <span class="title">О себе</span>
                </div>
              </template>
              <div class="collapse-content">
                <template v-if="!isEditing">
                  {{ userData.profileDescription || 'Расскажите о себе' }}
                </template>
                <template v-else>
                  <el-input
                    v-model="editableData.profileDescription"
                    type="textarea"
                    :rows="4"
                    placeholder="Расскажите о себе"
                  />
                </template>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-main>
      </el-container>

      <div class="actions">
        <template v-if="!isEditing">
          <el-button type="primary" @click="startEditing">
            Редактировать профиль
          </el-button>
        </template>
        <template v-else>
          <el-button 
            type="success" 
            @click="saveChanges"
            :loading="isSubmitting"
          >
            Сохранить
          </el-button>
          <el-button @click="cancelEditing">
            Отмена
          </el-button>
        </template>
      </div>
    </el-container>
    <!-- <ListPostCards v-if="userData.posts.length" :posts="userData.posts" :user="userData" /> -->
  </div>
</template>

<style scoped>
.layout {
  width: 95%;
  align-self: center;
  margin-left: 10px;
  background: #0a0d14;
}

.header {
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
}

.header-wrapper {
  position: relative;
  width: 100%;
}

.header-image {
  width: 100%;
  max-height: 300px !important;
  border-radius: 20px;
  margin-bottom: 10px;
  box-shadow: 0 8px 32px rgba(56, 189, 248, 0.2);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-image:hover {
  transform: scale(1.02);
}

.image-wrapper {
  position: relative;
  width: 100%;
}

.image-upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px;
  backdrop-filter: blur(4px);
}

.image-wrapper:hover .image-upload-overlay,
.header-wrapper:hover .image-upload-overlay {
  opacity: 1;
}

.aside {
  width: 100%;
  display: flex;
  align-items: flex-start;
  background: linear-gradient(135deg, #1a2027 0%, #131820 100%);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.profile-image {
  width: 15%;
  margin-right: 20px;
  position: relative;
}

.profile-image :deep(.el-image) {
  border-radius: 20px;
  border: 2px solid rgba(56, 189, 248, 0.4);
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
  width: 100%;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-image :deep(.el-image):hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(56, 189, 248, 0.35);
}

.upload-button {
  background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.upload-button:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
}

.file-input {
  display: none;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.username {
  font-weight: 600;
  font-size: 1.25rem;
  color: #f8fafc;
  text-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
}

.email {
  color: #94a3b8;
  font-size: 0.9rem;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: auto;
}

.stat-badge {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 4px rgba(56, 189, 248, 0.3);
  font-weight: 500;
  border-radius: 15px;
  padding: 12px 20px;
  background: linear-gradient(
    135deg,
    rgba(56, 189, 248, 0.15) 0%,
    rgba(2, 132, 199, 0.25) 50%,
    rgba(56, 189, 248, 0.15) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(56, 189, 248, 0.25);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-badge:hover {
  background: linear-gradient(
    135deg,
    rgba(56, 189, 248, 0.25) 0%,
    rgba(2, 132, 199, 0.35) 50%,
    rgba(56, 189, 248, 0.25) 100%
  );
  transform: translateY(-2px);
  box-shadow: 
    0 8px 12px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    0 0 20px rgba(56, 189, 248, 0.4);
}

.stat-date {
  color: #94a3b8;
  font-size: 0.9rem;
  text-align: right;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 70%;
  padding: 0;
  overflow: hidden;
  margin-bottom: 20px;
}

.about-section {
  width: 99%;
  min-height: 150px;
  margin: 1.5% 0 0 5px;
  background: linear-gradient(135deg, rgba(26, 32, 39, 0.9) 0%, rgba(19, 24, 32, 0.9) 100%);
  border: 1px solid rgba(56, 189, 248, 0.15);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  color: white !important;
}

.about-section :deep(.el-collapse-item__header) {
  padding: 0.4rem 0.6rem;
  background: transparent;
  border-bottom: 1px solid rgba(56, 189, 248, 0.15);
  color: #f8fafc;
}

.about-section :deep(.el-collapse-item__content) {
  padding: 0.4rem 0.6rem;
  width: 95%;
  color: #ffffff !important;
}

.collapse-header .title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #38bdf8;
}

.collapse-content {
  font-size: 0.875rem;
  line-height: 1.4;
  color: #ffffff;
}

.edit-form {
  width: 100%;
  margin-top: 10px;
}

.edit-form :deep(.el-form-item) {
  margin-bottom: 15px;
}

.edit-form :deep(.el-form-item__label) {
  color: #f8fafc;
  font-size: 0.9rem;
}

.edit-form :deep(.el-input__inner) {
  background: #1e293b;
  border-color: rgba(56, 189, 248, 0.25);
  color: #f8fafc;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.edit-form :deep(.el-input__inner):focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.edit-form :deep(.el-form-item__error) {
  color: #fb7185;
}

.actions {
  display: flex;
  gap: 10px;
  padding: 20px;
  justify-content: flex-end;
}

.loading {
  animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .content-container {
    flex-direction: column !important;
    width: 98%;
  }
  
  .aside {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-image {
    width: 40%;
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .user-info {
    width: 100%;
    align-items: center;
  }

  .stats {
    width: 100%;
    align-items: center;
    margin-left: 0;
    margin-top: 20px;
  }
  
  .stat-date {
    text-align: center;
  }
  
  .main {
    width: 100%;
    padding: 0 15px;
  }
  
  .about-section {
    width: 105%;
    margin-left: -10px;
  }
  
  .actions {
    flex-direction: column;
    padding: 20px 15px;
  }

  .upload-button {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}
</style>