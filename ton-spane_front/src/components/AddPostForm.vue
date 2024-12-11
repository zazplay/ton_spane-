<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import config from "../config";

// Define props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

// Define emits
const emit = defineEmits(["close"]);

// Reactive state
const post = ref({
  caption: "",
  userId: "936ed3cb-40da-4f18-a6ae-d48b4d34f1b2",  // Здесь будет присвоен sub
  price: 0,
  isBlurred: false,
  image: null,
});

const error = ref(null);

// Get the `getSub` getter from Vuex store
const store = useStore();
const getSub = computed(() => store.getters.getSub);

// Set userId when component is mounted
onMounted(() => {
  post.value.userId = getSub.value;  // Присваиваем значение sub в userId
});

// Handle file input change
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

        if (width > 2500 || height > 1260 || width < 512 || height < 512) {
          error.value = `Неверный размер изображения! Мин: 512x512, Макс: 2500x1260`;
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

// Handle form submission
const handleSubmit = async () => {
  if (!post.value.image) {
    error.value = "Пожалуйста, добавьте фото или видео!";
    return;
  }
  try {
    const formData = new FormData();
    formData.append("caption", post.value.caption);
    formData.append("userId", "936ed3cb-40da-4f18-a6ae-d48b4d34f1b2");
    formData.append("price", post.value.price);
    formData.append("isBlurred", post.value.isBlurred);
    formData.append("image", post.value.image);

    console.log("formData", post.value.caption, formData.userId, post.value.price, post.value.isBlurred, post.value.image);
    
    const response = await axios.post(
      `${config.API_BASE_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
    );
    console.log("response", response);
    alert("Пост добавлен успешно!");
    closeForm();
  } catch {
    alert("Ошибка при отправке поста.");
  }
};

// Close form
const closeForm = () => {
  emit("close");
};

// Trigger file input click
const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click();
};
</script>


<template>
  <div v-if="props.isOpen" class="modal-overlay">
    <div class="modal-content dark-theme">
      <button class="close-btn" @click="closeForm">✖</button>
      <form>
        <div class="form-group" style="margin-top:30px;">
          <label for="caption">Заголовок</label>
          <textarea id="caption" v-model="post.caption" required class="form-control"
            placeholder="Введите описание"></textarea>
        </div>

        <div style="display: flex; flex-direction: row; justify-content: space-between;">
          <div class="input-price">
            <label for="price">Цена:</label>
            <input style="margin-top: 10px;" type="number" id="price" min="0" max="999" v-model.number="post.price"
              required />
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

        <div>
          <input style="width: 15px; height: 15px;" type="checkbox" id="isBlurred" v-model="post.isBlurred" />
          <label for="isBlurred">Размытое изображение:</label>
        </div>

        <div class="mb-4">
          <el-button type="success" class="custom-file-btn" style="margin-top: 15px;" plain
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
  background: #2c2f33;
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
    max-width: 150px;    /* Ограничиваем ширину */

  }
}
</style>
