<!--ProfilesList-->
<script>

import { ref, onMounted, defineComponent } from "vue";
// import { useRouter } from "vue-router"; // Імпортуємо useRouter
// import { useStore } from 'vuex' // Импортируем useStore
import axios from "axios";
import config from "@/config";

export default defineComponent({
    setup(_, { emit }) {
        const loading = ref(true);
        const lists = ref([]);
        const currentDate = new Date().toDateString();
        // const router = useRouter(); // Отримуємо інстанс роутера
        // const store = useStore(); // Получаем инстанс хранилища Vuex

        // Устанавливаем изображение пользователя по умолчанию
        const defaultUserImage = "https://via.placeholder.com/150";

        // Получаем sub из Vuex
        // const sub = store.getters.getSub;
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        const startDrag = (event) => {
            isDragging = true;
            startX = event.pageX - event.target.offsetLeft;
            scrollLeft = event.target.scrollLeft;
        };

        const dragging = (event) => {
            if (!isDragging) return;
            event.preventDefault();
            const x = event.pageX - event.target.offsetLeft;
            const walk = (x - startX) * 3; // Кількість переміщення
            event.target.scrollLeft = scrollLeft - walk;
        };

        const stopDrag = () => {
            isDragging = false;
        };
        const setLoading = () => {
            loading.value = true;
            setTimeout(() => {
                loading.value = false;
            }, 2000);
        };

        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/users`);
                // console.log("sub ", sub);
                lists.value = response.data;

                loading.value = false;
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
                loading.value = false;
            }
        };

        const handleCardClick = (item) => {
            console.log("Перейти на профіль користувача: ", item.username, item);
            // Отправляем событие в родительский компонент с id пользователя
            emit('select-user', item.id);
        };


        onMounted(() => {
            fetchData();
        });


        return {
            loading,
            lists,
            currentDate,
            setLoading,
            defaultUserImage, // Возвращаем ссылку на изображение по умолчанию
            handleCardClick,  // Возвращаем метод для обработки кликов
            startDrag,
            dragging,
            stopDrag,
        };
    },
});
</script>

<template>
    <el-space style="width: 100%" fill>
        <el-skeleton style="display: flex; gap: 8px" :loading="loading" animated :count="3">
            <template #template>
                <div style="flex: 1">
                    <el-skeleton-item variant="image" style="height: 240px" />
                    <div style="padding: 14px">
                        <el-skeleton-item variant="h3" style="width: 50%" />
                        <div style="display: flex; align-items: center; margin-top: 16px; height: 16px;">
                            <el-skeleton-item variant="text" style="margin-right: 16px" />
                            <el-skeleton-item variant="text" style="width: 30%" />
                        </div>
                    </div>
                </div>
            </template>

            <template #default>
                <div class="scroll-container" @mousedown="startDrag" @mousemove="dragging" @mouseup="stopDrag"
                    @mouseleave="stopDrag">
                    <el-card v-for="item in lists" :key="item.username"
                        :body-style="{ padding: '0px', marginBottom: '1px' }" class="card"
                        @click="handleCardClick(item)">
                        <img :src="item.profilePicture || defaultUserImage" class="image" />
                        <div class="card-content">
                            <span>{{ item.username }}</span>
                        </div>
                    </el-card>
                </div>
            </template>
        </el-skeleton>
    </el-space>
</template>

<style scoped>
.scroll-container {
    display: flex;
    /* Використовуємо Flexbox */
    flex-wrap: wrap;
    /* Додаємо перенесення рядків */
    /* gap: 8px; */
    /* Відстань між елементами */
    padding: 10px 0;

}

.scroll-container::-webkit-scrollbar {
    height: 8px;
}

.scroll-container::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 10px;
}

.scroll-container::-webkit-scrollbar-track {
    background-color: lightgrey;
}

.el-card {
    flex: 0 0 auto;
    /* Забороняємо карткам масштабуватися */
    width: 150px;
    /* Фіксована ширина картки */
    height: 150px;
    border: none;
    transition: transform 0.2s ease-in-out;
    text-align: center;
    background-color: transparent;
    cursor: pointer;
    scroll-snap-align: start;
    /* Прив'язка картки до початку при прокручуванні */
}

.image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
}

.card:hover {
    transform: scale(1.1);
}

.card-content {
    padding: 5px 0;
    font-size: 14px;
}

@media (max-width: 1200px) {
    .scroll-container {
        flex-wrap: nowrap;
        overflow-x: auto;
        /* Додаємо горизонтальний скрол */
        gap: 10px;
        /* Відстань між елементами */
        scroll-snap-type: x mandatory;
        cursor: grab;
        /* Зміна курсору для натискання */
        padding: 10px 0;
    }

    .el-card {
        flex: 0 0 90px;
        /* Фіксована ширина картки */
        height: 110px;
    }

    .image {
        width: 90px;
        height: 85px;
    }
}
</style>
