<!--PostComponent-->
<template>
    <el-card class="post-card">
        <div class="header">
            <el-avatar :size="50" class="avatar" :src="user.profilePicture" />
            <div class="user-info">
                <!-- <router-link class="username"> -->
                    <div  class="username">
                        {{ props.user.username }}
                    </div>
                <!-- </router-link> -->
                <el-text></el-text>
                <el-text class="date">{{ formatDate(createdAt) }}</el-text>
            </div>
        </div>
 
        <div class="image-container">
            <el-image 
                class="post-image" 
                :class="{ 'blurred': isBlurred }" 
                :src="formattedImageUrl" 
                :zoom-rate="1.2"
                :max-scale="7" 
                :min-scale="0.2" 
                :preview-src-list="isBlurred ? [] : [formattedImageUrl]" 
                :initial-index="4"
                fit="cover" 
                :preview-teleported="true"
            >
                <template #error>
                    <div class="image-slot"></div>
                </template>
            </el-image>
 
            <div v-if="isBlurred" class="lock-overlay">
                <el-icon :size="50" class="lock-icon">
                    <Lock />
                </el-icon>
                <span class="lock-text">{{ props.price }}$</span>
            </div>
        </div>
 
        <div class="actions">
            <div class="action-buttons">
                <el-check-tag class="action-tag heart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none"
                        stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </el-check-tag>
 
                <el-check-tag class="action-tag share">
                    <el-icon size="25px">
                        <Share />
                    </el-icon>
                </el-check-tag>
 
                <el-check-tag class="action-tag donate">
                    <el-icon size="25px">
                        <Money />
                    </el-icon>
                </el-check-tag>
            </div>
            
            <el-text class="description" tag="b" emphasis>
                {{ props.caption.length > 100 ? props.caption.slice(0, 100) + '...' : caption }}
            </el-text>
        </div>
    </el-card>
 </template>
 
 <script setup>
 import { computed,defineProps } from 'vue'
 import { Lock } from '@element-plus/icons-vue'
 
 const props = defineProps({
    id: { type: String, required: true },
    caption: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    isBlurred: { type: Boolean, default: false },
    price: { type: String, default: '' },
    createdAt: { type: String, required: true },
    user: { type: Object, required: false }
 })
 
 const formattedImageUrl = computed(() => {
    const baseUrl = 'https://tonimages.s3.us-east-1.amazonaws.com/';
    if (props.imageUrl.includes(baseUrl + baseUrl)) {
        return props.imageUrl.replace(baseUrl + baseUrl, baseUrl);
    }
    return props.imageUrl;
 })
 
 const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
 
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`
    if (diffInHours < 24) return `${diffInHours} ч назад`
    if (diffInDays < 7) return `${diffInDays} дн назад`
    
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
 }
 </script>
 
 <style scoped>
 .post-card {
    width: auto;
    margin-top: 10px;
 }
 
 .header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
 }
 
 .user-info {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    margin-right: auto;
 }
 
 .date {
    font-size: 12px;
    margin-left: -10px;
    color: #909399;
 }
 
 .image-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
 }
 
 .post-image {
    min-height: 400px;
    width: 80%;
    object-fit: cover;
    object-position: center center;
 }
 
 .blurred {
    filter: blur(30px);
 }
 
 .lock-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    z-index: 2;
 }
 
 .lock-icon {
    color: white;
    background: rgba(0, 0, 0, 0.5);
    padding: 15px;
    border-radius: 50%;
    backdrop-filter: blur(4px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
 }
 
 .lock-text {
    color: white;
    font-size: 24px;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 15px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
 }
 
 .actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
 }
 
 .action-buttons {
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: fit-content;
 }
 
 .action-tag {
    display: flex;
    align-items: center;
    padding: 5px;
 }
 
 .action-tag.heart {
    border-color: red;
    color: red;
 }
 
 .action-tag.share {
    border-color: #E6A23C;
    color: #E6A23C;
 }
 
 .action-tag.donate {
    border-color: green;
    color: green;
 }
 
 .description {
    width: 500px;
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
    background-color: transparent;
    transition: all 0.3s ease;
    margin-left: auto;
    font-size: 16px;
 }
 
 .description:hover {
    box-shadow: 0 0 15px rgba(74, 144, 226, 0.5);
    border-color: #357abd;
 }
 
 @media (max-width: 480px) {
    .post-card {
        width: 95%;
        align-self: center;
        margin: 0 auto;
    }
 
    .date {
        font-size: 12px !important;
    }
 
    .avatar {
        width: 40px !important;
        height: 40px !important;
    }
 
    .post-image {
        max-height: 400px;
        min-height: 300px;
        width: 100%;
    }
 
    .lock-icon {
        font-size: 30px;
        padding: 10px;
    }
 
    .lock-text {
        font-size: 18px;
        padding: 3px 10px;
    }
 
    .actions {
        flex-wrap: wrap;
        justify-content: flex-start;
    }
 
    .description {
        width: 100%;
        margin-left: 0;
        font-size: 12px;
        text-align: left;
        justify-content: flex-start;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100% - 10px);
        padding: 5px;
    }
 }
 </style>