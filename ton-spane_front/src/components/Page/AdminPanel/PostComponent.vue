<template>
    <el-card class="post-card">
        <div class="header">

            <el-avatar :size="50" class="avatar" :src="user.profilePicture" />
            <div class="user-info">
                <router-link :to="`/app/user/${user.id}`" class="username">
                    {{ props.user.username }}
                </router-link>
                <el-text></el-text>
                <el-text class="date">{{ formatDate(createdAt) }}</el-text>
            </div>
        </div>

        <div class="demo-image__preview">
            <div class="image-container">
                <el-image class="post-image" :class="{ 'blurred': isBlurred }" :src="imageUrl" :zoom-rate="1.2"
                    :max-scale="7" :min-scale="0.2" :preview-src-list="isBlurred ? [] : [imageUrl]" :initial-index="4"
                    fit="cover" @error="() => { }" :preview-teleported="true">
                    <template #error>
                        <div class="image-slot">
                        </div>
                    </template>
                </el-image>

                <!-- Добавить этот блок -->
                <div v-if="isBlurred" class="lock-overlay">
                    <el-icon :size="50" class="lock-icon">
                        <Lock />
                    </el-icon>
                    <span class="lock-text">{{ props.price }}$</span>
                </div>
            </div>
        </div>

        <div class="actions">
            <div class="action-buttons">
                <el-check-tag  class="action-tag heart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"
                        :fill="'none'" stroke="red" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </el-check-tag>

                <el-check-tag   class="action-tag share">
                    <el-icon size="25px">
                        <Share />
                    </el-icon>
                </el-check-tag>

                <el-check-tag   class="action-tag donate">
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
import { defineProps } from 'vue'
import { Lock } from '@element-plus/icons-vue' // добавляем импорт иконки

const props = defineProps({
    id: { type: String, required: true },
    caption: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    isBlurred: { type: Boolean, default: false },
    price: { type: String, default: '0' },
    createdAt: { type: String, required: true },
    user: {
        type: Object,
        default: () => ({
            id: '',
            username: '',
            email: '',
            profilePicture: null
        })
    },
})

const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 60) {
        return `${diffInMinutes} мин назад`
    } else if (diffInHours < 24) {
        return `${diffInHours} ч назад`
    } else if (diffInDays < 7) {
        return `${diffInDays} дн назад`
    } else {
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }
}

</script>

<style scoped>
.post-card {
    width: auto;
    margin-bottom: 30px;

    @media (max-width: 480px) {
        width: 95%;
        align-self: center;
    }
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

.username {
    font-size: 20px;
    line-height: 1.2;
    color: #ffffff;
    text-decoration: none;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    padding-bottom: 2px;
    display: inline-block;

    /* Красивое подчеркивание с анимацией */
    &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 0;
        left: 0;
        background: linear-gradient(90deg, #4f8cff 0%, #2563eb 100%);
        transition: width 0.3s ease;
        border-radius: 2px;
    }

    /* При наведении */
    &:hover {
        color: #4f8cff;
        transform: translateY(-1px);

        &::after {
            width: 100%;
        }
    }

    /* При нажатии */
    &:active {
        transform: translateY(1px);
    }

    @media (max-width: 480px) {
        width: 100%;
        font-size: 14px !important;
    }
}

.date {
    font-size: 12px;
    margin-left: -10px;
    color: #909399;

    @media (max-width: 480px) {
        font-size: 12px !important;
    }
}

.subBtn {
    width: auto !important;
    font-size: 16px !important;

    @media (max-width: 480px) {
        width: 40% !important;
        height: 30px !important;
        font-size: 12px !important;
        padding: 0 10px !important;
    }
}

.avatar {
    @media (max-width: 480px) {
        width: 40px !important;
        height: 40px !important;
    }
}

.post-image {
    min-height: 400px;
    width: 80%;
    object-fit: cover;
    object-position: center center;

    @media (max-width: 480px) {
        max-height: 400px;
        min-height: 300px;
        width: 100%;
        object-fit: cover;
        object-position: center center;
    }
}

.blurred {
    filter: blur(30px);
}

.price-overlay {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: bold;
}

.actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 15px;

    @media (max-width: 480px) {
        flex-wrap: wrap;
        justify-content: flex-start;
    }
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

    @media (max-width: 480px) {
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

.description:hover {
    box-shadow: 0 0 15px rgba(74, 144, 226, 0.5);
    border-color: #357abd;
}

.image-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
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

/* Добавить в медиа-запрос для мобильных устройств */
@media (max-width: 480px) {
    .lock-icon {
        font-size: 30px;
        padding: 10px;
    }

    .lock-text {
        font-size: 18px;
        padding: 3px 10px;
    }
}
</style>