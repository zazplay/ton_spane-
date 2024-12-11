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
                <div class="scroll-container">
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
    gap: 20px;
    /* Відстань між елементами */
    padding: 10px 0;
}

.el-card {
    flex: 0 0 100px;
    /* Фіксована ширина картки */
    height: 150px;
    border: none;
    transition: transform 0.2s ease-in-out;
    text-align: center;
    background-color: transparent;
    cursor: pointer;
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
    .el-card {
        flex: 0 0 90px;
        height: 110px;
    }

    .image {
        width: 90px;
        height: 85px;
    }
}
</style>
