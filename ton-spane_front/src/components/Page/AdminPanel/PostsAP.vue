<template>
    <div class="posts-container">
        <!-- Модальное окно подтверждения удаления -->
        <dialog id="deleteDialog" ref="deleteDialog">
            <form method="dialog">
                <p>Вы действительно хотите удалить {{ selectedPosts.length }} поста(ов)?</p>
                <menu>
                    <button @click="closeDeleteDialog">Отмена</button>
                    <button type="button" @click="deletePosts">Удалить</button>
                </menu>
            </form>
        </dialog>

        <el-button class="add-post-btn" type="success" @click="openForm">
            Добавить
        </el-button>
        <!-- Кнопка для удаления выбранных постов -->
        <el-button class="delete-btn" v-if="selectedPosts.length > 0" type="danger" @click="showDeleteConfirmation">
            Удалить {{ selectedPosts.length }} постов
        </el-button>

        <div v-for="post in listPosts" :key="post.id" class="post-item">
            <input type="checkbox" v-model="selectedPosts" :value="post.id" />
            <PostComponent :id="post.id" :user="post.user" :imageUrl="post.imageUrl" :caption="post.caption"
                :isBlurred="post.isBlurred" :price="post.price" :createdAt="post.createdAt" />
        </div>
        <AddPostForm :isOpen="isFormOpen" @close="closeForm" />
    </div>
</template>

<script lang="js" setup>
import axios from 'axios';
import config from '@/config';
import { ref, onMounted } from 'vue';
import PostComponent from './PostComponent.vue';
import AddPostForm from '../../AddPostForm.vue';

// Реактивный список постов
const listPosts = ref([]);
const selectedPosts = ref([]); // Массив для выбранных постов
const deleteDialog = ref(null); // Ссылка на элемент диалога
const isFormOpen = ref(false);

// Асинхронная функция для получения постов
const getPosts = async () => {
    try {
        const response = await axios.get(`${config.API_BASE_URL}/posts`);
        listPosts.value = response.data; // Обновляем список постов
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
    }
};

// Функция для удаления выбранных постов по одному
const deletePosts = async () => {
    try {
        for (const postId of selectedPosts.value) {
            await axios.delete(`${config.API_BASE_URL}/posts/${postId}`);
            // Удаляем пост из списка после успешного удаления
            listPosts.value = listPosts.value.filter(post => post.id !== postId);
        }

        // Сбрасываем выбор и закрываем модальное окно
        resetSelection();
        closeDeleteDialog();
    } catch (error) {
        console.error('Ошибка при удалении постов:', error);
    }
};

// Функция для отображения модального окна
const showDeleteConfirmation = () => {
    console.log('Кнопка нажата, показываем диалог'); // Лог для проверки вызова метода
    deleteDialog.value.showModal(); // Открываем модальное окно
};

// Функция для закрытия диалога
const closeDeleteDialog = () => {
    deleteDialog.value.close(); // Закрываем модальное окно
};

// Функция для сброса выбранных постов
const resetSelection = () => {
    selectedPosts.value = [];
};

const openForm = () => {
    isFormOpen.value = true; // Відкриваємо форму
};
const closeForm = () => {
    isFormOpen.value = false; // Закриваємо форму
};
// Получаем посты при монтировании компонента
onMounted(() => {
    getPosts();
});
</script>

<style scoped>
.posts-container {
    display: flex;
    flex-direction: column;
    justify-self: center;
    max-width: 100%;
}

.post-item {
    margin-bottom: 20px;
}

.delete-btn {
    position: fixed;
    /* Фиксируем кнопку на экране */
    top: 50px;
    /* Располагаем кнопку внизу */
    right: 450px;
    /* Располагаем кнопку справа */
    z-index: 100;
}

.add-post-btn {
    position: fixed;
    /* Фиксируем кнопку на экране */
    top: 50px;
    /* Располагаем кнопку внизу */
    right: 350px;
    /* Располагаем кнопку справа */
    z-index: 100;
}

.el-button {
    margin-top: 20px;
}

/* Стили для диалогового окна */
dialog {
    border: none;
    /* Убираем стандартные стили */
    border-radius: 10px;
}

dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    /* Затемнение фона */
}

@media (max-width: 1200px) {
    .delete-btn {
        right: 120px;
        /* Располагаем кнопку справа */
    }

    .add-post-btn {
        right: 20px;
        /* Располагаем кнопку справа */
    }
}
</style>