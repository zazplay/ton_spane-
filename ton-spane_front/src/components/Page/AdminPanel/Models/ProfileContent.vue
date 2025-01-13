<script setup>
import { ref, onMounted, watch, onUnmounted,defineProps,reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import config from '@/config'
import PostsAP from '../PostsAPForUser.vue'
import CreatePost from './AddPostForm.vue'
import ChatPage from './Chats/ChatsPage.vue'
const showChats = ref(false)

// Добавляем метод открытия чатов вместо startEditing
const openChats = () => {
  showChats.value = true
}

const props = defineProps({
   userIdProp: {
       type: String,
       required: false,
   },
});

const showPostModal = ref(false)
const userLikes = ref(0)
const userSubscription = ref(0)

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
   posts: [],
   likes: [],
})

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

       const response = await fetch(`${config.API_BASE_URL}/models/${props.userIdProp}/${endpoint}`, {
           method: 'PATCH',
           body: formData
       })

       if (!response.ok) throw new Error('Failed to upload image')

       const contentType = response.headers.get("content-type")
       let data = {}

       if (contentType && contentType.includes("application/json")) {
           data = await response.json()
       } else {
           data = {
               [type === 'avatar' ? 'profilePicture' : 'profileHeader']: URL.createObjectURL(file)
           }
       }

       if (type === 'avatar') {
           userData.value.profilePicture = formatImageUrl(data.profilePicture) || URL.createObjectURL(file)
       } else {
           userData.value.profileHeader = formatImageUrl(data.profileHeader) || URL.createObjectURL(file)
       }

       ElMessage.success('Изображение успешно обновлено')
       await fetchUserData()

   } catch (error) {
       console.error('Error uploading image:', error)
       ElMessage.error('Ошибка при загрузке изображения')
   } finally {
       loadingState.value = false
   }
}

const handleFileChange = async (event, type) => {
   const file = event.target.files[0]
   if (!file) return

   if (!file.type.startsWith('image/')) {
       ElMessage.error('Пожалуйста, выберите изображение')
       return
   }

   const maxSize = 5 * 1024 * 1024
   if (file.size > maxSize) {
       ElMessage.error('Размер файла не должен превышать 5MB')
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

       const response = await fetch(`${config.API_BASE_URL}/models/${props.userIdProp}`, {
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

       ElMessage.success('Профиль успешно обновлен')
       isEditing.value = false
       await initializeUserData()
   } catch (error) {
       console.error('Error updating profile:', error)
       ElMessage.error('Ошибка при обновлении профиля')
   } finally {
       isSubmitting.value = false
   }
}

// Fetch user subscriptions
const fetchUserSubs = async () => {
  try {
    userSubscription.value = 0
    const response = await fetch(
      `${config.API_BASE_URL}/subscriptions/${props.userIdProp}/followers`
    )
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const followers = await response.json()
    
    if (Array.isArray(followers)) {
      userSubscription.value = followers.length
    }
  } catch (err) {
    console.error('Error fetching user subscriptions:', err)
    userSubscription.value = 0
  }
}

const fetchUserData = async () => {
   try {
       const response = await fetch(`${config.API_BASE_URL}/models/${props.userIdProp}`)
       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
       const data = await response.json()

       userData.value = {
           ...data,
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
   try {
       const response = await fetch(`${config.API_BASE_URL}/posts/user/${props.userIdProp}/requester/${props.userIdProp}`);
       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
       const data = await response.json();

       const formattedPosts = data.map(post => ({
           ...post,
           id: post.id,
           imageUrl: post.imageUrl.includes(S3_BASE_URL)
               ? post.imageUrl.replace(S3_BASE_URL, S3_BASE_URL)
               : post.imageUrl,
           caption: post.caption || '',
           price: String(post.price),
           isBlurred: post.isBlurred || false,
           createdAt: post.createdAt,
           user: {
               id: props.userIdProp,
               username: userData.value.username,
               email: userData.value.email || '',
               profilePicture: userData.value.profilePicture
           },
           initialLiked: false,
           initialShared: false,
           initialDonated: false,
           initialSubscribed: false
       }));

       userData.value.posts = formattedPosts;
       userLikes.value = formattedPosts.reduce((total, post) => total + (post.likes?.length || 0), 0);
   } catch (err) {
       console.error('Error fetching user posts:', err);
       userData.value.posts = [];
       userLikes.value = 0;
   }
}

const preparePostsData = (posts) => {
   return posts.map(post => ({
       ...post,
       id: post.id,
       userId: props.userIdProp,
       imageUrl: formatImageUrl(post.imageUrl),
       price: String(post.price),
       isBlurred: post.isBlurred || false,
       caption: post.caption || ''
   }))
}

const initializeUserData = async () => {
   await fetchUserData()
   await Promise.all([
     fetchUserPosts(),
     fetchUserSubs()
   ])
}

const showSubscribersModal = ref(false)
const subscribersForm = reactive({
    count: 1
})
const isAddingSubscribers = ref(false)

// Функция добавления подписчиков
const handleAddSubscribers = async () => {
    try {
        isAddingSubscribers.value = true
        const results = await addMultipleSubscribers(subscribersForm.count)
        
        // Показываем результат
        ElMessage({
            message: `Успешно добавлено ${results.successful} подписчиков, ${results.failed} не удалось`,
            type: results.failed === 0 ? 'success' : 'warning'
        })
        
        showSubscribersModal.value = false
    } catch (error) {
        ElMessage.error('Произошла ошибка при добавлении подписчиков')
    } finally {
        isAddingSubscribers.value = false
    }
}



// Функция добавления множественных подписчиков
const addMultipleSubscribers = async (subscribersCount) => {
    const results = {
        successful: 0,
        failed: 0
    };

    try {
        // Создаем все запросы сразу
        const requests = Array(subscribersCount).fill().map(() => 
            fetch(
                `https://ton-back-e015fa79eb60.herokuapp.com/api/subscriptions/49c598e5-3a2e-47ce-9e03-db88b8dc6977/follow/${props.userIdProp}`,
                {
                    method: 'POST',
                    headers: {
                        'accept': '*/*'
                    }
                }
            )
        );

        // Разбиваем запросы на чанки по 200 для избежания перегрузки браузера
        const chunkSize = 200;
        for (let i = 0; i < requests.length; i += chunkSize) {
            const chunk = requests.slice(i, i + chunkSize);
            const responses = await Promise.allSettled(chunk);
            
            responses.forEach(response => {
                if (response.status === 'fulfilled' && response.value.status === 201) {
                    results.successful++;
                } else {
                    results.failed++;
                }
            });

            // Минимальная задержка между чанками
            if (i + chunkSize < requests.length) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        await initializeUserData();
    } catch (err) {
        console.error('Error in batch subscriber addition:', err);
    }

    return results;
}

const handlePostsUpdate = async () => {
   console.log("Data update triggered")
   await initializeUserData()
}

watch(() => props.userIdProp, (newValue) => {
   if (newValue) {
       initializeUserData()
   }
})

onMounted(() => {
   initializeUserData()
   window.addEventListener('postsDataChanged', handlePostsUpdate)
})

onUnmounted(() => {
   window.removeEventListener('postsDataChanged', handlePostsUpdate)
})
</script>

<template>
    <div v-if="isLoaded" class="layout">
        <el-container>
            <el-header class="header">
                <div class="header-wrapper">
                    <el-image class="header-image" :src="userData.profileHeader" fit="cover"
                        @error="() => handleImageError('header')" />
                    <div v-if="isEditing" class="image-upload-overlay">
                        <label class="upload-button">
                            <input type="file" accept="image/*" @change="(e) => handleFileChange(e, 'header')"
                                class="file-input" />
                            <el-icon v-if="isUploadingHeader" class="loading">
                                <Loading />
                            </el-icon>
                            <span v-else>Изменить шапку профиля</span>
                        </label>
                    </div>
                </div>
            </el-header>

            <el-container class="content-container">
                <el-aside class="aside">
                    <div class="profile-image">
                        <div class="image-wrapper">
                            <el-image :src="userData.profilePicture" @error="() => handleImageError('avatar')" />
                            <div v-if="isEditing" class="image-upload-overlay">
                                <label class="upload-button">
                                    <input type="file" accept="image/*" @change="(e) => handleFileChange(e, 'avatar')"
                                        class="file-input" />
                                    <el-icon v-if="isUploadingAvatar" class="loading">
                                        <Loading />
                                    </el-icon>
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
                            <el-form :model="editableData" :rules="editFormRules" label-position="top"
                                class="edit-form">
                                <el-form-item label="Имя пользователя" prop="username">
                                    <el-input v-model="editableData.username" placeholder="Введите имя пользователя" />
                                </el-form-item>
                            </el-form>
                        </template>
                    </div>

                    <div class="stats">
                        <el-text class="stat-badge" type="primary">
                            <el-text class="stat-text">{{ userData.posts.length }} публикации</el-text>
                        </el-text>
                        <el-text class="stat-badgeLikes" type="primary"> <el-text class="stat-text">{{ userLikes }}  лайков</el-text></el-text>

                                
                           
                        <div style="display: flex; flex-direction: column; align-items: center; margin-top: -20px" >
                        <div style="display: flex; flex-direction: row; align-items: center; margin-left: 15px;">
                            <el-icon size="35px" color="green" @click="showSubscribersModal = true"><CirclePlusFilled/></el-icon>
                        </div>
                        <el-text class="stat-badgeSubs" type="primary">
                            <el-text class="stat-text">{{ userSubscription }} подписчиков</el-text>
                        </el-text>
                        </div>
                       
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
                                    <el-input v-model="editableData.profileDescription" type="textarea" :rows="4"
                                        placeholder="Расскажите о себе" />
                                </template>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-main>
            </el-container>

            <div class="actions">
                <template v-if="!isEditing">
                    <el-button class="openChatsButton" type="primary" @click="openChats">
                        Открыть чаты
                    </el-button>
                    <el-dialog
  v-model="showChats"
  :fullscreen="false"
  :show-close="true"
  :close-on-click-modal="false"
  :destroy-on-close="true"
>
  <ChatPage 
    :model-id="props.userIdProp"
    @close="showChats = false"
  /></el-dialog>

                    <el-button type="primary" @click="startEditing">
                        Редактировать профиль
                    </el-button>
                    <div class="create-post-button">
                        <el-button 
                            type="primary" 
                            @click="showPostModal = true"
                            class="add-post-btn"
                        >
                            Добавить пост
                        </el-button>
                    </div>
                </template>
                
                <template v-else>
                    <el-button type="success" @click="saveChanges" :loading="isSubmitting">
                        Сохранить
                    </el-button>
                    <el-button @click="cancelEditing">
                        Отмена
                    </el-button>
                </template>
            </div>
        </el-container>
        <div style="position: relative;">
            <PostsAP v-if="userData.posts.length" 
                :postsParam="userData.posts" 
                :user="userData" 
                :userId="userData.id"
                :showAddButton="true" 
            />
        </div>
        <CreatePost 
            :isOpen="showPostModal"
            :userId="props.userIdProp" 
            @close="showPostModal = false"
        />

        
    </div>
    <div v-else class="loading-container">
        <el-skeleton :rows="3" animated />
    </div>


    <el-dialog
            v-model="showSubscribersModal"
            title="Добавить подписчиков"
            width="30%"
            :close-on-click-modal="false"
        >
            <el-form :model="subscribersForm">
                <el-form-item label="Количество подписчиков">
                    <el-input-number 
                        v-model="subscribersForm.count"
                        :min="1"
                        :max="100"
                        controls-position="right"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="showSubscribersModal = false">Отмена</el-button>
                    <el-button
                        type="primary"
                        @click="handleAddSubscribers"
                        :loading="isAddingSubscribers"
                    >
                        Добавить
                    </el-button>
                </span>
            </template>
        </el-dialog>

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
    flex-direction: row;
    gap: 10px;
    margin-left: auto;
    
}

.stat-badge,
.stat-badgeLikes,
.stat-badgeSubs {
    text-align: center;
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;
    border-radius: 15px;
    padding: 12px 20px;
    width: auto;
    margin-left: 20px;
    backdrop-filter: blur(10px);
    transition: all 0.4s ease;
}

.stat-badge {
    text-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
    background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 0.1) 0%,
        rgba(79, 70, 229, 0.2) 50%,
        rgba(99, 102, 241, 0.1) 100%
    );
    border: 1px solid rgba(99, 102, 241, 0.2);
    box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.1);
}

.stat-badgeLikes {
    text-shadow: 0 2px 4px rgba(244, 63, 94, 0.5);
    background: linear-gradient(
        135deg,
        rgba(244, 63, 94, 0.2) 0%,
        rgba(225, 29, 72, 0.35) 50%, 
        rgba(244, 63, 94, 0.2) 100%
    );
    border: 1px solid rgba(244, 63, 94, 0.3);
    box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.2),
        0 0 15px rgba(244, 63, 94, 0.2);
}

.stat-badgeSubs {
    text-shadow: 0 2px 4px rgba(139, 92, 246, 0.5);
    background: linear-gradient(
        135deg,
        rgba(139, 92, 246, 0.2) 0%,
        rgba(124, 58, 237, 0.35) 50%,
        rgba(139, 92, 246, 0.2) 100%
    );
    border: 1px solid rgba(139, 92, 246, 0.3);
    box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.2),
        0 0 15px rgba(139, 92, 246, 0.2);
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

.openChatsButton{
    margin-right: 200px !important;

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
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
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
        padding: 5px;
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
        width: 90%;
        align-items: center;
        margin-left: 0;
        margin-top: 20px;

    }

    .stat-badge,
.stat-badgeLikes,
.stat-badgeSubs {
    
    margin-left: 5px;
    width: auto;
    padding-left: 5px;
    padding-right: 5px;
    

    
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