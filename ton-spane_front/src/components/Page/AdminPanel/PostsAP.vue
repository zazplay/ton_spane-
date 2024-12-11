<template>
    <div class="posts-container">
        <!-- Модальне вікно для підтвердження видалення -->
        <dialog id="deleteDialog" ref="deleteDialog">
            <form method="dialog">
                <p>Вы действительно хотите удалить {{ selectedPosts.length }} поста(ов)?</p>
                <menu>
                    <button @click="closeDeleteDialog">Отменить</button>
                    <button type="button" @click="deletePosts">Видалити</button>
                </menu>
            </form>
        </dialog>

        <!-- Модальне вікно редагування -->
        <dialog id="editDialog" ref="editDialog">
            <form method="dialog" @submit.prevent="savePostChanges">
                <h3>Редактировать пост</h3>
                <label for="caption">Текст:</label>
                <input v-model="editForm.caption" type="text" id="caption" required />
                <label for="price">Цена:</label>
                <input v-model="editForm.price" type="number" id="price" required />
                <label for="isBlurred">Розмытый:</label>
                <input v-model="editForm.isBlurred" type="checkbox" id="isBlurred" />
                <menu>
                    <button type="button" @click="closeEditDialog">Закрыть</button>
                    <button type="submit">Сохранить</button>
                </menu>
            </form>
        </dialog>

        <!-- Кнопка для додавання нового поста -->
        <el-button class="add-post-btn" type="success" @click="openForm">Добавить</el-button>

        <!-- Кнопка для видалення вибраних постів -->
        <el-button class="delete-btn" v-if="selectedPosts.length > 0" type="danger" @click="showDeleteConfirmation">
            Удалить {{ selectedPosts.length }} поста(ов)
        </el-button>

        <!-- Виведення карток постів -->
        <div v-for="post in listPosts" :key="post.id" class="post-item">
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <input type="checkbox" v-model="selectedPosts" :value="post.id" />
                <button @click="openEditDialog(post)">Редагувати</button>
            </div>

            <PostComponent :id="post.id" :user="post.user" :imageUrl="post.imageUrl" :caption="post.caption"
                :isBlurred="post.isBlurred" :price="post.price" :createdAt="post.createdAt" />
            <!-- Кнопка редагування -->
        </div>

        <!-- Форма для додавання поста -->
        <AddPostForm :isOpen="isFormOpen" @close="closeForm" />
    </div>
</template>

<script lang="js" setup>
import axios from 'axios';
import config from '@/config';
import { ref, onMounted } from 'vue';
import PostComponent from './PostComponent.vue';
import AddPostForm from '../../AddPostForm.vue';

// Реактивний список постів
const listPosts = ref([]);
const selectedPosts = ref([]); // Массив для вибраних постів
const deleteDialog = ref(null); // Ссилка на елемент діалогу видалення
const isFormOpen = ref(false); // Стан для відкриття форми
const editDialog = ref(null); // Ссилка на діалог редагування
const editForm = ref({ caption: '', price: '', isBlurred: false, id: null }); // Дані для редагування

// Асинхронна функція для отримання постів
const getPosts = async () => {
    try {
        const response = await axios.get(`${config.API_BASE_URL}/posts`);
        listPosts.value = response.data; // Оновлюємо список постів
    } catch (error) {
        console.error('Помилка при отриманні постів:', error);
    }
};

// Функція для видалення вибраних постів
const deletePosts = async () => {
    try {
        for (const postId of selectedPosts.value) {
            await axios.delete(`${config.API_BASE_URL}/posts/${postId}`);
            // Видаляємо пост зі списку після успішного видалення
            listPosts.value = listPosts.value.filter(post => post.id !== postId);
        }

        // Скидаємо вибір і закриваємо модальне вікно
        resetSelection();
        closeDeleteDialog();
    } catch (error) {
        console.error('Помилка при видаленні постів:', error);
    }
};

// Функція для відкриття діалогу підтвердження видалення
const showDeleteConfirmation = () => {
    deleteDialog.value.showModal(); // Відкриваємо модальне вікно для видалення
};

// Функція для закриття діалогу видалення
const closeDeleteDialog = () => {
    deleteDialog.value.close(); // Закриваємо модальне вікно
};

// Функція для скидання вибраних постів
const resetSelection = () => {
    selectedPosts.value = [];
};

// Функція для відкриття форми
const openForm = () => {
    isFormOpen.value = true;
};

// Функція для закриття форми
const closeForm = () => {
    isFormOpen.value = false;
};

// Функція для відкриття діалогу редагування
const openEditDialog = (post) => {
    editForm.value = { ...post }; // Копіюємо дані поста для редагування
    editDialog.value.showModal(); // Відкриваємо модальне вікно редагування
};

// Функція для закриття діалогу редагування
const closeEditDialog = () => {
    editDialog.value.close(); // Закриваємо модальне вікно редагування
};

// Функція для збереження змін поста з використанням fetch
const savePostChanges = async () => {
    try {
        const response = await fetch(`${config.API_BASE_URL}/posts/${editForm.value.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editForm.value), // Перетворюємо дані в JSON
        });

        // if (!response.ok) {
        //     throw new Error(`Помилка при збереженні змін: ${response.statusText}`);
        // }

        // Оновлюємо пост у списку після збереження змін
        const updatedPost = await response.json(); // Отримуємо оновлений пост з відповіді

        const postIndex = listPosts.value.findIndex(post => post.id === updatedPost.id);
        if (postIndex !== -1) {
            listPosts.value[postIndex] = updatedPost; // Оновлюємо пост у списку
        }

        closeEditDialog(); // Закриваємо модальне вікно
    } catch (error) {
        console.error('Помилка при збереженні змін:', error);
    }
};


// Отримуємо пости при монтуванні компонента
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
    top: 50px;
    right: 450px;
    z-index: 100;
}

.add-post-btn {
    position: fixed;
    top: 50px;
    right: 350px;
    z-index: 100;
}

.el-button {
    margin-top: 20px;
}

/* Стили для діалогового вікна */
dialog {
    border: none;
    border-radius: 10px;
}

dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 1200px) {
    .delete-btn {
        right: 120px;
    }

    .add-post-btn {
        right: 20px;
    }
}
</style>
