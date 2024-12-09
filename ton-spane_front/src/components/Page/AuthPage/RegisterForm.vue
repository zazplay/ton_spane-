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
/*стили контейнера*/
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