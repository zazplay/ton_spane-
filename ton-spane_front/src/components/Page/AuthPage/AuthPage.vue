<template>
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
                <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </button>
            </div>
            <p v-if="errors.pass" class="error-text">{{ errors.pass }}</p>
          </div>

          <div class="form-actions">
            <button class="red-btn" type="button" @click="resetForm" :disabled="isLoading">
              Очистить
            </button>
            <button type="submit" class="submit-btn blue-btn" :disabled="isLoading">
              <span v-if="!isLoading">Войти</span>
              <div v-else class="loading-spinner">
                <div class="spinner"></div>
              </div>
            </button>
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
      showPassword: false,
      showLogin: true,
      isLoading: false,
    };
  },
  methods: {
    validateForm() {
      const errors = {};
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!this.ruleForm.email) {
        errors.email = "Пожалуйста, введите email";
      } else if (!emailPattern.test(this.ruleForm.email)) {
        errors.email = "Пожалуйста, введите корректный email";
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
            email: this.ruleForm.email,
            password: this.ruleForm.pass,
          };

          const response = await axios.post(apiUrl, payload);

          if (response.data.accessToken) {
            sessionStorage.setItem("authToken", response.data.accessToken);
            sessionStorage.setItem("refreshToken", response.data.refreshToken);
            this.$store.dispatch('initializeSub', response.data.accessToken);
            
            setTimeout(() => {
              this.isLoading = false;
              window.location.href = "/app/tape";
            }, 500);
          }
        } catch (error) {
          console.error("Ошибка при входе:", error);
          this.isLoading = false;
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
/* DreamScape Logo Styles */
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap');

.logo-container {
  display: flex;
  align-items: center;
  font-family: 'Comfortaa', cursive;
  padding: 10px;
  border-radius: 10px;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #007bff, #00bfff);
  border-radius: 50%;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-icon svg {
  width: 36px;
  height: 36px;
  fill: white;
}

.logo-text {
  font-size: 36px;
  background: linear-gradient(45deg, #007bff, #00bfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient {
  background: linear-gradient(45deg, #ffffff, #f0f8ff);
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

.header-btn {
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

.header-btn:hover {
  background-color: rgba(79, 140, 255, 0.1);
  border-color: #4f8cff;
  color: #4f8cff;
}

.header-btn.active {
  background: linear-gradient(135deg, #4f8cff 0%, #2563eb 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.3);
}

/* Container Styles */
.auth-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
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
  animation: fadeIn 0.5s ease-out;
}

/* Form Styles */
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

/* Password Field Styles */
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

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}

/* Button States */
.submit-btn:disabled,
.red-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.submit-btn span {
  display: inline-block;
  transition: opacity 0.3s ease;
}

.submit-btn:disabled span {
  opacity: 0.7;
}

/* Hover Effects */
.form-item:hover label {
  color: #4f8cff;
}

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

/* Dark Theme */
@media (prefers-color-scheme: dark) {
  .form-card {
    background: rgba(17, 24, 39, 0.95);
  }
  /* Dark Theme Continued */
  .form-item input {
    background-color: rgba(17, 24, 39, 0.8);
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

/* Additional hover effects for form elements */
.form-item input:hover {
  border-color: rgba(81, 119, 255, 0.4);
}

.toggle-password:active {
  transform: translateY(-50%) scale(0.95);
}

.form-card:hover {
  border-color: rgba(81, 119, 255, 0.2);
  box-shadow: 0 10px 40px rgba(0, 8, 78, 0.35);
}

/* Enhanced focus states for accessibility */
.header-btn:focus,
.submit-btn:focus,
.red-btn:focus,
.toggle-password:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.4);
}

/* Smooth transitions for interactive elements */
.form-card,
.header-btn,
.submit-btn,
.red-btn,
.form-item input,
.toggle-password {
  will-change: transform, box-shadow, border-color;
}
</style>