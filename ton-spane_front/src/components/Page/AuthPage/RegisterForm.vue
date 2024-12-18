<template>
    <h1 class="title">Регистрация</h1>
    <form @submit.prevent="submitRegistrationForm" class="auth-form">
        <div class="form-item">
            <label for="email" class="label-style">Эл. почта</label>
            <input v-model="form.email" type="email" id="email" placeholder="example@email.com" required />
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
        </div>

        <div class="form-item">
            <label for="password" class="label-style">Пароль</label>
            <input v-model="form.password" type="password" id="password" placeholder="Введите пароль" required />
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
        </div>

        <div class="form-item">
            <label for="confirmPassword" class="label-style">Повторите пароль</label>
            <input v-model="form.confirmPassword" type="password" id="confirmPassword" placeholder="Повторите пароль"
                required />
            <p v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</p>
        </div>

        <div class="form-actions">
            <button class="red-btn" type="button" @click="resetForm">Очистить</button>
            <button type="submit" class="submit-btn blue-btn">Зарегистрироваться</button>
        </div>
    </form>
</template>

<script>
import axios from 'axios';
import config from '@/config';

export default {
    name: "RegisterForm",
    data() {
        return {
            form: {
                email: "",
                password: "",
                confirmPassword: "",
            },
            errors: {},
        };
    },
    methods: {
        validateForm() {
            const errors = {};
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!this.form.email) {
                errors.email = "Пожалуйста, введите email";
            } else if (!emailPattern.test(this.form.email)) {
                errors.email = "Введите корректный email";
            }

            if (!this.form.password) {
                errors.password = "Пожалуйста, введите пароль";
            } else if (this.form.password.length < 6) {
                errors.password = "Пароль должен быть не менее 6 символов";
            }

            if (this.form.password !== this.form.confirmPassword) {
                errors.confirmPassword = "Пароли не совпадают";
            }

            this.errors = errors;
            return Object.keys(errors).length === 0;
        },
        async submitRegistrationForm() {
            if (this.validateForm()) {
                try {
                    // URL вашего API для авторизации
                    const apiUrl = `${config.API_BASE_URL}/auth/register/`;

                    // Данные для отправки
                    const payload = {
                        email: this.form.email,
                        password: this.form.password,
                    };

                    console.log("payload", payload);
                    // Отправка запроса
                    const response = await axios.post(apiUrl, payload);

                    // Обработка ответа
                    console.log("Успешная регистрация:", response);

                    if (response.status === 201) {
                        alert("Регистрация выполнена успешно!");
                        window.location.href = "/auth";
                    }
                   
                } catch (error) {
                    console.error("Ошибка при регистрации:", error);
                    alert("Не удалось выполнить регистрацию. Проверьте данные и попробуйте снова.");
                }
            } else {
                console.log("Ошибка валидации формы!");
            }
        },
        resetForm() {
            this.form.email = "";
            this.form.password = "";
            this.form.confirmPassword = "";
            this.errors = {};
        },
    },
};
</script>

<style scoped>
/* Стили контейнера */
.auth-container {
 display: flex;
 justify-content: center;
 align-items: center;
 height: 100vh;
}

.form-card {
 padding: 30px;
 border-radius: 15px;
 box-shadow: 0 8px 32px rgba(0, 8, 78, 0.3);
 width: 100%;
 max-width: 400px;
 background: rgba(28, 36, 54, 0.95);
 backdrop-filter: blur(10px);
 border: 1px solid rgba(81, 119, 255, 0.1);
}

.title {
 text-align: center;
 font-size: 28px;
 margin-bottom: 30px;
 color: #fff;
 text-shadow: 0 0 10px rgba(79, 140, 255, 0.5);
}

.auth-form {
 display: flex;
 flex-direction: column;
}

.form-item {
 margin-bottom: 20px;
 position: relative;
}

.form-item label {
 font-size: 16px;
 font-weight: 500;
 color: #89a4d1;
 margin-bottom: 8px;
 display: block;
 transition: color 0.3s ease;
}

.label-style {
 padding-left: 5px;
}

.form-item input {
 width: 100%;
 margin-top: 8px;
 padding: 12px 16px;
 font-size: 16px;
 border: 2px solid rgba(81, 119, 255, 0.2);
 border-radius: 8px;
 color: #fff;
 background-color: rgba(30, 41, 59, 0.8);
 transition: all 0.3s ease;
 box-sizing: border-box;
}

.form-item input:focus {
 border-color: #4f8cff;
 box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.2);
 outline: none;
}

.form-actions {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-top: 20px;
}

.submit-btn,
form button[type="button"] {
 border: none;
 padding: 12px 24px;
 font-size: 16px;
 border-radius: 8px;
 font-weight: 600;
 cursor: pointer;
 transition: all 0.3s ease;
}

.submit-btn {
 min-width: 120px;
}

.red-btn {
 background: linear-gradient(135deg, #ff4b6e 0%, #d61f3d 100%);
 color: white;
}

.red-btn:hover {
 background: linear-gradient(135deg, #ff3357 0%, #c01834 100%);
 transform: translateY(-1px);
 box-shadow: 0 4px 12px rgba(255, 75, 110, 0.3);
}

.blue-btn {
 background: linear-gradient(135deg, #4f8cff 0%, #2563eb 100%);
 color: white;
}

.blue-btn:hover {
 background: linear-gradient(135deg, #3b7dff 0%, #1654dc 100%);
 transform: translateY(-1px);
 box-shadow: 0 4px 12px rgba(79, 140, 255, 0.3);
}

.password-wrapper {
 position: relative;
 display: flex;
 align-items: center;
}

.password-wrapper input {
 padding-right: 45px;
}

.toggle-password {
 position: absolute;
 right: 5px;
 top: 57%;
 transform: translateY(-50%);
 background: none;
 border: none;
 cursor: pointer;
 color: #89a4d1;
 font-size: 18px;
 transition: color 0.3s ease;
 padding: 5px;
}

.toggle-password:hover {
 color: #4f8cff;
}

.toggle-password:focus {
 outline: none;
}

.toggle-password i {
 pointer-events: none;
}

/* Hover effects */
.form-item:hover label {
 color: #4f8cff;
}

/* Focus states */
.form-item input:focus + label {
 color: #4f8cff;
}

/* Animations */
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

.form-card {
 animation: fadeIn 0.5s ease-out;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
 .form-card {
   padding: 20px;
   margin: 0 20px;
 }

 .title {
   font-size: 24px;
 }

 .form-item input {
   font-size: 16px;
 }

 .submit-btn,
 form button[type="button"] {
   padding: 10px 20px;
   font-size: 14px;
 }
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
 .form-card {
   background: rgba(17, 24, 39, 0.95);
 }

 .form-item input {
   background-color: rgba(17, 24, 39, 0.8);
 }
}
</style>