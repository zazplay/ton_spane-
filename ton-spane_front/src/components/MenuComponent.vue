<template>
    <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <h2 class="menu-title">Меню</h2>

        <router-link to="/app/tape">
            <el-menu-item index="1" class="menu-item">
                <el-icon><House /></el-icon>
                <span>Лента</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/clips">
            <el-menu-item index="2" class="menu-item">
                <el-icon><Film /></el-icon>
                <span>Клипы</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/message">
            <el-menu-item index="3" class="menu-item">
                <el-icon><Message /></el-icon>
                <span>Сообщения</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/notifications">
            <el-menu-item index="4" class="menu-item">
                <el-icon><BellFilled /></el-icon>
                <span>Обновления</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/search">
            <el-menu-item index="5" class="menu-item">
                <el-icon><Search /></el-icon>
                <span>Поиск</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/purchased">
            <el-menu-item index="6" class="menu-item">
                <img src="../assets/dollar-svgrepo-com.svg" class="custom-icon" alt="Dollar icon" />
                <span>Покупки</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/more">
            <el-menu-item index="7" class="menu-item">
                <el-icon><IconMenu /></el-icon>
                <span>Еще</span>
            </el-menu-item>
        </router-link>
    </el-menu>
</template>

<script setup>
import { Menu as IconMenu } from '@element-plus/icons-vue';

const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}
</script>

<style scoped>
.el-menu-vertical-demo {
    width: max-content !important;
    border-right: none !important;
    color: #E5EAF3;
    margin-top: 1em;
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 12px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.menu-title {
    color: #E5EAF3;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 20px 0;
    padding: 0 16px;
    background: linear-gradient(135deg, #4f8cff 0%, #2563eb 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 10px rgba(79, 140, 255, 0.3);
}

.menu-item {
    border-right: none !important;
    font-size: 18px !important;
    font-weight: bold;
    margin: 8px 8px;
    border-radius: 12px;
    transition: all 0.3s ease;
    
}

.el-menu-item {
    height: 50px !important;
}

.menu-item:hover {
    background: rgba(79, 140, 255, 0.1) !important;
    transform: translateX(5px);
}

.menu-item.is-active {
    background: linear-gradient(90deg, rgba(79, 140, 255, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%) !important;
    color: #4f8cff !important;
}

.el-icon {
    font-size: 20px;
    transition: transform 0.3s ease;
}

.menu-item:hover .el-icon {
    transform: scale(1.1);
}

.custom-icon {
    width: 40px;
    height: 40px;
    margin-left: -5px;
    transition: transform 0.3s ease;
}

.menu-item:hover .custom-icon {
    transform: scale(1.1);
}

/* Сброс стилей для ссылок */
a:-webkit-any-link {
    color: inherit !important;
    cursor: pointer !important;
    text-decoration: none !important;
    display: block;
}

/* Стили для router-link */
router-link {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
}

/* Анимация появления меню */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.el-menu-vertical-demo {
    animation: slideIn 0.3s ease-out;
}

/* Эффект при нажатии */
.menu-item:active {
    transform: scale(0.98) translateX(5px);
}

/* Стили для текста пунктов меню */
.menu-item span {
    font-weight: 500;
    letter-spacing: 0.3px;
}
</style>