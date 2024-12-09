<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal-content dark-theme">
            <button class="close-btn" @click="closeForm">✖</button>
            <form>
                <div class="form-group" style="margin-top:30px;">
                    <label for="caption">Заголовок</label>
                    <textarea id="caption" v-model="post.caption" required class="form-control"
                        placeholder="Введите описание"></textarea>
                </div>

                <div class="form-group">
                    <label for="price">Цена:</label>
                    <input type="number" id="price" min="0" v-model.number="post.price" required />
                </div>

                <div class="form-group">
                    <label for="isBlurred">Размытое изображение:</label>
                    <input type="checkbox" id="isBlurred" v-model="post.isBlurred" />
                </div>

                <div class="form-group">
                    <label for="media">Фото или видео</label>
                    <!-- Добавляем реф к input -->
                    <input type="file" id="image" ref="fileInput" @change="handleFileChange" accept="image/*,video/*"
                        class="file-input" />
                    <!-- Кнопка для выбора файла -->
                    <el-button type="primary" class="custom-file-btn" @click="triggerFileInput">Выбрать файл</el-button>
                    <!-- Показать имя выбранного файла -->
                    <p v-if="post.media" class="selected-file">{{ post.media.name }}</p>
                    <p v-if="error" class="text-danger">{{ error }}</p>
                </div>

                <div class="mb-4">
                    <el-button type="success" class="custom-file-btn" style="margin-top: 15px;" plain
                        @click.prevent="handleSubmit">Опубликовать</el-button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

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
        caption: "",
        userId: "", // Будет заполнено значением sub
        price: 0,
        isBlurred: false,
        image: null, // Изображение будет сохраняться как файл
      },
      error: null,
    };
  },
  created() {
    // Получаем sub из Vuex и устанавливаем в userId
    this.post.userId = this.getSub;
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) {
          this.error = "Только фото или видео разрешено!";
          this.post.image = null;
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
              this.post.image = null;
            } else {
              this.error = null;
              this.post.image = file;
            }
          };

          img.src = objectUrl;
        } else {
          this.error = null;
          this.post.image = file;
        }
      } else {
        this.error = null;
        this.post.image = null;
      }
    },

    async handleSubmit() {
      if (!this.post.image) {
        this.error = "Пожалуйста, добавте фото или видео!";
        return;
      }
      try {
        const formData = new FormData();
        formData.append("caption", this.post.caption);
        formData.append("userId", this.post.userId); // Используем sub
        formData.append("price", this.post.price);
        formData.append("isBlurred", this.post.isBlurred);
        formData.append("image", this.post.image);

        console.log(
          "Дані для відправки:",
          this.post.caption,
          this.post.userId,
          this.post.price,
          this.post.isBlurred,
          this.post.image
        );
        const response = await axios.post(
          "https://ton-back-e015fa79eb60.herokuapp.com/api/posts",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          }
        );

        console.log("Ответ сервера:", response.data);
        alert("Пост добавлено успешно!");
        this.closeForm();
      } catch {
        console.error("Ошибка при отправке поста:", this.error);
        alert("Ошибка при отправке поста.");
      }
    },
    closeForm() {
      this.$emit("close");
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
  },
  computed: {
    ...mapGetters(["getSub"]), // Подключаем геттер getSub из Vuex
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
    justify-content: center;
    /* align-items: center; Центровка по вертикали */
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
    max-height: max-content;
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
    align-items: center;
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

/* Адаптивность для экранов меньше 1200px */
@media (max-width: 1200px) {
    .modal-content {
        width: 95%;
        /* Уменьшаем ширину */
        padding: 15px;
        /* Уменьшаем отступы */
    }

    .form-control {
        font-size: 0.4rem;
        /* Уменьшаем размер текста */
    }

    .custom-file-btn {
        width: 50%;
        /* Увеличиваем ширину кнопки */
    }

    .close-btn {
        font-size: 0.8rem;
        /* Уменьшаем размер кнопки закрытия */
    }

    .form-group {
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;

    }

    .custom-file-btn {
        position: sticky;
        width: 40%;
        margin: 0 auto;
        font-size: 14px !important;
        padding: 10px !important;
    }

    .custom-file-btn:hover {
        background-color: #4752c4;
    }
}
</style>
