<template>
  <div class="page-wrapper">
    <!-- Размытый фон -->
    <div class="background-container">
      <div class="background-overlay"></div>
    </div>
    
    <!-- Контент авторизации -->
    <div class="auth-container">
      <div class="logo-container">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M17.516 3c2.382 0 4.487 1.564 4.487 4.712 0 4.963-6.528 8.297-10.003 11.935-3.475-3.638-10.002-6.971-10.002-11.934 0-3.055 2.008-4.713 4.487-4.713 3.18 0 4.846 3.644 5.515 5.312.667-1.666 2.333-5.312 5.516-5.312zm0-2c-2.174 0-4.346 1.062-5.516 3.419-1.17-2.357-3.342-3.419-5.515-3.419-3.403 0-6.484 2.39-6.484 6.689 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-4.586-3.414-6.689-6.484-6.689z" />
          </svg>
        </div>
        <div class="logo-text">
          <span class="text-gradient">Dream</span>scape
        </div>
      </div>

      <div class="form-card">
        <div class="header">
          <div class="button-group">
            <button @click="showLogin = true" :class="['header-btn', showLogin && 'active']">
              Вход
            </button>
            <button @click="showLogin = false" :class="['header-btn', !showLogin && 'active']">
              Регистрация
            </button>
          </div>
        </div>

        <div v-if="showLogin">
          <h1 class="title">Войдите в аккаунт</h1>

          <!-- Переключатель метода входа -->
          <div class="auth-method-switch">
            <button 
              @click="loginMethod = 'email'" 
              :class="['switch-btn', loginMethod === 'email' && 'active']"
            >
              По email
            </button>
            <button 
              @click="loginMethod = 'username'" 
              :class="['switch-btn', loginMethod === 'username' && 'active']"
            >
              По нику
            </button>
          </div>

          <form @submit.prevent="submitForm" class="auth-form">
            <!-- Поле для email/username -->
            <div class="form-item">
              <label :for="loginMethod" class="label-style">
                {{ loginMethod === 'email' ? 'Эл. почта' : 'Никнейм' }}
              </label>
              <input 
                v-model="ruleForm[loginMethod]" 
                :type="loginMethod === 'email' ? 'email' : 'text'"
                :id="loginMethod"
                :placeholder="loginMethod === 'email' ? 'example@email.com' : 'Введите никнейм'" 
                required 
              />
              <p v-if="errors[loginMethod]" class="error-text">{{ errors[loginMethod] }}</p>
            </div>

            <!-- Поле для пароля -->
            <div class="form-item">
              <label for="pass" class="label-style">Пароль</label>
              <div class="password-wrapper">
                <input 
                  v-model="ruleForm.pass" 
                  :type="showPassword ? 'text' : 'password'" 
                  id="pass"
                  placeholder="Введите пароль" 
                  required 
                />
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="togglePasswordVisibility"
                >
                  <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                </button>
              </div>
              <p v-if="errors.pass" class="error-text">{{ errors.pass }}</p>
            </div>

            <!-- Кнопки действий -->
            <div class="form-actions">
              <button 
                type="submit" 
                class="submit-btn blue-btn" 
                :disabled="isLoading"
              >
                <span v-if="!isLoading">Войти</span>
                <div v-else class="loading-spinner">
                  <div class="spinner"></div>
                </div>
              </button>
              <button 
                class="red-btn" 
                type="button" 
                @click="resetForm" 
                :disabled="isLoading"
              >
                Очистить
              </button>
            </div>

            <div class="guest-section">
              <div class="separator">
                <span>или</span>
              </div>
              <button 
                @click="guestEntry" 
                class="guest-btn"
                type="button"
              >
                Войти как гость
              </button>
            </div>
          </form>
        </div>
        <div v-else>
          <RegisterForm @registration-success="onRegistrationSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "@/config";
import RegisterForm from "./RegisterForm.vue";
import { ElNotification } from 'element-plus'

export default {
  name: "AuthPage",
  components: {
    RegisterForm,
  },
  data() {
    return {
      ruleForm: {
        email: "",
        username: "",
        pass: "",
      },
      errors: {
        email: "",
        username: "",
        pass: "",
      },
      loginMethod: "email",
      showPassword: false,
      showLogin: true,
      isLoading: false,
    };
  },
  methods: {
    onRegistrationSuccess() {
      this.showLogin = true;
    },
    validateForm() {
  const errors = {};
  
  if (this.loginMethod === 'email') {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.ruleForm.email) {
      errors.email = "Пожалуйста, введите email";
    } else if (!emailPattern.test(this.ruleForm.email)) {
      errors.email = "Пожалуйста, введите корректный email";
    }
  } else {
    // Валидация никнейма
    const usernamePattern = /^[a-zA-Z0-9_]{2,20}$/;
    if (!this.ruleForm.username) {
      errors.username = "Пожалуйста, введите никнейм";
    } else if (!usernamePattern.test(this.ruleForm.username)) {
      errors.username = "Никнейм должен содержать от 2 до 20 символов (только буквы, цифры и '_')";
    }
  }

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
        this.isLoading = true;
        try {
          const apiUrl = `${config.API_BASE_URL}/auth/login/`;
          const payload = {
            email: this.loginMethod === 'email' ? this.ruleForm.email : this.ruleForm.username,
            password: this.ruleForm.pass,
          };

          if(this.loginMethod === 'email'){
            sessionStorage.setItem("userType", "user");
          } else {
            sessionStorage.setItem("userType", "model");
          }

          const response = await axios.post(apiUrl, payload);

          if (response.data.accessToken) {
            sessionStorage.setItem("authToken", response.data.accessToken);
            sessionStorage.setItem("refreshToken", response.data.refreshToken);
            this.$store.dispatch('initializeSub', response.data.accessToken);
            
            ElNotification({
              title: 'Успешно',
              message: 'Вход выполнен успешно!',
              type: 'success',
              duration: 3000
            });

            setTimeout(() => {
              this.isLoading = false;
              window.location.href = "/app/tape";
            }, 500);
          }
        } catch (error) {
          this.isLoading = false;
          
          if (error.response) {
            switch (error.response.status) {
              case 401:
                ElNotification({
                  title: 'Ошибка',
                  message: 'Неверный логин или пароль',
                  type: 'error',
                  duration: 5000
                });
                break;
              case 404:
                ElNotification({
                  title: 'Ошибка',
                  message: 'Пользователь не найден',
                  type: 'error',
                  duration: 5000
                });
                break;
              case 429:
                ElNotification({
                  title: 'Ошибка',
                  message: 'Слишком много попыток входа. Пожалуйста, подождите немного',
                  type: 'warning',
                  duration: 5000
                });
                break;
              default:
                ElNotification({
                  title: 'Ошибка',
                  message: 'Произошла ошибка при входе. Попробуйте позже',
                  type: 'error',
                  duration: 5000
                });
            }
          } else {
            ElNotification({
              title: 'Ошибка соединения',
              message: 'Проверьте подключение к интернету',
              type: 'error',
              duration: 5000
            });
          }
        }
      } else {
        ElNotification({
          title: 'Внимание',
          message: 'Пожалуйста, исправьте ошибки в форме',
          type: 'warning',
          duration: 4000
        });
      }
    },

    resetForm() {
      this.ruleForm.email = "";
      this.ruleForm.username = "";
      this.ruleForm.pass = "";
      this.errors = {};
    },

    guestEntry() {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userType");
      window.location.href = "/app/tape";
    }
  },
  
  watch: {
    loginMethod() {
      this.errors = {};
      this.ruleForm.email = "";
      this.ruleForm.username = "";
    }
  }
};
</script>

<style scoped>
.guest-section {
  margin-top: 20px;
  text-align: center;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 15px 0;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.separator span {
  padding: 0 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.guest-btn {
            /* Градиентный зеленый фон */
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            border: none;
            border-radius: 10px;
            
            /* Типографика */
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 16px;
            font-weight: 500;
            
            /* Эффекты */
            padding: 12px 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.3s ease;
            
            /* Анимация */
            background-size: 200% 200%;
            animation: gradientFlow 5s ease infinite;
            
            /* Убираем обводку по умолчанию */
            outline: none;
            position: relative;
            overflow: hidden;
        }
        
        /* Анимация градиента */
        @keyframes gradientFlow {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
        
        /* Эффект при наведении */
        .guest-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0,0,0,0.15);
        }
        
        /* Эффект нажатия */
        .guest-btn:active {
            transform: scale(0.97) translateY(1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        /* Пульсирующий эффект */
        .guest-btn::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(
                circle at center, 
                rgba(255,255,255,0.3) 0%, 
                transparent 70%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .guest-btn:hover::before {
            opacity: 1;
        }

/* Dark theme styles */
html.dark .separator::before,
html.dark .separator::after {
  border-color: rgba(255, 255, 255, 0.2);
}

html.dark .separator span {
  color: rgba(255, 255, 255, 0.6);
}

/* Light theme styles */
html:not(.dark) .separator::before,
html:not(.dark) .separator::after {
  border-color: rgba(0, 0, 0, 0.2);
}

html:not(.dark) .separator span {
  color: rgba(0, 0, 0, 0.6);
}

html:not(.dark) .guest-btn {
  border-color: rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.8);
}

html:not(.dark) .guest-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.3);
}

@media screen and (max-width: 480px) {
  .guest-section {
    margin-top: 15px;
  }
  
  .guest-btn {
    font-size: 13px;
    padding: 8px 16px;
  }
}

.page-wrapper {
  min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 50%;
  left: 50%; 
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%) scale(1.1);
  background-image: url('@/assets/2MdY.gif');
  background-size: cover;
  background-position: center;
  filter: blur(100px);
  opacity: 0.8;
}

.background-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 87%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  padding-top: 20px; /* Добавляем padding вместо отрицательного margin */
  margin: 0 auto; /* Центрируем контейнер */
}

/* Обновленные стили для формы */
.form-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Dark theme specific styles */
html.dark .form-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Дополнительные стили для улучшения контраста */
html.dark .title,
html.dark .label-style,
html.dark input::placeholder {
  color: rgba(255, 255, 255, 0.9);
}

html.dark .form-item input {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

/* Hover эффекты для тёмной темы */
html.dark .form-item input:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

html.dark .form-item input:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.4);
}

/* Анимация появления компонентов */
.auth-container {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap');

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center; /* Центрируем логотип */
  font-family: 'Comfortaa', cursive;
  border-radius: 10px;
  margin-bottom: 20px; /* Добавляем отступ снизу */
}

/* Dark theme logo */
html.dark .logo-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #007bff, #00bfff);
  border-radius: 50%;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

/* Light theme logo */
html:not(.dark) .logo-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #0057b7, #0098cc);
  border-radius: 50%;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 87, 183, 0.2);
}

.logo-icon svg {
  width: 36px;
  height: 36px;
  fill: white;
}

/* Dark theme logo text */
html.dark .logo-text {
  font-size: 36px;
  background: linear-gradient(45deg, #007bff, #00bfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Light theme logo text */
html:not(.dark) .logo-text {
  font-size: 36px;
  background: linear-gradient(45deg, #0057b7, #0098cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Dark theme text gradient */
html.dark .text-gradient {
  background: linear-gradient(45deg, #ffffff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Light theme text gradient */
html:not(.dark) .text-gradient {
  background: linear-gradient(45deg, #ffffff, #d27bdb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
}

/* Dark theme header button */
html.dark .header-btn {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid rgba(81, 119, 255, 0.2);
  border-radius: 8px;
  background-color: rgba(30, 41, 59, 0.8);
  color: #89a4d1;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* Light theme header button */
html:not(.dark) .header-btn {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid rgba(81, 119, 255, 0.15);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #4a5568;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* Dark theme header button hover */
html.dark .header-btn:hover {
  background-color: rgba(79, 140, 255, 0.1);
  border-color: #4f8cff;
  color: #4f8cff;
}

/* Light theme header button hover */
html:not(.dark) .header-btn:hover {
  background-color: rgba(79, 140, 255, 0.05);
  border-color: #3b82f6;
  color: #3b82f6;
}

/* Dark theme active header button */
html.dark .header-btn.active {
  background: linear-gradient(135deg, #4f8cff 0%, #2563eb 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.3);
}

/* Light theme active header button */
html:not(.dark) .header-btn.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* Container Styles */
.auth-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
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

/* Form Styles */
.auth-form {
  display: flex;
  flex-direction: column;
}

.form-item {
  margin-bottom: 20px;
  position: relative;
}

/* Dark theme form labels */
html.dark .form-item label {
  font-size: 16px;
  font-weight: 500;
  color: #89a4d1;
  margin-bottom: 8px;
  display: block;
  transition: color 0.3s ease;
}

/* Light theme form labels */
html:not(.dark) .form-item label {
  font-size: 16px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 8px;
  display: block;
  transition: color 0.3s ease;
}

.label-style {
  padding-left: 5px;
}

/* Dark theme form inputs */
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

/* Light theme form inputs */
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

/* Dark theme input focus */
html.dark .form-item input:focus {
  border-color: #4f8cff;
  box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.2);
  outline: none;
}

/* Light theme input focus */
html:not(.dark) .form-item input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  outline: none;
}

/* Button Styles */
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
  position: relative;
}

/* Dark theme red button */
html.dark .red-btn {
  background: linear-gradient(135deg, #ff4b6e 0%, #d61f3d 100%);
  color: white;
}

/* Light theme red button */
html:not(.dark) .red-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

/* Dark theme red button hover */
html.dark .red-btn:hover {
  background: linear-gradient(135deg, #ff3357 0%, #c01834 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 75, 110, 0.3);
}

/* Light theme red button hover */
html:not(.dark) .red-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

/* Dark theme blue button */
html.dark .blue-btn {
  background: linear-gradient(135deg, #4f8cff 0%, #2563eb 100%);
  color: white;
}

/* Light theme blue button */
html:not(.dark) .blue-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

/* Dark theme blue button hover */
html.dark .blue-btn:hover {
  background: linear-gradient(135deg, #3b7dff 0%, #1654dc 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.3);
}

/* Light theme blue button hover */
html:not(.dark) .blue-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* Password Field Styles */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 45px;
}

/* Dark theme toggle password */
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

/* Light theme toggle password */
html:not(.dark) .toggle-password {
  position: absolute;
  right: 5px;
  top: 57%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #4a5568;
  font-size: 18px;
  transition: color 0.3s ease;
  padding: 5px;
}

/* Dark theme toggle password hover */
html.dark .toggle-password:hover {
  color: #4f8cff;
}

/* Light theme toggle password hover */
html:not(.dark) .toggle-password:hover {
  color: #3b82f6;
}

.toggle-password:focus {
  outline: none;
}

.toggle-password i {
  pointer-events: none;
}

/* Error Styles */
.error-text {
  color: #ff4b6e;
  font-size: 14px;
  margin-top: 5px;
  animation: fadeIn 0.3s ease;
}

/* Loading Animation */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 24px;
}

/* Dark theme spinner */
html.dark .spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}

/* Light theme spinner */
html:not(.dark) .spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 0.8s linear infinite;
}

/* Button States */
/* Dark theme disabled buttons */
html.dark .submit-btn:disabled,
html.dark .red-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  background: linear-gradient(135deg, #4f8cff80 0%, #2563eb80 100%);
}

/* Light theme disabled buttons */
html:not(.dark) .submit-btn:disabled,
html:not(.dark) .red-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  background: linear-gradient(135deg, #3b82f680 0%, #2563eb80 100%);
}

.submit-btn span {
  display: inline-block;
  transition: opacity 0.3s ease;
}

.submit-btn:disabled span {
  opacity: 0.7;
}

/* Hover Effects */
/* Dark theme hover effects */
html.dark .form-item:hover label {
  color: #4f8cff;
}

html.dark .form-item input:focus + label {
  color: #4f8cff;
}

/* Light theme hover effects */
html:not(.dark) .form-item:hover label {
  color: #3b82f6;
}

html:not(.dark) .form-item input:focus + label {
  color: #3b82f6;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes successLogin {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px);
    opacity: 0;
  }
}

/* Responsive Design */
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

  .dreamscape-logo .logo-text {
    font-size: 36px;
  }
}

@media screen and (max-width: 480px) {
  .dreamscape-logo .logo-text {
    font-size: 32px;
  }

  .header-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .form-card {
    padding: 15px;
  }

  .form-actions {
    flex-direction: column;
    gap: 10px;
  }

  .submit-btn,
  .red-btn {
    width: 100%;
  }
}

/* Additional hover effects */
/* Dark theme hover effects */
html.dark .form-item input:hover {
  border-color: rgba(81, 119, 255, 0.4);
}

html.dark .form-card:hover {
  border-color: rgba(81, 119, 255, 0.2);
  box-shadow: 0 10px 40px rgba(0, 8, 78, 0.35);
}

/* Light theme hover effects */
html:not(.dark) .form-item input:hover {
  border-color: rgba(59, 130, 246, 0.3);
}

html:not(.dark) .form-card:hover {
  border-color: rgba(59, 130, 246, 0.15);
  box-shadow: 0 10px 40px rgba(0, 8, 78, 0.15);
}

.toggle-password:active {
  transform: translateY(-50%) scale(0.95);
}

/* Enhanced focus states for accessibility */
/* Dark theme focus states */
html.dark .header-btn:focus,
html.dark .submit-btn:focus,
html.dark .red-btn:focus,
html.dark .toggle-password:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.4);
}

/* Light theme focus states */
html:not(.dark) .header-btn:focus,
html:not(.dark) .submit-btn:focus,
html:not(.dark) .red-btn:focus,
html:not(.dark) .toggle-password:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Smooth transitions */
.form-card,
.header-btn,
.submit-btn,
.red-btn,
.form-item input,
.toggle-password {
  will-change: transform, box-shadow, border-color;
}

/* Новые стили для переключателя метода входа */
.auth-method-switch {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 0 10px;
}

/* Dark theme switch button */
html.dark .switch-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: 2px solid rgba(81, 119, 255, 0.2);
  border-radius: 6px;
  background-color: rgba(30, 41, 59, 0.8);
  color: #89a4d1;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* Light theme switch button */
html:not(.dark) .switch-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: 2px solid rgba(81, 119, 255, 0.15);
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #4a5568;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* Dark theme active switch button */
html.dark .switch-btn.active {
  background: linear-gradient(135deg, #4f8cff 0%, #2563eb 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(79, 140, 255, 0.3);
}

/* Light theme active switch button */
html:not(.dark) .switch-btn.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

/* Dark theme hover effects */
html.dark .switch-btn:hover:not(.active) {
  background-color: rgba(79, 140, 255, 0.1);
  border-color: #4f8cff;
  color: #4f8cff;
}

/* Light theme hover effects */
html:not(.dark) .switch-btn:hover:not(.active) {
  background-color: rgba(59, 130, 246, 0.05);
  border-color: #3b82f6;
  color: #3b82f6;
}

/* Focus states for accessibility */
.switch-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Responsive styles for switch buttons */
@media screen and (max-width: 480px) {
  .auth-method-switch {
    flex-direction: row;
    width: 100%;
  }
  
  .switch-btn {
    flex: 1;
    text-align: center;
  }
}
</style>