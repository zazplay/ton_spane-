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
            v-model="formData.email"
            type="email"
            placeholder="Email администратора"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="Пароль"
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
import axios from 'axios'

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
      email: '',
      password: ''
    })

    onMounted(() => {
      document.documentElement.className = 'dark'
      localStorage.setItem('theme', 'dark')
    })

    const handleSubmit = async () => {
      if (!formData.email || !formData.password) {
        error.value = 'Заполните все поля'
        return
      }

      loading.value = true
      
      try {
  const response = await axios.post('https://ton-back-e015fa79eb60.herokuapp.com/api/admin/login', {
    email: formData.email,
    password: formData.password
  })

  const { accessToken, refreshToken } = response.data

  localStorage.setItem('adminAccessToken', accessToken)
  localStorage.setItem('adminRefreshToken', refreshToken)
  sessionStorage.setItem('adminToken', 'true') // Добавлено
  
  ElMessage({
    message: 'Успешная авторизация',
    type: 'success'
  })
  
  await router.replace('/admin') // Заменено push на replace
} catch (err) {
  error.value = err.response?.data?.message || 'Ошибка авторизации'
  formData.password = ''
  console.error(err)
} finally {
        loading.value = false
      }
    }

    const goBack = () => {
      router.push('/')
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