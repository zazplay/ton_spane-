<template>
  <div class="auth-container">
    <div class="form-card">
      <div class="header">
      <div class="button-group">
        <button @click="showLogin = true" :class="['header-btn', showLogin && 'active']">Вход</button>
        <button @click="showLogin = false" :class="['header-btn', !showLogin && 'active']">Регистрация</button>
      </div>
    </div>
      <div v-if="showLogin">
        <h1 class="title">Войдите в аккаунт</h1>

        <form @submit.prevent="submitForm" class="auth-form">
          <div class="form-item">
            <label for="email" class="label-style">Эл. почта</label>
            <input v-model="ruleForm.email" type="email" id="email" placeholder="example@email.com" required />
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>

          <div class="form-item">
            <label for="pass" class="label-style">Пароль</label>
            <div class="password-wrapper">
              <input v-model="ruleForm.pass" :type="showPassword ? 'text' : 'password'" id="pass"
                placeholder="Введите пароль" required />
              <button type="button" class="toggle-password" @click="togglePasswordVisibility">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p v-if="errors.pass" class="error-text">{{ errors.pass }}</p>
          </div>

          <div class="form-actions">
            <button class="red-btn" type="button" @click="resetForm">
              Очистить
            </button>
            <button type="submit" class="submit-btn blue-btn">Войти</button>
          </div>
        </form>
      </div>
      <div v-else>
        <RegisterForm />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "@/config";
import RegisterForm from "./RegisterForm.vue";

export default {
  name: "AuthPage",
  components: {
    RegisterForm,
  },
  data() {
    return {
      ruleForm: {
        email: "",
        pass: "",
      },
      errors: {
        email: "",
        pass: "",
      },
      showPassword: false, // Флаг для управления видимостью пароля
      showLogin: true, // Управление отображением формы входа/регистрации
    };
  },
  methods: {
    validateForm() {
      const errors = {};
      // Валидация email
      const emailPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!this.ruleForm.email) {
        errors.email = "Пожалуйста, введите email";
      } else if (!emailPattern.test(this.ruleForm.email)) {
        errors.email = "Пожалуйста, введите корректный email";
      }

      // Валидация пароля
      const { pass } = this.ruleForm;
      if (!pass) {
        errors.pass = "Пожалуйста, введите пароль";
      } else if (pass.length < 6) {
        errors.pass = "Пароль должен быть не менее 6 символов";
      } else if (!/[A-Z]/.test(pass)) {
        errors.pass = "Пароль должен содержать хотя бы одну заглавную букву";
      } else if (!/[0-9]/.test(pass)) {
        errors.pass = "Пароль должен содержать хотя бы одну цифру";
      }

      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async submitForm() {
      if (this.validateForm()) {
        try {
          // URL вашего API для авторизации
          const apiUrl = `${config.API_BASE_URL}/auth/login/`;

          // Данные для отправки
          const payload = {
            email: this.ruleForm.email,
            password: this.ruleForm.pass,
          };

          // Отправка запроса
          const response = await axios.post(apiUrl, payload);

          // Обработка ответа
          console.log("Успешный вход:", response.data);

          // Дополнительно: сохранение токена или переход на другую страницу
          if (response.data.accessToken) {
            sessionStorage.setItem("authToken", response.data.accessToken);
            sessionStorage.setItem("refreshToken", response.data.refreshToken);
            this.$store.dispatch('initializeSub', response.data.accessToken); // Инициализируем sub
            console.log('sub:', this.$store.state.sub); // Проверяем sub
            alert("Вход выполнен успешно!");
            window.location.href = "/app/tape";
          }
        } catch (error) {
          console.error("Ошибка при входе:", error);
          alert("Не удалось выполнить вход. Проверьте данные и попробуйте снова.");
        }
      } else {
        console.log("Ошибка валидации формы!");
      }
    },
    resetForm() {
      this.ruleForm.email = "";
      this.ruleForm.pass = "";
      this.errors = {};
    },
  },
};
</script>

<style scoped>
/* Контейнер для кнопок */
.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
}

/* Стили кнопок */
.header-btn {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid transparent;
  border-radius: 5px;
  background-color: white;
  color: #007bff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.header-btn:hover {
  background-color: #f1f1f1;
}

.header-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #0056b3;
}

/*стили контейнера*/
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  background-color: grey;
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.auth-form {
  display: flex;
  flex-direction: column;

}

.form-item {

  margin-bottom: 15px;
}

.form-item label {
  font-size: 22px;
  font-weight: 600;

  color: rgb(49, 41, 73);
}

.label-style {
  padding-left: 15px;
}

.form-item input {
  width: 95%;
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: black;
  background-color: whitesmoke;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submit-btn,
form button[type="button"] {
  /* color: white; */
  border: none;
  padding: 10px 20px;
  font-size: 22px;
  border-radius: 4px;
}

.submit-btn {
  width: max-content;
  padding: 10px;
}


.red-btn {
  background-color: rgb(196, 71, 71);
}

.red-btn:hover {
  background-color: rgb(177, 16, 16);
}

.blue-btn {
  background-color: #007bff;
}

.blue-btn:hover {
  background-color: #0056b3;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  top: 7px;
  right: -10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #25292c;
}

.toggle-password:focus {
  outline: none;
}

.toggle-password i {
  pointer-events: none;
}

.active {
  background-color: #0056b3;
}

/* Адаптивные стили */
@media screen and (max-width: 768px) {
  .form-card {
    padding: 15px;
  }

  .title {
    font-size: 20px;
  }

  .form-item input {
    font-size: 20px;
  }

  .submit-btn {
    font-size: 14px;
  }

  .header {
    justify-content: center;
  }

  .header-btn {
    font-size: 14px;
    padding: 8px 15px;
  }
}
</style>
