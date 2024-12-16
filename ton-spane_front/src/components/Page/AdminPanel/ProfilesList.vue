<!--ProfilesList-->
<script>
import { ref, onMounted, defineComponent } from "vue";
import axios from "axios";
import config from "@/config";
import { validateInputToScript, removeTagsOperators, validateLogin } from "../../Validation";

export default defineComponent({
    emits: ['select-user'], 
    setup(_, { emit }) {
        const loading = ref(true);
        const lists = ref([]);
        const currentDate = new Date().toDateString();
        const defaultUserImage = "https://via.placeholder.com/150";

        // Получаем sub из Vuex
        // const sub = store.getters.getSub;
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        const newProfile = ref({
            username: '',
            // profilePicture: '',
            description: ''
        });

        const errors = ref({
            username: '',
            description: ''
        });
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

        const openAddProfileDialog = () => {
            const dialog = document.getElementById('addProfileDialog');
            dialog.showModal(); // Открываем диалоговое окно
        };

        const closeAddProfileDialog = () => {
            const dialog = document.getElementById('addProfileDialog');
            dialog.close(); // Закрываем диалоговое окно
        };

        const handleInputName = () => {
            errors.value.username = ''

            const lengthLogin = validateLogin(newProfile.value.username);
            if (!lengthLogin.executionResult) {
                errors.value.username = lengthLogin.messange;
            }

            const result = validateInputToScript(newProfile.value.username);
            if (!result.executionResult) {
                errors.value.username = result.messange;
                newProfile.value.username = removeTagsOperators(newProfile.value.username);
            }
        }

        const handleInputDescription = () => {
            errors.value.description = '';
            const result = validateInputToScript(newProfile.value.description);
            if (!result.executionResult) {
                errors.value.description = result.messange;
                newProfile.value.description = removeTagsOperators(newProfile.value.description);
            }
        }

        const saveNewProfile = () => {
            if (newProfile.value.username.length < 3) {
                errors.value.username = 'Логин не может быть меньше 3 символов.'
                return;
            }

            console.log('Сохранение профиля:', newProfile.value);

            // Здесь добавить код для отправки данных на сервер

            closeAddProfileDialog(); // Закрываем диалог после сохранения

            // Сброс значений формы после успешного сохранения
            // newProfile.value = { username: '', description: '' };
            // // } else {
            // // Если есть ошибки, очищать значения некорректных полей
            // if (errors.value.username) {
            //     newProfile.value.username = ''; // Удаляем некорректное значение
            // }
            // if (errors.value.description) {
            //     newProfile.value.description = ''; // Удаляем некорректное значение
            // }
            // // }
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
            newProfile,
            openAddProfileDialog,
            closeAddProfileDialog,
            saveNewProfile,
            errors,
            handleInputName,
            handleInputDescription,
        };
    },
});
</script>

<template>
    <div class="btn-add-profile">
        <el-button type="success" @click="openAddProfileDialog">Добавить профиль</el-button>
    </div>

    <!--Добавить профиль-->
    <dialog id="addProfileDialog" ref="addProfileDialog">
        <form method="dialog" class="edit-modal-window">
            <button type="button" class="close-btn" @click="closeAddProfileDialog">✖</button>
            <h3>Добавить профиль</h3>

            <label for="userName">Имя:</label>
            <div class="input-userName">
                <input id="userName" type="text" v-model="newProfile.username" v-on:input="handleInputName"
                    placeholder="Введите имя профиля" />
                <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
            </div>

            <label for="description">Описание:</label>
            <div class="input-caption">
                <textarea id="description" v-model="newProfile.description" v-on:input="handleInputDescription"
                    placeholder="Введите описание"></textarea>
                <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
            </div>

            <el-button type="success" style="width: max-content; padding: 5px; margin-top: 20px;" plain
                @click.prevent="saveNewProfile">Сохранить
            </el-button>
        </form>
    </dialog>

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

.btn-add-profile {
    display: flex;
    justify-content: end;
    padding-right: 15px;
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

.input-userName {
    display: flex;
    flex-direction: column;
    /* Расположение метки и поля ввода в столбик */
    margin-top: 10px;
    margin-bottom: 10px;
    /* Отступ сверху */
}

.input-userName label {
    font-size: 16px;
    /* Размер шрифта метки */
    color: #333;
    /* Цвет текста метки */
    margin-bottom: 5px;
    /* Отступ снизу от метки */
}

.input-userName input[type="text"] {
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

.input-userName input[type="text"]:focus {
    border-color: #2563eb;
    /* Цвет рамки при фокусе */
    box-shadow: 0 0 5px rgba(37, 99, 235, 0.5);
    /* Тень при фокусе */
    outline: none;
    /* Убираем стандартное выделение */
}

.input-userName input[type="text"]::placeholder {
    color: #aaa;
    /* Цвет текста плейсхолдера */
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

.error-message {
    color: red;
    /* Цвет текста ошибки */
    font-size: 14px;
    /* Размер шрифта */
    margin-top: 5px;
    /* Отступ сверху */
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
        padding: 0;
        margin-bottom: 10px;
    }

    .el-card {
        flex: 0 0 90px;
        /* Фіксована ширина картки */
        height: 140px;
    }

    .image {
        width: 90px;
        height: 85px;
    }

    .btn-add-profile {
        padding-right: 5px;
        margin: 10px 0 20px;
    }

    dialog {
        width: 80%;
    }

    .edit-modal-window {
        width: 100%;
    }

    .close-btn {
        font-size: 1, 2rem;
        /* Уменьшаем размер кнопки закрытия */
    }
}
</style>
