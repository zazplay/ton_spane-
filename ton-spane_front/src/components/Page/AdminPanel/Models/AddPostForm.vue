<script setup>
import { ref, computed, onMounted,defineProps,defineEmits } from "vue";
import { useStore } from "vuex";
import { ElMessage } from 'element-plus';
import axios from "axios";
import config from "@/config";

const props = defineProps({
  userId: {
    type: String,
    required: false,
    default: undefined,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const post = ref({
  caption: "",
  userId: props.userId,
  price: 0,
  isBlurred: false,
  image: null,
});

const error = ref(null);

const store = useStore();
const getSub = computed(() => store.getters.getSub);

onMounted(() => {
  if (!post.value.userId) {
    post.value.userId = getSub.value;
  }
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  
  if (file) {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    
    if (!isImage && !isVideo) {
      error.value = "Только фото или видео разрешено!";
      post.value.image = null;
      return;
    }
    
    if (isImage) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        const { width, height } = img;
        URL.revokeObjectURL(objectUrl);
        
        if (width > 3000 || height > 2000 || width < 200 || height < 200) {
          error.value = `Неверный размер изображения! Мин: 200x200, Макс: 3000x2000`;
          post.value.image = null;
        } else {
          error.value = null;
          post.value.image = file;
        }
      };
      
      img.src = objectUrl;
    } else {
      error.value = null;
      post.value.image = file;
    }
  } else {
    error.value = null;
    post.value.image = null;
  }
};

const handleSubmit = async () => {
  if (!post.value.userId) {
    error.value = "Ошибка: ID пользователя не определен";
    return;
  }

  if (!post.value.image) {
    error.value = "Пожалуйста, добавьте фото или видео!";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("caption", post.value.caption);
    formData.append("userId", post.value.userId);
    formData.append("price", post.value.price.toString());
    formData.append("isBlurred", post.value.isBlurred ? "true" : "false");
    formData.append("image", post.value.image);

    const response = await axios.post(
      `${config.API_BASE_URL}/posts`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "accept": "*/*"
        }
      }
    );

    if (response.status === 201) {
      ElMessage.success("Пост добавлен успешно!");
      
      post.value = {
        caption: "",
        userId: props.userId,
        price: 0,
        isBlurred: false,
        image: null,
      };
      
      window.dispatchEvent(new CustomEvent('postsDataChanged', {
        detail: response.data
      }));
      
      closeForm();
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Ошибка при отправке поста.";
    console.error('Error details:', {
      status: err.response?.status,
      message: errorMessage,
      data: err.response?.data
    });
    error.value = errorMessage;
    ElMessage.error(errorMessage);
  }
};

const closeForm = () => {
  emit("close");
};

const limitInput = (event) => {
  const value = event.target.value;
  if (value.length > 4) {
    event.target.value = value.slice(0, 4);
  }
};

const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click();
};
</script>


<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content dark-theme">
      <button class="close-btn" @click="closeForm">✖</button>
      <form>
        <label for="caption">Текст:</label>
        <div class="input-caption">
          <textarea id="caption" v-model="post.caption" required placeholder="Введите описание"></textarea>
        </div>


        <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 20px;">
          <div>
            <label for="price">Цена:</label>
            <div class="input-price">
              <input type="number" id="price" min="0" max="999" v-model.number="post.price" required maxlength="4"
                size="4" @input="limitInput" />
            </div>
          </div>
          <div style="display: flex; flex-direction: row;">
            <!-- Показать имя выбранного файла -->
            <p v-if="post.image" class="selected-file"> {{ post.image.name }}</p>
            <div style="display: flex; flex-direction: column;">
              <label for="media">Фото или видео</label>
              <!-- Добавляем реф к input -->
              <input type="file" id="image" ref="fileInput" @change="handleFileChange" accept="image/*,video/*"
                class="file-input" />
              <!-- Кнопка для выбора файла -->
              <el-button type="primary" class="custom-file-btn" @click="triggerFileInput">
                Выбрать файл
              </el-button>
            </div>

          </div>
        </div>
        <p v-if="error" class="text-danger">{{ error }}</p>

        <div class="input-blurred">
          <input v-model="post.isBlurred" type="checkbox" id="isBlurred" />
          <label for="isBlurred" style="color: white;">Размытое изображение</label>
        </div>

        <div >
          <el-button type="success" style="margin-top: 35px;" plain
            @click.prevent="handleSubmit">
            Опубликовать
          </el-button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Затемнение фона */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Используем 100% высоты экрана */
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  /* Центрируем окно по вертикали */
}

/* Содержимое модального окна */
.modal-content {
  position: relative;
  background: rgb(30, 27, 27);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px;
  max-height: max-content;
  color: #ffffff;
  overflow-y: auto;
  /* Если контент превышает высоту, появляется скролл */
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

/* Стилизация текстового input */
.form-control {
  width: 97%;
  margin-top: 15px;
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  background: #2c2f33;
  color: #ffffff;
  border: 1px solid #5865f2;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #7289da;
  box-shadow: 0 0 8px rgba(114, 137, 218, 0.8);
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
  /* width: 30%; */
  margin: 10px auto;
}

.custom-file-btn:hover {
  background-color: #4752c4;
}

/* Стили для отображения имени выбранного файла */
.selected-file {
  justify-content: center;
  margin-top: 38px;

  font-size: 1rem;
  color: #f1f1f1;
  max-width: 300px;
  /* Ограничиваем ширину  */
  white-space: nowrap;
  /* Отключаем перенос текста */
  overflow: hidden;
  /*Скрываем переполнение */
  text-overflow: ellipsis;
  /* Добавляем многоточие при переполнении */
  margin-right: 10px;
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
  margin-top: 20px;
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

  /* .custom-file-btn {
    width: 50%;
     Увеличиваем ширину кнопки  
  } */

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
    /* width: 40%; */
    margin: 0 auto;
    font-size: 14px !important;
    padding: 10px !important;
  }

  .custom-file-btn:hover {
    background-color: #4752c4;
  }

  .selected-file {
    font-size: 14px;
    max-width: 150px;
    /* Ограничиваем ширину */

  }
}
</style>
