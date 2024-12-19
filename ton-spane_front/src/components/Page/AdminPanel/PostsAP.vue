<!--PostAp.vue-->
<template>
    <div class="posts-container">
        <!-- Модальне вікно для підтвердження видалення -->
        <dialog id="deleteDialog" ref="deleteDialog">
            <form method="dialog">
                <p>Вы действительно хотите удалить {{ selectedPosts.length }} пост(ов)?</p>
                <div style="display: flex; justify-content: space-between;">
                    <el-button type="danger" @click="deletePosts">Видалити</el-button>
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

                <button type="button" class="close-btn" @click="closeEditDialog">✖</button>
                <el-button type="success" style="width: max-content; padding: 5px;" plain
                    @click.prevent="savePostChanges">
                    Редактировать
                </el-button>
            </form>
        </dialog>

        <!-- Модальное окно для добавления лайков -->
        <dialog id="likesDialog" ref="likesDialog" class="likes-dialog">
            <form method="dialog" class="edit-modal-window">
                <h3>Добавить лайки</h3>
                <div class="input-likes">
                    <label for="likesCount" style="color: white;">Количество лайков:</label>
                    <el-input-number 
                        v-model="likesForm.count"
                        :min="1"
                        :max="50"
                        controls-position="right"
                    />
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <el-button @click="closeLikesDialog">Отмена</el-button>
                    <el-button
                        type="primary"
                        @click.prevent="handleAddLikes"
                        :loading="isAddingLikes"
                    >
                        Добавить
                    </el-button>
                </div>
                <button type="button" class="close-btn" @click="closeLikesDialog">✖</button>
            </form>
        </dialog>

        <div class="container-btn-add-delete">
            <!-- Кнопка для видалення вибраних постів -->
            <el-button class="delete-btn" v-if="selectedPosts.length > 0" type="danger" @click="showDeleteConfirmation">
                Удалить {{ selectedPosts.length }} пост(ов)
            </el-button>
            <el-button class="delete-btn" v-if="selectedPosts.length > 0" type="info" @click="resetSelection">
                Сбросить выбор {{ selectedPosts.length }} пост(ов)
            </el-button>
        </div>

        <!-- Виведення карток постів -->
        <div v-for="post in (postsParam ? postsParam : listPosts)" :key="post.id" class="post-item">
            <PostComponent :id="post.id" :user="user ? user : post.user" :imageUrl="post.imageUrl"
                :caption="post.caption" :isBlurred="post.isBlurred" :price="post.price" :createdAt="post.createdAt" />
            <div class="bottom-btn-group">
                <div class="likes-section">
                    <el-icon size="30px" color="green" @click="openLikesDialog(post)"><CirclePlusFilled /></el-icon> 
                    <span class="likes-count">{{ post.likes ? post.likes.length : 0 }} лайков</span>
                </div>
                <el-button class="edit-btn" type="warning" @click="openEditDialog(post)">Редактировать</el-button>
                <div class="input-blurred checkbox-delete">
                    <input v-model="selectedPosts" type="checkbox" :value="post.id" id="isDelete" />
                </div>
            </div>
        </div>

        <AddPostForm :isOpen="isFormOpen" :userId="props.user? props.user.id : ''" @close="closeForm" />
    </div>
</template>

<script setup>
import axios from 'axios';
import config from '@/config';
import { ref, reactive, onMounted, onUnmounted,defineProps } from 'vue';
import { ElMessage } from 'element-plus';
import PostComponent from './PostComponent.vue';
import AddPostForm from './Models/AddPostForm.vue';
import { validateInputToScript, removeTagsOperators } from "../../Validation";

const listPosts = ref([]);
const selectedPosts = ref([]);
const deleteDialog = ref(null);
const isFormOpen = ref(false);
const editDialog = ref(null);
const editForm = ref({ caption: '', price: 0, isBlurred: false, id: null });

// Новые переменные для лайков
const likesDialog = ref(null);
const likesForm = reactive({
    count: 1,
    postId: null
});
const isAddingLikes = ref(false);

const errors = ref({
    description: ''
});

const props = defineProps({
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
        default: false,
    },
});

// Функции для работы с лайками
const openLikesDialog = (post) => {
    likesForm.postId = post.id;
    likesDialog.value.showModal();
};

const closeLikesDialog = () => {
    likesDialog.value.close();
    likesForm.postId = null;
    likesForm.count = 1;
};

const addMultipleLikes = async (likesCount, postId) => {
    const results = {
        successful: 0,
        failed: 0,
        errors: []
    };

    try {
        const requests = Array(likesCount).fill().map(() => 
            fetch(
                `${config.API_BASE_URL}/likes/3dc42836-ded0-42af-a574-b6eaf1fcc8c0/like/${postId}`,
                {
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json'
                        // Add any required authentication headers
                        // 'Authorization': `Bearer ${yourToken}`
                    }
                }
            )
        );

        const chunkSize = 200;
        for (let i = 0; i < requests.length; i += chunkSize) {
            const chunk = requests.slice(i, i + chunkSize);
            const responses = await Promise.allSettled(chunk);
            
            for (const response of responses) {
                if (response.status === 'fulfilled') {
                    if (response.value.status === 201) {
                        results.successful++;
                    } else {
                        results.failed++;
                        try {
                            const errorBody = await response.value.text();
                            results.errors.push({
                                status: response.value.status,
                                body: errorBody
                            });
                        } catch (parseError) {
                            results.errors.push({
                                status: response.value.status,
                                body: 'Unable to parse error body'
                            });
                        }
                    }
                } else {
                    results.failed++;
                    results.errors.push({
                        status: 'Rejected',
                        body: response.reason.toString()
                    });
                }
            }

            if (i + chunkSize < requests.length) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    } catch (err) {
        console.error('Error in batch likes addition:', err);
        results.errors.push({
            status: 'Catch block error',
            body: err.toString()
        });
    }

    return results;
};

const handleAddLikes = async () => {
    try {
        isAddingLikes.value = true;
        const results = await addMultipleLikes(likesForm.count, likesForm.postId);
        
        // More detailed error messaging
        if (results.errors.length > 0) {
            console.error('Errors during like addition:', results.errors);
            
            ElMessage({
                message: `Успешно добавлено ${results.successful} лайков, ${results.failed} не удалось`,
                type: results.failed === 0 ? 'success' : 'warning'
            });

            // Optionally, show more detailed error information
            results.errors.forEach((error, index) => {
                ElMessage.error(`Ошибка ${index + 1}: Статус ${error.status}, Детали: ${error.body}`);
            });
        } else {
            ElMessage.success(`Успешно добавлено ${results.successful} лайков`);
        }
        
        await getPosts();
        window.dispatchEvent(new Event('postsDataChanged'));
        closeLikesDialog();
    } catch (error) {
        console.error('Unhandled error in handleAddLikes:', error);
        ElMessage.error('Произошла критическая ошибка при добавлении лайков');
    } finally {
        isAddingLikes.value = false;
    }
};
// Существующие функции
const getPosts = async () => {
    try {
        if (!props.postsParam) {
            const response = await axios.get(`${config.API_BASE_URL}/posts/requester/a7248fe8-a4c1-4d49-bf22-5722f537916a`);
            listPosts.value = response.data;
        }
    } catch (error) {
        console.error('Помилка при отриманні постів:', error);
    }
};


const deletePosts = async () => {
    try {
        for (const postId of selectedPosts.value) {
            await axios.delete(`${config.API_BASE_URL}/posts/${postId}`);
        }
        
        // Обновляем только локальный список
        if (!props.postsParam) {
            listPosts.value = listPosts.value.filter(post => !selectedPosts.value.includes(post.id));
        }
        
        // Отправляем событие об обновлении
        window.dispatchEvent(new Event('postsDataChanged'));
        
        resetSelection();
        closeDeleteDialog();
        
        ElMessage({
            message: 'Посты успешно удалены',
            type: 'success'
        });
    } catch (error) {
        console.error('Помилка при видаленні постів:', error);
        ElMessage({
            message: 'Ошибка при удалении постов',
            type: 'error'
        });
    }
};

const showDeleteConfirmation = () => {
    deleteDialog.value.showModal();
};

const closeDeleteDialog = () => {
    deleteDialog.value.close();
};

const resetSelection = () => {
    selectedPosts.value = [];
};


const closeForm = () => {
    isFormOpen.value = false;
    // Отправляем событие об обновлении
    window.dispatchEvent(new Event('postsDataChanged'));
};

const openEditDialog = (post) => {
    editForm.value = { ...post };
    editDialog.value.showModal();
};

const closeEditDialog = () => {
    editDialog.value.close();
    editForm.value = { caption: '', price: 0, isBlurred: false, id: null };
};

const handleInputDescription = () => {
    errors.value.description = '';
    const result = validateInputToScript(editForm.value.caption);
    if (!result.executionResult) {
        errors.value.description = result.messange;
        editForm.value.caption = removeTagsOperators(editForm.value.caption);
    }
}

const savePostChanges = async () => {
    try {
        // Создаем новый объект с только нужными полями
        const postData = {
            caption: editForm.value.caption,
            price: editForm.value.price,
            isBlurred: editForm.value.isBlurred,
        };

        const response = await fetch(`${config.API_BASE_URL}/posts/${editForm.value.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData), // Отправляем только необходимые данные
        });

        if (!response.ok) {
            throw new Error('Ошибка при сохранении изменений');
        }

        const updatedPost = await response.json();

        // Обновляем локальный список только если не используем postsParam
        if (!props.postsParam) {
            const postIndex = listPosts.value.findIndex(post => post.id === updatedPost.id);
            if (postIndex !== -1) {
                listPosts.value[postIndex] = updatedPost;
            }
        }

        // Отправляем событие об обновлении
        window.dispatchEvent(new Event('postsDataChanged'));
        
        closeEditDialog();
        
        ElMessage({
            message: 'Пост успешно обновлен',
            type: 'success'
        });
    } catch (error) {
        console.error('Помилка при збереженні змін:', error);
        ElMessage({
            message: 'Ошибка при обновлении поста',
            type: 'error'
        });
    }
};

const limitInput = (event) => {
    const value = event.target.value;
    if (value.length > 4) {
        event.target.value = value.slice(0, 4);
    }
};

onMounted(() => {
    getPosts();
});

onUnmounted(() => {
    // Очищаем выбранные посты при размонтировании компонента
    selectedPosts.value = [];
});
</script>

<style scoped>
.posts-container {
    display: flex;
    flex-direction: column;
    justify-self: center;
    max-width: 100%;
    gap: 24px;
}

.post-item {
    margin-bottom: 20px;
    background: rgb(30, 27, 27);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease;
}

.post-item:hover {
    transform: translateY(-2px);
}

/* Стили для кнопок в шапке */
.container-btn-add-delete {
    display: flex;
    position: sticky;
    top: 50px;
    right: 450px;
    z-index: 100;
    gap: 12px;
    padding: 12px;
    background: rgba(30, 27, 27, 0.8);
    backdrop-filter: blur(8px);
    border-radius: 8px;
}

.delete-btn {
    width: max-content;
    padding: 8px 16px;
    transition: all 0.2s ease;
}

.add-post-btn {
    width: max-content;
    padding: 8px 16px;
}

/* Стили для группы кнопок внизу поста */
.bottom-btn-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.03);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Улучшенные стили для секции лайков */
.likes-section {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 12px;
    background: rgba(255, 0, 0, 0.1);
    border-radius: 20px;
    transition: all 0.2s ease;
    cursor: pointer;
}

.likes-section:hover {
    background: rgba(255, 0, 0, 0.15);
    transform: scale(1.02);
}

.likes-count {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
}

/* Стили для модальных окон */
dialog {
    border: none;
    border-radius: 16px;
    background-color: rgb(30, 27, 27);
    padding: 0;
    max-width: 90vw;
    min-width: 300px;
    overflow: hidden;
}

dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
}

.edit-modal-window {
    display: flex;
    flex-direction: column;
    width: 500px;
    background-color: rgb(30, 27, 27);
    padding: 24px;
    position: relative;
}

/* Улучшенные стили для диалога лайков */
.likes-dialog .edit-modal-window {
    padding: 24px;
}

.likes-dialog h3 {
    color: white;
    margin: 0 0 20px 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.input-likes {
    margin: 24px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.input-likes label {
    font-size: 14px;
    font-weight: 500;
}

/* Стилизация кнопки закрытия */
.close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 1.2rem;
    cursor: pointer;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ff4d4d;
    transform: rotate(90deg);
}

/* Стили для чекбоксов */
.input-blurred {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 0 !important;
}

.input-blurred input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #4f8cff;
    border-radius: 4px;
}

/* Улучшенные стили для кнопок действий */
.edit-btn {
    margin: 0 !important;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.edit-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Адаптивные стили */
@media (max-width: 1200px) {
    dialog {
        width: 90%;
        margin: 20px auto;
    }

    .edit-modal-window {
        width: 100%;
        padding: 20px;
    }

    .container-btn-add-delete {
        position: fixed;
        top: auto;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        margin: 0;
        padding: 8px;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .bottom-btn-group {
        flex-wrap: wrap;
        gap: 8px;
        padding: 8px;
    }

    .likes-section {
        padding: 4px 8px;
    }

    .close-btn {
        top: 8px;
        right: 8px;
        width: 28px;
        height: 28px;
        font-size: 1rem;
    }
}

/* Анимации */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

dialog[open] {
    animation: fadeIn 0.3s ease-out;
}

.likes-section .el-icon {
    transition: transform 0.2s ease;
}

.likes-section:hover .el-icon {
    transform: scale(1.1);
}
</style>
