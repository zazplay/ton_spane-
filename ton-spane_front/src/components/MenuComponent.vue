<template>
    <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <h5>SiteName</h5>
        <el-menu-item index="1">
            <el-icon>
                <House />
            </el-icon>
            <span>Лента</span>
        </el-menu-item>

        <el-menu-item index="2">
            <el-icon>
                <Film />
            </el-icon>
            <span>Клипы</span>
        </el-menu-item>

        <el-menu-item index="3">
            <el-icon>
                <Message />
            </el-icon>
            <span>Сообщения</span>
        </el-menu-item>

        <el-menu-item index="4">
            <el-icon>
                <BellFilled />
            </el-icon>
            <span>Обновления</span>
        </el-menu-item>

        <el-menu-item index="5">
            <el-icon>
                <Search />
            </el-icon>
            <span>Поиск</span>
        </el-menu-item>

        <el-menu-item index="6">
            <img src="../assets/dollar-svgrepo-com.svg" style=" margin-left: -5px;" />
            <span>Покупки</span>
        </el-menu-item>

        <el-menu-item index="7">
            <el-icon>
                <IconMenu />
            </el-icon>
            <span>Еще</span>
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
</style>