<script lang="js" setup>
import { ref } from 'vue';
import PostsAP from './PostsAP.vue';
import ProfilesForAp from './ProfilesForAP.vue';
import BotsPage from './BotsPage.vue';

const activeIndex = ref('1'); // Визначаємо активний індекс

// Функція для отримання контенту в залежності від активної вкладки
const contentMap = {
    '1': ProfilesForAp,
    '2': BotsPage,
    '3': PostsAP,
};

// Функція для обробки вибору вкладки
const handleSelect = (index) => {
    activeIndex.value = index;  // Оновлюємо активний індекс
};
</script>

<template>
    <div class="layout-container">
        <!-- Закріплене меню -->
        <div class="fixed-tabs">
            <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1" >Профили</el-menu-item>
                <el-menu-item index="2" >Боты</el-menu-item>
                <el-menu-item index="3">Посты</el-menu-item>
            </el-menu>
        </div>

        <!-- Змінюваний контент -->
        <div class="content">
            <component :is="contentMap[activeIndex]" />
        </div>
    </div>
</template>

<style scoped>
.layout-container {
    width: 80vw;
    margin: 0 auto;
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.fixed-tabs {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    width: 80vw;
    background-color: rgb(22, 22, 22);
    
}
.el-menu-item{
    font-size: larger;
}
.content {
    padding: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
}

@media (max-width: 1200px) {
    .layout-container {
        width: 100% !important;
    }

    .fixed-tabs {
        width: 100% !important;
    }

    .content {
        padding-top:0;
        max-width: 100%;
    }
}
</style>
