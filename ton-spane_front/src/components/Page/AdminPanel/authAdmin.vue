<!-- AdminAuth.vue -->
<template>
    <div class="admin-auth-container">
      <el-card class="admin-auth-card">
        <div class="admin-auth-header">
          <h2>Вход в панель администратора</h2>
        </div>
        
        <el-form 
          :model="formData"
          @submit.prevent="handleSubmit"
          class="admin-auth-form">
          
          <el-form-item>
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="Введите пароль администратора"
              show-password
              @keyup.enter="handleSubmit"
            />
          </el-form-item>
  
          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleSubmit"
              :loading="loading"
              class="submit-btn"
            >
              Войти в админ-панель
            </el-button>
          </el-form-item>
  
          <el-button 
            type="text" 
            @click="goBack"
            class="back-btn"
          >
            Вернуться на главную
          </el-button>
  
          <el-alert
            v-if="error"
            type="error"
            :title="error"
            show-icon
            @close="error = ''"
          />
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script>
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  
  const ADMIN_PASSWORD = 'X2k9#mP$vL5nQ@'
  
  const getThemeByTime = () => {
  const hours = new Date().getHours();
  return hours >= 6 && hours < 16 ? 'light' : 'dark';
};

  export default {
    name: 'AdminAuth',
    
    setup() {
      const router = useRouter()
      const loading = ref(false)
      const error = ref('')
      
      const formData = reactive({
        password: ''
      })
  
      onMounted(() => {
        // При монтировании компонента устанавливаем темную тему
        document.documentElement.className = 'dark'
        localStorage.setItem('theme', 'dark')
      })
  
      const handleSubmit = async () => {
        if (!formData.password) {
          error.value = 'Введите пароль'
          return
        }
  
        loading.value = true
        
        try {
          // Проверяем пароль
          if (formData.password === ADMIN_PASSWORD) {
            // Сохраняем токен в sessionStorage
            sessionStorage.setItem('adminToken', 'true')
            
            ElMessage({
              message: 'Успешная авторизация',
              type: 'success'
            })
            
            // Редиректим на админку
            router.push('/admin')
          } else {
            error.value = 'Неверный пароль администратора'
            // Очищаем поле пароля при неверном вводе
            formData.password = ''
          }
        } catch (err) {
          error.value = 'Ошибка авторизации'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
  
      const goBack = () => {
        router.push('/')
        // Восстанавливаем тему при возврате
        const savedTheme = localStorage.getItem('theme') || getThemeByTime()
        document.documentElement.className = savedTheme
      }
  
      return {
        formData,
        loading,
        error,
        handleSubmit,
        goBack
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--el-bg-color);
  }
  
  .admin-auth-card {
    width: 100%;
    max-width: 400px;
    margin: 20px;
  }
  
  .admin-auth-header {
    text-align: center;
    margin-bottom: 24px;
  }
  
  .admin-auth-form {
    margin-top: 24px;
  }
  
  .submit-btn {
    width: 100%;
  }
  
  .back-btn {
    display: block;
    margin: 16px auto;
  }
  
  :deep(.el-input__wrapper) {
    width: 100%;
  }
  
  :deep(.el-alert) {
    margin-top: 16px;
  }
  </style>