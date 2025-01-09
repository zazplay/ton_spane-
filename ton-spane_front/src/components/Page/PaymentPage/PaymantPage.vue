<template>
  <Teleport to="body">
    <div v-if="dialogVisible" class="modal-overlay" @click.self="closeDialog">
      <div class="modal-dialog payment-modal custom-loading-svg" 
           v-loading="loading"
           :element-loading-svg="svg"
           element-loading-svg-view-box="-10, -10, 50, 50"
           element-loading-text="Обработка платежа, пожалуйста не закрывайте данное окно...">
        <button class="close-button" @click="closeDialog">×</button>
        <div class="payment-container">
          <!-- Остальное содержимое модального окна остается без изменений -->
          <div class="payment-header">
            <h2 class="payment-title">Оформление подписки</h2>
            <p class="payment-subtitle">Выберите способ оплаты</p>
          </div>

          <div class="payment-methods">
            <div 
              class="payment-method-item"
              :class="{ 'active': form.paymentMethod === 'card' }"
              @click="form.paymentMethod = 'card'"
            >
              <div class="method-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div class="method-info">
                <span class="method-title">Банковская карта</span>
                <span class="method-desc">Visa, Mastercard</span>
              </div>
            </div>

            <div 
              class="payment-method-item"
              :class="{ 'active': form.paymentMethod === 'crypto' }"
              @click="form.paymentMethod = 'crypto'"
            >
              <div class="method-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="8" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <div class="method-info">
                <span class="method-title">Криптовалюта</span>
                <span class="method-desc">BTC, ETH, USDT</span>
              </div>
            </div>
          </div>

          <div class="payment-form" v-if="form.paymentMethod === 'card'">
            <div class="form-group">
              <label>Номер карты</label>
              <input 
                v-model="form.cardNumber"
                type="text"
                placeholder="0000 0000 0000 0000"
                @input="formatCardNumber"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Срок</label>
                <input 
                  v-model="form.expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  @input="formatExpiryDate"
                />
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input 
                  v-model="form.cvv"
                  type="password"
                  placeholder="***"
                  maxlength="3"
                />
              </div>
            </div>
          </div>

          <div class="crypto-message" v-else>
          <div class="message-content">
            <div class="wallet-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
              </svg>
            </div>
            <span>Привяжите свой кошелек</span>
          </div>
          <a href="https://dreamscapes.top/" class="crypto-redirect-btn">
            Перейти к оплате
          </a>
        </div>

          <div class="payment-footer">
            <button class="cancel-btn" @click="closeDialog">
              Отмена
            </button>
            <button class="pay-btn" @click="submitForm">
              <a href="https://dreamscapes.top/" class="crypto-redirect-btn">
            Оплатить
          </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup>
/* eslint-disable no-unused-vars */
import { ref, reactive, defineExpose, watch, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const loading = ref(false)

const svg = `
         <path class="path" d="
           M 30 15
           L 28 17
           M 25.61 25.61
           A 15 15, 0, 0, 1, 15 30
           A 15 15, 0, 1, 1, 27.99 7.5
           L 15 15
         " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
       `

const emit = defineEmits(['paymentSuccess', 'paymentError'])

// Начальное состояние формы
const form = reactive({
  paymentMethod: 'card',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  amount: '999'
})

const closeDialog = () => {
  loading.value = false  // Сначала сбрасываем загрузку
  dialogVisible.value = false  // Потом закрываем диалог
  // Очистка формы при закрытии
  form.cardNumber = ''
  form.expiryDate = ''
  form.cvv = ''
}

const toggleScrollLock = (isLocked) => {
  document.body.style.overflow = isLocked ? 'hidden' : ''
}

watch(dialogVisible, (newValue) => {
  toggleScrollLock(newValue)
})

// Форматирование номера карты
const formatCardNumber = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  value = value.replace(/(\d{4})/g, '$1 ').trim()
  e.target.value = value.substring(0, 19)
  form.cardNumber = e.target.value
}

// Форматирование даты
const formatExpiryDate = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2)
  }
  
  e.target.value = value.substring(0, 5)
  form.expiryDate = e.target.value
}

// Валидация формы перед отправкой
const validateForm = () => {
  if (form.paymentMethod === 'card') {
    if (form.cardNumber.replace(/\s/g, '').length !== 16) {
      ElMessage.error('Введите корректный номер карты')
      return false
    }
    
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(form.expiryDate)) {
      ElMessage.error('Введите корректный срок действия карты')
      return false
    }
    
    if (form.cvv.length !== 3) {
      ElMessage.error('Введите корректный CVV код')
      return false
    }
  }
  return true
}

const submitForm = async () => {
  if (!validateForm()) return

  try {
    if (form.paymentMethod === 'card') {
      loading.value = true
      
      setTimeout(() => {
        loading.value = false
        ElMessage.error('Ошибка обработки платежа. Попробуйте позже или используйте другой способ оплаты.')
        dialogVisible.value = false // Закрываем окно
        // Очистка формы
        form.cardNumber = ''
        form.expiryDate = ''
        form.cvv = ''
      }, 5000)
      
      return
    }
    
    ElMessage.success('Оплата прошла успешно!')
    loading.value = false
    dialogVisible.value = false
    
    // Очистка формы
    form.cardNumber = ''
    form.expiryDate = ''
    form.cvv = ''
  } catch (error) {
    loading.value = false
    ElMessage.error('Произошла ошибка при обработке платежа')
  }
}

// Открытие модального окна
const openDialog = () => {
  dialogVisible.value = true
}

defineExpose({
  openDialog
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-dialog {
  position: relative;
  width: 400px;
  max-height: 85vh;
  margin: 0 auto;
  background: linear-gradient(145deg, #1a1f2e, #242936);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-container {
  padding: 24px;
}

.payment-header {
  text-align: center;
  margin-bottom: 24px;
}

.payment-title {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
}

.payment-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  margin: 0;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.crypto-message {
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
}

.wallet-icon {
  width: 24px;
  height: 24px;
  color: #fff;
}

.crypto-redirect-btn {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
  border-radius: 12px;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
  border: none;
}

.crypto-redirect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 211, 153, 0.3);
}

.payment-method-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
}

.payment-method-item.active {
  background: rgba(52, 211, 153, 0.1);
  border-color: rgba(52, 211, 153, 0.3);
}

.method-icon {
  width: 24px;
  height: 24px;
  color: #fff;
}

.method-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.method-title {
  color: #fff;
  font-size: 15px;
  font-weight: 500;
}

.method-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 12px;
}

label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.crypto-message {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-align: center;
}

.message-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
}

.lock-icon {
  width: 24px;
  height: 24px;
  color: #fff;
}

.payment-footer {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.cancel-btn,
.pay-btn {
  height: 48px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  flex: 1;
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.pay-btn {
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(52, 211, 153, 0.3);
}

@media (max-width: 480px) {
  .modal-dialog {
    width: 90%;
    max-height: 80vh;
  }

  .payment-container {
    padding: 20px;
  }

  .payment-title {
    font-size: 18px;
  }

  input {
    height: 40px;
    font-size: 14px;
  }

  .form-row {
    grid-template-columns: 1.5fr 1fr;
  }

  .cancel-btn,
  .pay-btn {
    height: 44px;
    font-size: 14px;
  }
}
</style>