<!--PostAp.vue-->
<template>
    <div class="posts-container">
        <!-- Модальне вікно для підтвердження видалення -->
        <dialog id="deleteDialog" ref="deleteDialog">
            <form method="dialog">
                <p>Вы действительно хотите удалить {{ selectedPosts.length }} пост(ов)?</p>
                    <div style="display: flex; justify-content: space-between;" >
                        <el-button type="danger"  @click="deletePosts">Видалити</el-button>
                        <el-button type="info" @click="closeDeleteDialog">Отменить</el-button>
                    </div>
            </form>
        </dialog>

        <!-- Модальне вікно редагування -->
        <dialog id="editDialog" ref="editDialog">
            <form method="dialog" class="edit-modal-window">
                <h3>Редактировать пост</h3>

                <label for="caption">Текст:</label>
                <div class="input-caption">
                    <textarea id="caption" v-model="editForm.caption" v-on:input="handleInputDescription" required
                        placeholder="Введите описание"></textarea>
                    <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: start;">

                    <div class="input-blurred">
                        <input v-model="editForm.isBlurred" type="checkbox" id="isBlurred" />
                        <label for="isBlurred" style="color: white;">Размытое изображение</label>
                    </div>

                    <div style="margin-top: 10px;">
                        <label for="price">Цена:</label>
                        <div class="input-price">
                            <input type="number" id="price" min="0" max="999" v-model.number="editForm.price" required
                                maxlength="4" size="4" @input="limitInput" />
                        </div>
                    </div>
                </div>

                <button type="button" class="close-btn " @click="closeEditDialog">✖</button>
                <el-button type="success" style="width: max-content; padding: 5px;" plain
                    @click.prevent="savePostChanges">
                    Редактировать
                </el-button>
            </form>
        </dialog>

        <div class="container-btn-add-delete">
            <!-- Кнопка для додавання нового поста -->
            <el-button v-if="props.showAddButton" class="add-post-btn" type="success" @click="openForm">
                Добавить пост
            </el-button>

            <!-- Кнопка для видалення вибраних постів -->
            <el-button class="delete-btn" v-if="selectedPosts.length > 0" type="danger" @click="showDeleteConfirmation">
                Удалить {{ selectedPosts.length }} пост(ов)
            </el-button>
            <el-button class="delete-btn" v-if="selectedPosts.length > 0" type="info" @click="resetSelection">
                Сбросить выбор {{ selectedPosts.length }} пост(ов)
            </el-button>
        </div>


        <!-- Виведення карток постів -->
        <!-- <div v-for="post in listPosts" :key="post.id" class="post-item">
            <PostComponent :id="post.id" :user="user ? user : post.user" :imageUrl="post.imageUrl"
                :caption="post.caption" :isBlurred="post.isBlurred" :price="post.price" :createdAt="post.createdAt" /> -->
        <div v-for="post in (postsParam ? postsParam : listPosts)" :key="post.id" class="post-item">
            <PostComponent :id="post.id" :user="user ? user : post.user" :imageUrl="post.imageUrl"
                :caption="post.caption" :isBlurred="post.isBlurred" :price="post.price" :createdAt="post.createdAt" />
            <!-- Кнопка редагування -->
            <div class="bottom-btn-group">
                <el-button class="edit-btn" type="warning" @click="openEditDialog(post)">Редагувати</el-button>
                <input type="checkbox" v-model="selectedPosts" :value="post.id" class="custom-checkbox" />

            </div>
        </div>

        <!-- Форма для додавання поста -->
        <AddPostForm :isOpen="isFormOpen" @close="closeForm" />
    </div>
</template>

<script lang="js" setup>
import axios from 'axios';
import config from '@/config';
import { ref, onMounted, defineProps } from 'vue';
import PostComponent from './PostComponent.vue';
import AddPostForm from '../../AddPostForm.vue';
import { validateInputToScript, removeTagsOperators } from "../../Validation";

// Реактивний список постів
const listPosts = ref([]);
const selectedPosts = ref([]); // Массив для вибраних постів
const deleteDialog = ref(null); // Ссилка на елемент діалогу видалення
const isFormOpen = ref(false); // Стан для відкриття форми
const editDialog = ref(null); // Ссилка на діалог редагування
const editForm = ref({ caption: '', price: 0, isBlurred: false, id: null }); // Дані для редагування

const errors = ref({
    description: ''
});

const props = defineProps(
    {
        postsParam: {
            type: Object,
            required: false
        },
        user: {
            type: Object,
            required: false
        },

        showAddButton: {
            type: Boolean,
            default: false, // Кнопка буде відображатися за замовчуванням
        },
    })
// Асинхронна функція для отримання постів
const getPosts = async () => {
    console.log('user', props.user)
    console.log('postsParam', props.postsParam)

    // let getPostStr = '';
    try {
        // if (props.userId === null) {
        //     getPostStr = `${config.API_BASE_URL}/posts`;
        // }
        // else {
        //     console.log(props.userId);
        //     getPostStr = `${config.API_BASE_URL}/posts/requester/${props.userId}`
        // }
        //TODO: Изменить запрос для получения всех постов
        if (!props.postsParam) {
            const response = await axios.get(`${config.API_BASE_URL}/posts/requester/a7248fe8-a4c1-4d49-bf22-5722f537916a`);
            listPosts.value = response.data; // Оновлюємо список пості
        }

        // const response = await axios.get(getPostStr);
        // listPosts.value = response.data; // Оновлюємо список пості
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

const handleInputDescription = () => {
    errors.value.description = '';
    const result = validateInputToScript(editForm.value.caption);
    if (!result.executionResult) {
        errors.value.description = result.messange;
        editForm.value.caption = removeTagsOperators(editForm.value.caption);
    }
}

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

const limitInput = (event) => {
    const value = event.target.value;
    if (value.length > 4) {
        event.target.value = value.slice(0, 4); // Обрезаем строку до 4 символов
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

.container-btn-add-delete {
    display: flex;
    position: sticky;
    top: 50px;
    right: 450px;
    z-index: 100;
}

.delete-btn {
    width: max-content;
}

.add-post-btn {
    width: max-content;
}

/* Кнопка закрытия */
.close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #ffffff;
}

.close-btn:hover {
    color: #ff0000;
}

.edit-btn {
    margin-top: 0 !important;
}

.el-button {
    margin-top: 20px;
}

/* Стили для діалогового вікна */
dialog {
    border: none;
    border-radius: 10px;
    background-color: rgb(30, 27, 27);
}

dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
}

.edit-modal-window {
    display: flex;
    flex-direction: column;
    width: 500px;
    background-color: rgb(30, 27, 27);
}

/* Стилизация текстового input */
.input-caption {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
}

.input-caption label {
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
}

.input-caption textarea {
    padding: 10px;
    /* Отступы внутри текстового поля */
    border: 2px solid #4f8cff;
    /* Цвет рамки */
    border-radius: 5px;
    /* Закругление углов */
    font-size: 16px;
    /* Размер шрифта */
    resize: vertical;
    /* Позволяет изменять размер только по вертикали */
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    /* Плавные переходы */
    min-height: 100px;
    /* Минимальная высота текстового поля */
}

.input-caption textarea:focus {
    border-color: #2563eb;
    /* Цвет рамки при фокусе */
    box-shadow: 0 0 5px rgba(37, 99, 235, 0.5);
    /* Тень при фокусе */
    outline: none;
    /* Убираем стандартное выделение */
}

.input-caption textarea::placeholder {
    color: #aaa;
    /* Цвет текста плейсхолдера */
}

/* Стили импута цены */
.input-price {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    width: 70px;
}

.input-price label {
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
}

.input-price input[type="number"] {
    padding: 10px;
    /* Отступы внутри поля ввода */
    border: 2px solid #4f8cff;
    /* Цвет рамки */
    border-radius: 5px;
    /* Закругление углов */
    font-size: 16px;
    /* Размер шрифта */
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    /* Плавные переходы */
}

.input-price input[type="number"]:focus {
    border-color: #2563eb;
    /* Цвет рамки при фокусе */
    box-shadow: 0 0 5px rgba(37, 99, 235, 0.5);
    /* Тень при фокусе */
    outline: none;
    /* Убираем стандартное выделение */
}

.input-price input[type="number"]::-webkit-inner-spin-button,
.input-price input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    /* Убираем стрелки у spin button в Chrome */
    margin: 0;
    /* Убираем отступы */
}

/* Стили чекбокс */
.input-blurred {
    display: flex;
    align-items: center;
    /* Выравнивание по центру по вертикали */
    margin-top: 10px;
    /* Отступ сверху */
}

.input-blurred label {
    font-size: 16px;
    /* Размер шрифта метки */
    color: #333;
    /* Цвет текста метки */
    margin-right: 10px;
    /* Отступ справа от метки */
}

.input-blurred input[type="checkbox"] {
    width: 20px;
    /* Ширина чекбокса */
    height: 20px;
    /* Высота чекбокса */
    cursor: pointer;
    /* Указатель при наведении */
    accent-color: #4f8cff;
    /* Цвет чекбокса (для современных браузеров) */
}

/* Стили для чекбокса при фокусе */
.input-blurred input[type="checkbox"]:focus {
    outline: none;
    /* Убираем стандартное выделение */
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
    /* Тень при фокусе */
}

/* Стили для состояния чекбокса (при нажатии) */
.input-blurred input[type="checkbox"]:checked {
    background-color: #4f8cff;
    /* Цвет фона при выборе */
}

.bottom-btn-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 0px;
    padding-right: 0px;
}

.error-message {
    color: red;
    /* Цвет текста ошибки */
    font-size: 14px;
    /* Размер шрифта */
    margin-top: 5px;
    /* Отступ сверху */
}

@media (max-width: 1200px) {
    dialog {
        width: 80%;
    }

    .edit-modal-window {
        width: 100%;
    }


    .container-btn-add-delete {
        display: flex;
        position: sticky;
        top: 50px;
        z-index: 100;
        margin-left: -10px;
    }

    .delete-btn {
        padding: 3px;

    }

    .add-post-btn {
        padding: 3px;
    }

    .el-button {
        margin-right: 0;
    }

    .close-btn {
        font-size: 1rem;
        /* Уменьшаем размер кнопки закрытия */
    }

    .bottom-btn-group {

        padding-left: 10px;
        padding-right: 10px;
    }
}
</style>
