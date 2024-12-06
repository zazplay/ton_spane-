<template>
    <el-container class="container-profile" @click="handleClickMess">
        <el-aside width="100px" style="padding: 0; margin: 0;">
            <el-container class="container-img">
                <div class="demo-basic--circle">
                    <div class="block">
                        <el-avatar shape="square" :size="size" :src="url" />
                    </div>
                </div>
            </el-container>
        </el-aside>
        <el-main class="info-container-profile">
            <span style="color: aliceblue;">Имя</span>
            <span>Текст сообщения</span>
        </el-main>
    </el-container>
</template>

<script setup>

import { useRouter } from 'vue-router'; // Импортируйте useRouter
const router = useRouter(); // Получите экземпляр маршрутизатора


// Метод для обработки клика и перехода на страницу чата
const handleClickMess = () => {
    console.log("chat");
    const chatId = '123'; // Замените на реальный ID чата
    router.push({ name: 'UserChat', params: { id: chatId } }); // Переход на страницу чата с передачей id
};

const size = 58;
const url = 'https://www.ifoto.ai/blog/wp-content/uploads/ai-swimsuit-models.jpg';
</script>

<style scoped>
.container-profile {
    flex: none !important;
    width: 80% !important;
    margin: 0 auto;
    background-color: grey;
    border-radius: 15px;
    height: 75px;
    overflow: hidden;

}

.container-img {
    padding: 7px;
    padding-left: 15px;
}

.info-container-profile {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: start;
    padding: 0;
}


.demo-basic {
    text-align: center;
}

.demo-basic .demo-basic--circle,
.demo-basic .demo-basic--square {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
}

.demo-basic .block:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
}

.demo-basic .block {
    flex: 1;

}

.demo-basic .el-col:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
}

@media (max-width: 1200px) {
    .container-profile {
        flex: none !important;
        width: 80% !important;
        margin: 0 auto !important;
        background-color: grey;
        border-radius: 15px;
        height: 75px;
        overflow: hidden;

    }

    .container-img {
        padding: 0 !important;
        padding-left: 7px !important;
    }

    .info-container-profile {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: start;
    }
}
</style>