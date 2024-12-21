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
            <span style="color: aliceblue;" >Имя</span>
            <span>Текст сообщения</span>
        </el-main>
    </el-container>
</template>

<script setup>

// import { useRouter } from 'vue-router'; // Импортируйте useRouter
// const router = useRouter(); // Получите экземпляр маршрутизатора


// Метод для обработки клика и перехода на страницу чата
const handleClickMess = () => {
    console.log("chat");
    // const chatId = '123'; // Замените на реальный ID чата
    // router.push({ name: 'UserChat', params: { id: chatId } }); // Переход на страницу чата с передачей id
};

const size = 58;
const url = 'https://www.ifoto.ai/blog/wp-content/uploads/ai-swimsuit-models.jpg';
</script>

<style scoped>
html.dark .container-profile {
    flex: none !important;
    width: 80% !important;
    margin: 0 auto;
    background: linear-gradient(145deg, #2a2d3a, #1f2229);
    border-radius: 16px;
    height: 80px;
    overflow: hidden;
    box-shadow: 
        0 8px 20px rgba(0, 0, 0, 0.15),
        inset 0 1px 1px rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
}

/* Светлая тема - .container-profile */
html:not(.dark) .container-profile {
    flex: none !important;
    width: 80% !important;
    margin: 0 auto;
    background: linear-gradient(145deg, #f0f4f8, #e6e9f0);
    border-radius: 16px;
    height: 80px;
    overflow: hidden;
    box-shadow: 
        0 8px 20px rgba(0, 0, 0, 0.1),
        inset 0 1px 1px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

/* Темная тема - .container-profile:hover */
html.dark .container-profile:hover {
    transform: translateY(-2px);
    box-shadow: 
        0 12px 25px rgba(0, 0, 0, 0.2),
        inset 0 1px 1px rgba(255, 255, 255, 0.15);
}

/* Светлая тема - .container-profile:hover */
html:not(.dark) .container-profile:hover {
    transform: translateY(-2px);
    box-shadow: 
        0 12px 25px rgba(0, 0, 0, 0.15),
        inset 0 1px 1px rgba(0, 0, 0, 0.1);
}

.container-img {
    padding: 7px;
    padding-left: 15px;
    position: relative;
}

.container-img img {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.container-img img:hover {
    transform: scale(1.05);
}

/* Темная тема - .info-container-profile */
html.dark .info-container-profile {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: start;
    padding: 10px 15px;
    color: #e2e8f0;
}

/* Светлая тема - .info-container-profile */
html:not(.dark) .info-container-profile {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: start;
    padding: 10px 15px;
    color: #1f2937;
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
    gap: 15px;
}

.demo-basic .block {
    flex: 1;
    padding: 10px;
    transition: all 0.3s ease;
}

.demo-basic .block:not(:last-child) {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.demo-basic .block:hover {
    background: rgba(255, 255, 255, 0.05);
}

.demo-basic .el-col:not(:last-child) {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 1200px) {
    .container-profile {
        width: 90% !important;
        height: auto;
        min-height: 75px;
        padding: 10px 0;
    }

    .container-img {
        padding: 8px !important;
        padding-left: 12px !important;
    }

    .info-container-profile {
        padding: 8px 12px;
        gap: 8px;
    }

    .demo-basic .demo-basic--circle,
    .demo-basic .demo-basic--square {
        flex-wrap: wrap;
        gap: 10px;
    }

    .demo-basic .block {
        padding: 8px;
        min-width: calc(50% - 10px);
    }

    .demo-basic .block:not(:last-child) {
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
}

/* Дополнительные анимации */
@keyframes subtle-glow {
    0% { box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); }
    50% { box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2); }
    100% { box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); }
}

.container-profile {
    animation: subtle-glow 3s infinite ease-in-out;
}

/* Стили для текстовых элементов внутри профиля */
.info-container-profile h3 {
    margin: 0;
    font-size: 1.1em;
    font-weight: 600;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.info-container-profile p {
    margin: 0;
    font-size: 0.9em;
    color: #94a3b8;
    opacity: 0.9;
}

/* Улучшенные стили для hover состояний */
.container-profile:hover .container-img img {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.demo-basic .block:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-1px);
}
</style>