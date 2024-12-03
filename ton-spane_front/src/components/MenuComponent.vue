<template>
    <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <h5>SiteName</h5>
        <el-menu-item index="1">
            <router-link to="/tape">
                <el-icon>
                    <House />
                </el-icon>
                <span>Лента</span>
            </router-link>
        </el-menu-item>

        <el-menu-item index="2">
            <router-link to="/clips">
                <el-icon>
                    <Film />
                </el-icon>
                <span>Клипы</span>
            </router-link>
        </el-menu-item>

        <el-menu-item index="3">
            <router-link to="/message">
                <el-icon>
                    <Message />
                </el-icon>
                <span>Сообщения</span>
            </router-link>
        </el-menu-item>

        <el-menu-item index="4">
            <router-link to="/notifications">
                <el-icon>
                    <BellFilled />
                </el-icon>
                <span>Обновления</span>
            </router-link>
        </el-menu-item>

        <el-menu-item index="5">
            <router-link to="/search">
                <el-icon>
                    <Search />
                </el-icon>
                <span>Поиск</span>
            </router-link>
        </el-menu-item>

        <el-menu-item index="6">
            <router-link to="/purchased">
                <img src="../assets/dollar-svgrepo-com.svg" style="margin-left: -5px;" />
                <span>Покупки</span>
            </router-link>
        </el-menu-item>

        <el-menu-item index="7">
            <router-link to="/more">
                <el-icon>
                    <IconMenu />
                </el-icon>
                <span>Еще</span>
            </router-link>
        </el-menu-item>
    </el-menu>
</template>

<script setup>
import { Menu as IconMenu, } from '@element-plus/icons-vue';

const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}
</script>


<style scoped>
.el-menu-vertical-demo {
    border-right: none !important;
    /* Убирает правую границу */
    color: #E5EAF3;
    margin-top: 1em;
}

.el-menu-item {
    border-right: none !important;
    /* Убирает границу у каждого элемента */
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