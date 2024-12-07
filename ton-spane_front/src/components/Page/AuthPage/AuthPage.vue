<template>
  <div class="auth-container">
    <div class="form-card">
      <h1 class="title">Войдите в аккаунт</h1>

      <form @submit.prevent="submitForm" class="auth-form">
        <div class="form-item">
          <label for="email" class="label-style">Эл. почта</label>
          <input v-model="ruleForm.email" type="email" id="email" placeholder="example@email.com" required />
          <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
        </div>

        <div class="form-item">
          <label for="pass" class="label-style">Пароль</label>
          <input v-model="ruleForm.pass" type="password" id="pass" placeholder="Введите пароль" required />
          <p v-if="errors.pass" class="error-text">{{ errors.pass }}</p>
        </div>

        <div class="form-actions">
          <button class="red-btn" type="button" @click="resetForm">Очистить</button>
          <button type="submit" class="submit-btn blue-btn">Войти</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '@/config';

export default {
  name: 'AuthPage',
  data() {
    return {
      ruleForm: {
        email: '',
        pass: ''
      },
      errors: {
        email: '',
        pass: ''
      }
    };
  },
  methods: {
    validateForm() {
      const errors = {};
      // Валидация email
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!this.ruleForm.email) {
        errors.email = 'Пожалуйста, введите email';
      } else if (!emailPattern.test(this.ruleForm.email)) {
        errors.email = 'Пожалуйста, введите корректный email';
      }

      // Валидация пароля
      const { pass } = this.ruleForm;
      if (!pass) {
        errors.pass = 'Пожалуйста, введите пароль';
      } else if (pass.length < 6) {
        errors.pass = 'Пароль должен быть не менее 6 символов';
      } else if (!/[A-Z]/.test(pass)) {
        errors.pass = 'Пароль должен содержать хотя бы одну заглавную букву';
      } else if (!/[0-9]/.test(pass)) {
        errors.pass = 'Пароль должен содержать хотя бы одну цифру';
      }

      this.errors = errors;
      return Object.keys(errors).length === 0;
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
            localStorage.setItem("authToken", response.data.accessToken);
            localStorage.setItem('refreshToken',response.data.refreshToken)
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
      this.ruleForm.email = '';
      this.ruleForm.pass = '';
      this.errors = {};
    }
  }
};
</script>

<style scoped>
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
  color: white;
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
}
</style>
