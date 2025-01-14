<template>
  <div class="logout-container">
    <el-button
      type="danger"
      class="logout-button"
      @click="handleLogout"
    >
      <el-icon class="logout-icon">
        <Switch />
      </el-icon>
      Выйти из профиля
    </el-button>
    
    <Teleport to="body">
      <el-dialog
        v-model="showConfirmDialog"
        title="Подтверждение выхода"
        width="300px"
        class="logout-dialog"
        append-to-body
      >
        <span>Вы действительно хотите выйти?</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showConfirmDialog = false">Отмена</el-button>
            <el-button 
              type="danger" 
              :loading="isLoading"
              @click="confirmLogout"
            >
              Выйти
            </el-button>
          </span>
        </template>
      </el-dialog>
    </Teleport>
  </div>
</template>

<script>
import { Switch } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LogoutButton',
  components: {
    Switch
  },
  setup() {
    const router = useRouter();
    const showConfirmDialog = ref(false);
    const isLoading = ref(false);

    const handleLogout = () => {
      showConfirmDialog.value = true;
    };

    const confirmLogout = async () => {
      isLoading.value = true;
      
      try {
        // Dispatch global logout event
        window.dispatchEvent(new Event('logout'));

        // Очищаем все токены и данные аутентификации
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('userType');
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Диспетчеризация очистки состояния, если используется Vuex
        if (router.currentRoute.value.meta.store) {
          await router.currentRoute.value.meta.store.dispatch('clearAuth');
        }

        // Показываем сообщение об успешном выходе
        ElMessage.success('Вы успешно вышли из системы');

        // Перенаправляем на страницу логина
        router.push('/');
      } catch (error) {
        console.error('Ошибка при выходе:', error);
        ElMessage.error('Произошла ошибка при выходе');
      } finally {
        isLoading.value = false;
        showConfirmDialog.value = false;
      }
    };

    return {
      showConfirmDialog,
      isLoading,
      handleLogout,
      confirmLogout
    };
  }
};
</script>

<style scoped>
.logout-container {
  margin-top: 2rem;
  padding: 0 1rem;
  position: relative;

}

.logout-button {
  margin-left: 20px;
  width: 94%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(
    135deg,
    rgba(220, 38, 38, 0.9) 0%,
    rgba(185, 28, 28, 1) 100%
  );
  border: none;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 12px rgba(220, 38, 38, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.logout-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  transition: left 0.5s ease;
}

.logout-button:hover {
  transform: translateY(-2px);
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.9) 0%,
    rgba(220, 38, 38, 1) 100%
  );
  box-shadow: 
    0 6px 16px rgba(220, 38, 38, 0.3),
    0 2px 4px rgba(220, 38, 38, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
}

.logout-button:hover::before {
  left: 100%;
}

.logout-button:active {
  transform: translateY(0);
  box-shadow: 
    0 2px 8px rgba(220, 38, 38, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.logout-icon {
  font-size: 1.3em;
  transition: transform 0.3s ease;
}

.logout-button:hover .logout-icon {
  transform: rotate(180deg);
}

/* Стили модального окна */
:deep(.el-overlay) {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
}

:deep(.el-dialog) {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 !important;
  max-width: 90%;
  min-width: 300px;
  background: #1a1a1a;
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  margin: 0;
  text-align: center;
}

:deep(.el-dialog__title) {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
}

:deep(.el-dialog__body) {
  color: #e5e7eb;
  padding: 24px;
  text-align: center;
  font-size: 1rem;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.dialog-footer button {
  flex: 1;
  height: 40px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.dialog-footer :deep(.el-button--default) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.dialog-footer :deep(.el-button--default:hover) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.dialog-footer :deep(.el-button--danger) {
  background: linear-gradient(
    135deg,
    rgba(220, 38, 38, 0.9) 0%,
    rgba(185, 28, 28, 1) 100%
  );
  border: none;
}

.dialog-footer :deep(.el-button--danger:hover) {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.9) 0%,
    rgba(220, 38, 38, 1) 100%
  );
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
}

/* Медиа-запросы */
@media (max-width: 480px) {
  .logout-container {
    padding: 0 0.5rem;
  }

  .logout-button {
    height: 44px;
    font-size: 0.9em;
    margin-left: 3px;
    width: 100% !important;
    height: 45px;
    margin-top: -5px !important;
  }

  :deep(.el-dialog) {
    width: 90%;
    max-width: none;
  }

  :deep(.el-dialog__header) {
    padding: 16px;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
    font-size: 0.95rem;
  }

  :deep(.el-dialog__footer) {
    padding: 16px;
  }

  .dialog-footer button {
    height: 36px;
    font-size: 0.9rem;
  }
}

/* Анимация появления */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.el-dialog) {
  animation: fadeIn 0.3s ease-out forwards;
}

.logout-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -10px;
  width:96%;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-icon {
  margin-right: 6px;
}
</style>