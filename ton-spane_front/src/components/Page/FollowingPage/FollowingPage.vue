<template>
    <!-- Контейнер с элементами skeleton для загрузки данных -->
    <el-space style="width: 100%" fill >
        <el-skeleton style="display: flex; gap: 8px" :loading="loading" animated :count="3">
            <!-- Шаблон, который отображается во время загрузки -->
            <template #template>
                <div style="flex: 1">
                    <!-- Skeleton для изображения -->
                    <el-skeleton-item variant="image" style="height: 240px" />
                    <div style="padding: 14px">
                        <!-- Skeleton для заголовка -->
                        <el-skeleton-item variant="h3" style="width: 50%" />
                        <div
                            style="display: flex; align-items: center; justify-items: space-between; margin-top: 16px; height: 16px;">
                            <!-- Skeleton для текста -->
                            <el-skeleton-item variant="text" style="margin-right: 16px" />
                            <!-- Skeleton для текста -->
                            <el-skeleton-item variant="text" style="width: 30%" />
                        </div>
                    </div>
                </div>
            </template>

            <!-- Этот блок отображается, когда данные загружены -->
            <template #default>
                <div class="scroll-container">
                    <el-card v-for="item in lists" :key="item.username"
                        :body-style="{ padding: '0px', marginBottom: '1px' }"
                        class="card" @click="handleCardClick(item)">
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

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import config from "@/config";

export default {
    setup() {
        const loading = ref(true);
        const lists = ref([]);
        const currentDate = new Date().toDateString();

        // Устанавливаем изображение пользователя по умолчанию
        const defaultUserImage = "https://via.placeholder.com/150"; // Поставьте ссылку на изображение по умолчанию

        const setLoading = () => {
            loading.value = true;
            setTimeout(() => {
                loading.value = false;
            }, 2000);
        };

        const fetchData = async () => {
            try {
                const userId = "3e5a8e90-f048-4f75-a295-61e29f7e66e7";
                const response = await axios.get(`${config.API_BASE_URL}/subscriptions/${userId}/following`);
                lists.value = response.data;
                loading.value = false;
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
                loading.value = false;
            }
        };

        const handleCardClick = (item) => {
            console.log("Перейти на профиль пользователя: ", item.username);
            // Здесь в будущем можно добавить логику для перехода на профиль пользователя
            // Например, использовать Vue Router для перехода:
            // this.$router.push(`/profile/${item.username}`);
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
};
</script>

<style scoped>
.scroll-container {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    padding: 10px 0;
    padding-left: 10px;
}

.el-card {
    display: inline-block;
    width: 100px;    /* Ширина карточки */
    height: 150px;  /* Увеличена высота карточки */
    margin-right: 20px;
    border: none;   /* Убрали border */
    transition: transform 0.2s ease-in-out;
    text-align: center; /* Выравнивание текста */
    background-color: transparent; /* Прозрачный фон */
    cursor: pointer; /* Курсор для клика */
}

.image {
    width: 100px;    /* Ширина изображения */
    height: 100px;   /* Высота изображения */
    object-fit: cover;
    /* margin-bottom: 5px; */
    border-radius: 10px; /* Закругленные края изображения */
}

.card:hover {
    transform: scale(1.1); /* Увеличиваем карточку при наведении */
}

.card-content {
    padding: 5px 0;
    font-size: 14px; /* Размер шрифта */
}

@media (max-width: 1200px) {
    .scroll-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .el-card {
        width: 90px;
        height: 110px;
    }

    .image {
        width: 90px;
        height: 85px;
    }
}
</style>
