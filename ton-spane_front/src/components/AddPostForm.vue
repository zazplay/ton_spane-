<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal-content dark-theme">
            <button class="close-btn" @click="closeForm">✖</button>
            <form>
                <div class="form-group" style="margin-top:30px;">
                    <label for="title">Заголовок</label>
                    <input type="text" id="title" v-model="post.title" required class="form-control"
                        placeholder="Введите заголовок" />
                </div>

                <div class="form-group">
                    <label for="content">Контент</label>
                    <textarea id="content" v-model="post.content" required class="form-control"
                        placeholder="Введите текст поста"></textarea>
                </div>

                <div class="form-group">
                    <label for="media">Фото или видео</label>
                    <!-- Добавляем реф к input -->
                    <input type="file" id="media" ref="fileInput" @change="handleFileChange" accept="image/*,video/*"
                        class="file-input" />
                    <!-- Кнопка для выбора файла -->
                    <el-button type="primary" class="custom-file-btn" @click="triggerFileInput">Выбрать файл</el-button>
                    <!-- Показать имя выбранного файла -->
                    <p v-if="post.media" class="selected-file">{{ post.media.name }}</p>
                    <p v-if="error" class="text-danger">{{ error }}</p>
                </div>

                <div class="mb-4">
                    <el-button type="success" style="margin-top: 15px;" plain @click.prevent="handleSubmit">Опубликовать</el-button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            post: {
                title: '',
                content: '',
                media: null, // Здесь будет храниться выбранный файл
            },
            error: null,
        };
    },
    methods: {
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                const isImage = file.type.startsWith('image/');
                const isVideo = file.type.startsWith('video/');

                if (!isImage && !isVideo) {
                    this.error = 'Только фото или видео разрешено!';
                    this.post.media = null;
                    return;
                }

                if (isImage) {
                    const img = new Image();
                    const objectUrl = URL.createObjectURL(file);

                    img.onload = () => {
                        const { width, height } = img;
                        URL.revokeObjectURL(objectUrl);

                        if (width > 2500 || height > 1260 || width < 512 || height < 512) {
                            this.error = `Неверный размер изображения! Мін: 512x512, Макс: 2500x1260`;
                            this.post.media = null;
                        } else {
                            this.error = null;
                            this.post.media = file;
                        }
                    };

                    img.src = objectUrl;
                } else {
                    this.error = null;
                    this.post.media = file;
                }
            } else {
                this.error = null;
                this.post.media = null;
            }
        },
        handleSubmit() {
            if (!this.post.media) {
                this.error = 'Пожалуйста, добавте фото или видео!';
                return;
            }

            const formData = new FormData();
            formData.append('title', this.post.title);
            formData.append('content', this.post.content);
            formData.append('media', this.post.media);

            console.log('Дані для відправки:', formData);
            alert('Пост добавлено успешно!');
            this.closeForm();
        },
        closeForm() {
            this.$emit('close');
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
    },
};
</script>

<style scoped>
/* Затемнение фона */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Содержимое модального окна */
.modal-content {
    position: relative;
    background: #2c2f33;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 600px;
    color: #ffffff;
}

/* Тёмная тема */
.dark-theme label {
    color: #ffffff;
}

.dark-theme .form-control {
    background: #23272a;
    color: #ffffff;
    border: 1px solid #7289da;
}

.dark-theme .form-control:focus {
    border-color: #5865f2;
    box-shadow: 0 0 5px rgba(88, 101, 242, 0.5);
}

.dark-theme .btn-primary {
    background-color: #5865f2;
    border-color: #5865f2;
}

.dark-theme .btn-primary:hover {
    background-color: #4752c4;
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

/* Стили для формы */
.form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}

.form-control {
    width: 97%;
    margin-top: 15px;
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    outline: none;
}

.text-danger {
    color: #ff4d4f;
}

/* Скрываем оригинальный input file */
.file-input {
    display: none;
}

/* Стиль для кастомной кнопки */
.custom-file-btn {
    width: 30%;
    margin: 15px auto;
    /* background-color: #5865f2;
    color: #fff; */
    /* padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s; */
}

.custom-file-btn:hover {
    background-color: #4752c4;
}

/* Стили для отображения имени выбранного файла */
.selected-file {
    margin-top: 10px;
    font-size: 1rem;
    color: #f1f1f1;
}
</style>
