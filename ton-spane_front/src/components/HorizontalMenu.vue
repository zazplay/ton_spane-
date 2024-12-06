<template>
    <el-menu class='horizontal-menu' default-active="1" @open="handleOpen" @close="handleClose">
        <router-link to="/tape">
            <el-menu-item index="1" >
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

        <router-link to="/search">
            <el-menu-item index="5">
                <el-icon>
                    <Search />
                </el-icon>
                <span>Поиск</span>
            </el-menu-item>
        </router-link>

        <router-link to="/more">
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
.el-menu-vertical-demo {
    border-right: none !important;
    color: #E5EAF3;
    margin-top: 1em;
}

.el-menu-item {
    border-right: none !important;
    font-size: medium !important;
}

/* Для горизонтального меню */
.horizontal-menu {
    height: 90px;
    display: flex;
    flex-direction: row;
    position:fixed;
    bottom: 0;
    width: 100%;
    background: #2c2c2c;
    justify-content: space-evenly;
    z-index: 1000;
    padding-left: 10px;
}

.horizontal-menu .el-menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
    padding-left: 0 !important;
}

.horizontal-menu .el-icon {
    margin-bottom: 0px;
}

/* Сброс стилей для ссылок */
a:-webkit-any-link {
    color: inherit !important;
    cursor: inherit !important;
    text-decoration: none !important;
}

.horizontal-menu .el-menu-item:hover {
    background-color: transparent !important;
    /* color: inherit !important; */
    cursor: default !important;
}
</style>