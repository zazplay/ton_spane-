<template>
  <el-row justify="center" align="middle" class="h-screen">
    <el-col :xs="22" :sm="20" :md="16" :lg="12" :xl="8">
      <el-card class="box-card">
        <template #header>
          <el-text class="mx-auto d-block text-center" size="large" tag="h1" style="font-size: 32px">
            Войдите в аккаунт
          </el-text>
        </template>

        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top" size="large" status-icon>
          <el-form-item label="Эл. почта" prop="email" class="el-form-item--large">
            <el-input v-model="ruleForm.email" type="email" autocomplete="on" placeholder="example@email.com"
              :style="{ fontSize: '18px' }" />
          </el-form-item>

          <el-form-item label="Пароль" prop="pass" class="el-form-item--large">
            <el-input v-model="ruleForm.pass" type="password" autocomplete="off" placeholder="Введите пароль"
              show-password :style="{ fontSize: '18px' }" />
          </el-form-item>

          <el-form-item class="button-container">
            <el-button @click="resetForm(ruleFormRef)" class="reset-btn" :style="{ fontSize: '18px', height: '48px' }">
              Очистить
            </el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)" class="login-btn"
              :style="{ fontSize: '18px', height: '48px' }">
              Войти
            </el-button>


          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import axios from 'axios';
import config from "@/config";

export default defineComponent({
  name: 'AuthPage',
  setup() {
    const ruleFormRef = ref(null)

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Пожалуйста, введите пароль'))
      } else if (value.length < 6) {
        callback(new Error('Пароль должен быть не менее 6 символов'))
      } else if (!/[A-Z]/.test(value)) {
        callback(new Error('Пароль должен содержать хотя бы одну заглавную букву'))
      } else if (!/[0-9]/.test(value)) {
        callback(new Error('Пароль должен содержать хотя бы одну цифру'))
      } else {
        callback()
      }
    }

    const ruleForm = reactive({
      pass: '',
      email: '',
    })

    const rules = reactive({
      pass: [{
        validator: validatePass,
        trigger: 'blur',
        required: true
      }],
      email: [
        {
          required: true,
          message: 'Пожалуйста, введите email',
          trigger: 'blur',
        },
        {
          type: 'email',
          message: 'Пожалуйста, введите корректный email',
          trigger: ['blur', 'change'],
        }
      ]
    })

    const submitForm = async (formEl) => {
      if (!formEl) return;
      formEl.validate(async (valid) => {
        if (valid) {
          try {
            // URL вашего API для авторизации
            const apiUrl = `${config.API_BASE_URL}/auth/login`;

            // Данные для отправки
            const payload = {
              email: ruleForm.email,
              password: ruleForm.pass, // Измените ключ, если бекенд ожидает другое имя
            };

            console.log("apiUrl",apiUrl);
            console.log("payload",payload);
            // Отправка запроса
            const response = await axios.post(apiUrl, payload);

            // Обработка ответа
            console.log("Успешный вход:", response.data);

            // Дополнительно: сохранение токена или переход на другую страницу
            if (response.data.accessToken) {
              localStorage.setItem("authToken", response.data.accessToken);
              localStorage.setItem('refreshToken',response.data.refreshToken);
              alert("Вход выполнен успешно!");
              // Перенаправление
              window.location.href = "/tape";
            }
          } catch (error) {
            // Обработка ошибок
            console.error("Ошибка при входе:", error);
            alert("Не удалось выполнить вход. Проверьте данные и попробуйте снова.");
          }
        } else {
          console.log("Ошибка валидации формы!");
        }
      });
    };


    const resetForm = (formEl) => {
      if (!formEl) return
      formEl.resetFields()
    }

    return {
      ruleFormRef,
      ruleForm,
      rules,
      submitForm,
      resetForm
    }
  }
})
</script>


<style>
.h-screen {
  min-height: 100vh;
}

.box-card {
  padding: 20px;
}

.el-form-item--large .el-form-item__label {
  font-size: 18px !important;
  margin-bottom: 12px;
}

.el-card__header {
  padding: 30px 20px;
  border-bottom: none;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}

.login-btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
}

.reset-btn {
  width: 120px;
}

/* Адаптивные стили */
@media screen and (max-width: 768px) {
  .box-card {
    padding: 5px;
  }

  .el-card__header {
    padding: 15px 5px;
  }

  .el-form-item--large .el-form-item__label {
    font-size: 20px !important;
    margin-bottom: 0px;
  }

  .el-text {
    font-size: 24px !important;
  }

  .el-button {
    height: 50px !important;
  }

  .login-btn {
    width: 160px;
  }

  .reset-btn {
    width: 100px;
  }
}
</style>