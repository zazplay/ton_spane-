<template>
  <h1 class="title">Регистрация</h1>
  <form @submit.prevent="submitRegistrationForm" class="auth-form">
      <div class="form-item">
          <label for="email" class="label-style">Эл. почта*</label>
          <input v-model="form.email" type="email" id="email" placeholder="example@email.com" required />
          <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
      </div>

      <div class="form-item">
          <label for="username" class="label-style">Имя пользователя</label>
          <input v-model="form.username" type="text" id="username" placeholder="Введите имя пользователя" />
          <p v-if="errors.username" class="error-text">{{ errors.username }}</p>
      </div>

      <div class="form-item">
          <label for="password" class="label-style">Пароль*</label>
          <div class="password-wrapper">
              <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  placeholder="Введите пароль" 
                  required 
              />
              <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showPassword = !showPassword"
              >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
          </div>
          <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          <ul class="password-requirements" v-show="form.password">
              <li :class="{ 'requirement-met': passwordLength }">Минимум 6 символов</li>
              <li :class="{ 'requirement-met': hasUpperCase }">Минимум 1 заглавная буква</li>
              <li :class="{ 'requirement-met': hasNumber }">Минимум 1 цифра</li>
          </ul>
      </div>

      <div class="form-item">
          <label for="confirmPassword" class="label-style">Повторите пароль*</label>
          <div class="password-wrapper">
              <input 
                  v-model="form.confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  placeholder="Повторите пароль"
                  required 
              />
              <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showConfirmPassword = !showConfirmPassword"
              >
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
          </div>
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
import { ElNotification } from 'element-plus';

export default {
  name: "RegisterForm",
  data() {
      return {
          form: {
              email: "",
              username: "",
              password: "",
              confirmPassword: "",
          },
          errors: {},
          showPassword: false,
          showConfirmPassword: false
      };
  },
  computed: {
      passwordLength() {
          return this.form.password.length >= 6;
      },
      hasUpperCase() {
          return /[A-Z]/.test(this.form.password);
      },
      hasNumber() {
          return /\d/.test(this.form.password);
      }
  },
  methods: {
      showNotification(type, message, title = '') {
          ElNotification({
              title: title,
              message: message,
              type: type,
              duration: 4500,
              position: 'top-right'
          });
      },
      validateForm() {
          const errors = {};
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

          if (!this.form.email) {
              errors.email = "Пожалуйста, введите email";
          } else if (!emailPattern.test(this.form.email)) {
              errors.email = "Введите корректный email";
          }

          if (this.form.username && this.form.username.length < 2) {
              errors.username = "Имя пользователя должно содержать минимум 2 символа";
          }

          if (!this.form.password) {
              errors.password = "Пожалуйста, введите пароль";
          } else {
              if (!this.passwordLength) {
                  errors.password = "Пароль должен быть не менее 6 символов";
              }
              if (!this.hasUpperCase) {
                  errors.password = (errors.password || "") + "\nПароль должен содержать хотя бы одну заглавную букву";
              }
              if (!this.hasNumber) {
                  errors.password = (errors.password || "") + "\nПароль должен содержать хотя бы одну цифру";
              }
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
                const apiUrl = `${config.API_BASE_URL}/users/`;
                
                const payload = {
                    email: this.form.email.toLowerCase(), // Нормализуем email
                    password: this.form.password,
                    username: this.form.username || undefined
                };

                const response = await axios.post(apiUrl, payload);

                if (response.status === 201) {
                    this.showNotification('success', 'Регистрация успешна! Пожалуйста, войдите в систему.');
                    this.$emit('registration-success');
                }
            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 409: {
                            // Проверяем точное сообщение об ошибке
                            const errorMessage = error.response.data.message;
                            if (errorMessage.includes('Email')) {
                                this.showNotification('error', 'Этот email уже зарегистрирован', 'Ошибка');
                                this.errors.email = "Этот email уже зарегистрирован";
                            } else if (errorMessage.includes('Username')) {
                                this.showNotification('error', 'Это имя пользователя уже занято', 'Ошибка');
                                this.errors.username = "Это имя пользователя уже занято";
                            } else {
                                // Общая ошибка конфликта
                                this.showNotification('error', errorMessage, 'Ошибка');
                            }
                            break;
                        }
                        case 400: {
                            this.showNotification('error', error.response.data.message, 'Ошибка валидации');
                            if (error.response.data.message.includes('Password')) {
                                this.errors.password = error.response.data.message;
                            }
                            break;
                        }
                        default: {
                            this.showNotification(
                                'error',
                                'Произошла ошибка при регистрации. Попробуйте позже.',
                                'Системная ошибка'
                            );
                        }
                    }

                    // Логируем ошибку для отладки
                    console.error('Registration error:', {
                        status: error.response.status,
                        message: error.response.data.message,
                        data: error.response.data
                    });
                } else {
                    this.showNotification(
                        'error',
                        'Ошибка соединения с сервером. Проверьте подключение к интернету.',
                        'Ошибка соединения'
                    );
                    console.error('Network error:', error);
                }
            }
        } else {
            this.showNotification('warning', 'Пожалуйста, исправьте ошибки в форме', 'Внимание');
        }
    },
      resetForm() {
          this.form.email = "";
          this.form.username = "";
          this.form.password = "";
          this.form.confirmPassword = "";
          this.errors = {};
          this.showPassword = false;
          this.showConfirmPassword = false;
          this.showNotification('info', 'Форма очищена', 'Информация');
      },
  },
};
</script>

<style scoped>
/* Base container styles */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Dark theme form card */
html.dark .form-card {
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 8, 78, 0.3);
  width: 100%;
  max-width: 400px;
  background: rgba(28, 36, 54, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(81, 119, 255, 0.1);
  animation: fadeIn 0.5s ease-out;
}

/* Light theme form card */
html:not(.dark) .form-card {
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 8, 78, 0.15);
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(81, 119, 255, 0.1);
  animation: fadeIn 0.5s ease-out;
}

/* Dark theme title */
html.dark .title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #fff;
  text-shadow: 0 0 10px rgba(79, 140, 255, 0.5);
}

/* Light theme title */
html:not(.dark) .title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #1f2937;
  text-shadow: 0 0 10px rgba(79, 140, 255, 0.2);
}

/* Form layout */
.auth-form {
  display: flex;
  flex-direction: column;
}

.form-item {
  margin-bottom: 20px;
  position: relative;
}

/* Dark theme form fields */
html.dark .form-item label {
  font-size: 16px;
  font-weight: 500;
  color: #89a4d1;
  margin-bottom: 8px;
  display: block;
  transition: color 0.3s ease;
}

html.dark .form-item input {
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

/* Light theme form fields */
html:not(.dark) .form-item label {
  font-size: 16px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 8px;
  display: block;
  transition: color 0.3s ease;
}

html:not(.dark) .form-item input {
  width: 100%;
  margin-top: 8px;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid rgba(81, 119, 255, 0.15);
  border-radius: 8px;
  color: #1f2937;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

/* Form field focus states */
html.dark .form-item input:focus {
  border-color: #4f8cff;
  box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.2);
  outline: none;
}

html:not(.dark) .form-item input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  outline: none;
}

/* Button styles */
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

/* Dark theme buttons */
html.dark .red-btn {
  background: linear-gradient(135deg, #ff4b6e 0%, #d61f3d 100%);
  color: white;
}

html.dark .red-btn:hover {
  background: linear-gradient(135deg, #ff3357 0%, #c01834 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 75, 110, 0.3);
}

html.dark .blue-btn {
  background: linear-gradient(135deg, #4f8cff 0%, #2563eb 100%);
  color: white;
}

html.dark .blue-btn:hover {
  background: linear-gradient(135deg, #3b7dff 0%, #1654dc 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.3);
}

/* Light theme buttons */
html:not(.dark) .red-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

html:not(.dark) .red-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

html:not(.dark) .blue-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

html:not(.dark) .blue-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* Password field styles */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 45px;
}

/* Dark theme password toggle */
html.dark .toggle-password {
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

html.dark .toggle-password:hover {
  color: #4f8cff;
}

/* Light theme password toggle */
html:not(.dark) .toggle-password {
  position: absolute;
  right: 5px;
  top: 57%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 18px;
  transition: color 0.3s ease;
  padding: 5px;
}

html:not(.dark) .toggle-password:hover {
  color: #3b82f6;
}

.toggle-password:focus {
  outline: none;
}

.toggle-password i {
  pointer-events: none;
}

/* Hover effects */
html.dark .form-item:hover label {
  color: #4f8cff;
}

html.dark .form-item input:focus + label {
  color: #4f8cff;
}

html:not(.dark) .form-item:hover label {
  color: #3b82f6;
}

html:not(.dark) .form-item input:focus + label {
  color: #3b82f6;
}

/* Animation */
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


.password-requirements {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

.password-requirements li {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 5px;
  position: relative;
  padding-left: 25px;
  transition: color 0.3s ease;
}

.password-requirements li::before {
  content: '✖';
  position: absolute;
  left: 0;
  color: #ef4444;
  transition: color 0.3s ease;
}

.password-requirements li.requirement-met {
  color: #10b981;
}

.password-requirements li.requirement-met::before {
  content: '✓';
  color: #10b981;
}

/* Dark theme adjustments */
html.dark .password-requirements li {
  color: #89a4d1;
}

html.dark .password-requirements li::before {
  color: #ff4b6e;
}

html.dark .password-requirements li.requirement-met {
  color: #2ecc71;
}

html.dark .password-requirements li.requirement-met::before {
  color: #2ecc71;
}
</style>