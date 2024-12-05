<template>
    <el-menu default-active="1" class="el-menu-vertical-demo" style="width: 100px;" @open="handleOpen"
        @close="handleClose">
        <h2>DreamScape</h2>

        <router-link to="/tape">
            <el-menu-item index="1">
                <el-icon>
                    <House />
                </el-icon>
                <span>Лента</span>
            </el-menu-item>
        </router-link>

        <router-link to="/clips">
            <el-menu-item index="2">
                <el-icon>
                    <Film />
                </el-icon>
                <span>Клипы</span>
            </el-menu-item>
        </router-link>

        <router-link to="/message">
            <el-menu-item index="3">
                <el-icon>
                    <Message />
                </el-icon>
                <span>Сообщения</span>
            </el-menu-item>
        </router-link>

        <router-link to="/notifications">
            <el-menu-item index="4">
                <el-icon>
                    <BellFilled />
                </el-icon>
                <span>Обновления</span>
            </el-menu-item>
        </router-link>

        <router-link to="/search">
            <el-menu-item index="5">
                <el-icon>
                    <Search />
                </el-icon>
                <span>Поиск</span>
            </el-menu-item>
        </router-link>

        <router-link to="/purchased">
            <el-menu-item index="6">
                <img src="../assets/dollar-svgrepo-com.svg" style="margin-left: -5px;" />
                <span>Покупки</span>
            </el-menu-item>
        </router-link>

        <router-link to="/more">
            <el-menu-item index="7">
                <el-icon>
                    <IconMenu />
                </el-icon>
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
    /* Убирает правую границу */
    color: #E5EAF3;
    margin-top: 1em;
    
}

.el-menu-item {
    border-right: none !important;
    /* Убирает границу у каждого элемента */
    font-size: 18px;
    font-weight: bold;
}

/* Сброс стилей для всех ссылок */
a:-webkit-any-link {
    color: inherit !important;
    /* Наследовать цвет, не использовать цвет для ссылок */
    cursor: inherit !important;
    /* Наследовать курсор */
    text-decoration: none !important;
    /* Убрать подчеркивание */
}

/* Или если конкретно для router-link */
router-link {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
}
</style>