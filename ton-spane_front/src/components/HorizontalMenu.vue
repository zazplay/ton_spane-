<template>
    <el-menu class='horizontal-menu' default-active="1" @open="handleOpen" @close="handleClose">
        <router-link to="/app/tape">
            <el-menu-item index="1" >
                <el-icon>
                    <House />
                </el-icon>
                <span>Лента</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/clips">
            <el-menu-item index="2">
                <el-icon>
                    <Film />
                </el-icon>
                <span>Клипы</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/message">
            <el-menu-item index="3">
                <el-icon>
                    <Message />
                </el-icon>
                <span>Сообщения</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/search">
            <el-menu-item index="5">
                <el-icon>
                    <Search />
                </el-icon>
                <span>Поиск</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/more">
            <el-menu-item index="7">
                <el-icon>
                    <IconMenu />
                </el-icon>
                <span>Профиль</span>
            </el-menu-item>
        </router-link>
    </el-menu>
</template>

<script setup>
import { Menu as IconMenu, House, Film, Message, Search } from '@element-plus/icons-vue';

const handleOpen = (key, keyPath) => {
    console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
    console.log(key, keyPath);
};
</script>

<style scoped>
/* Основные стили меню */
.horizontal-menu {
    height: 90px;
    position: fixed;
    bottom: 0;
    width: 100%;
    background: linear-gradient(to top, 
        rgba(28, 28, 28, 0.98) 0%,
        rgba(44, 44, 44, 0.95) 100%);
    z-index: 1000;
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: space-around;
    align-items: stretch;
}

/* Стили для ссылок-контейнеров */
.horizontal-menu a {
    flex: 1;
    display: flex;
    align-items: stretch;
    justify-content: center;
    color: inherit !important;
    text-decoration: none !important;
    min-width: 64px;
    max-width: 100px;
}

/* Стили элементов меню */
.horizontal-menu .el-menu-item {
    width: 100%;
    height: 100% !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    margin: 0;
    border: none !important;
    color: #E5EAF3;
    gap: 6px;
    position: relative;
}

/* Контейнер для иконки */
.horizontal-menu .el-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    transition: transform 0.3s ease;
    margin: 0;
}

/* Текст под иконками */
.horizontal-menu .el-menu-item span {
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    width: 100%;
    line-height: 1;
    padding: 0 4px;
    margin: 0;
}

/* Активное состояние */
.horizontal-menu .el-menu-item.is-active {
    color: #4f8cff !important;
    background: transparent !important;
}

.horizontal-menu .el-menu-item.is-active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40%;
    height: 3px;
    background: linear-gradient(90deg, #4f8cff 0%, #2563eb 100%);
    border-radius: 2px 2px 0 0;
}

/* Эффекты при наведении */
.horizontal-menu .el-menu-item:hover {
    background-color: transparent !important;
    color: #4f8cff !important;
}

.horizontal-menu .el-menu-item:hover .el-icon {
    transform: translateY(-2px);
}

/* Эффект при нажатии */
.horizontal-menu .el-menu-item:active {
    transform: scale(0.95);
}

/* Safe area для iPhone */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
    .horizontal-menu {
        padding-bottom: env(safe-area-inset-bottom);
        height: calc(90px + env(safe-area-inset-bottom));
    }
    
    .horizontal-menu .el-menu-item {
        padding-bottom: env(safe-area-inset-bottom);
    }
}

/* Анимация появления */
@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.horizontal-menu {
    animation: slideUp 0.3s ease-out;
}
</style>