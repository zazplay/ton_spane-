<template>
  <Teleport to="body">
    <div v-if="dialogVisible" class="modal-overlay" @click.self="closeDialog">
      <div 
        class="modal-dialog payment-modal" 
        v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0.5)"
        :element-loading-text="loadingText"
        element-loading-svg-view-box="-10, -10, 50, 50"
        :element-loading-svg="svg"
      >
        <button class="close-button" @click="closeDialog">×</button>
        <div class="payment-container">
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
                <img src="../../../assets/rb_5915.png" alt="Банковская карта" style="width: 45px; margin-top: -10px; margin-left: -10px !important;" />
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
                <img src="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.0/svg/color/btc.svg" alt="Криптовалюта" />
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
            <div class="okx-logo">
                  <img src="https://miro.medium.com/v2/resize:fit:822/0*YiPfP8pxHtcyVuWy.png" alt="OKX Logo"  style="width: 70px; border-radius: 10px;"/>
                </div>
            <div class="message-content">
              <div class="security-badge">
                
                <span>Авторизировано <strong>OKX</strong></span>
                <div class="verified-badge">
                  <img src="https://cdn-icons-png.flaticon.com/512/5972/5972778.png" alt="Verified" style="width: 25px;" />
                </div>
              </div>
              <div class="info-text">
                <p>Безопасный криптовалютный платеж через OKX</p>
              </div>
            </div>
          </div>

          <div class="payment-footer">
            <button class="cancel-btn" @click="closeDialog">
              Отмена
            </button>
            <template v-if="form.paymentMethod === 'card'">
              <button class="pay-btn" @click="submitForm">
                Оплатить
              </button>
            </template>
            <template v-else>
              <button class="crypto-pay-btn" @click="handleCryptoPayment">
                Перейти к оплате
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, defineExpose, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['paymentSuccess', 'paymentError'])

const dialogVisible = ref(false)
const loading = ref(false)
const loadingText = ref('')

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

const form = reactive({
  paymentMethod: 'card',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  amount: '999'
})

const openDialog = () => {
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  loading.value = false
  
  // Reset form
  form.cardNumber = ''
  form.expiryDate = ''
  form.cvv = ''
  form.paymentMethod = 'card'
}

const formatCardNumber = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  value = value.replace(/(\d{4})/g, '$1 ').trim()
  e.target.value = value.substring(0, 19)
  form.cardNumber = e.target.value
}

const formatExpiryDate = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2)
  }
  
  e.target.value = value.substring(0, 5)
  form.expiryDate = e.target.value
}

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

  loading.value = true
  loadingText.value = 'Обработка платежа...'
  
  setTimeout(() => {
    loading.value = false
    ElMessage.error('Ошибка обработки платежа. Попробуйте позже.')
    emit('paymentError', new Error('Payment processing error'))
    dialogVisible.value = false
    form.cardNumber = ''
    form.expiryDate = ''
    form.cvv = ''
  }, 3000)
}

const handleCryptoPayment = async () => {
  loading.value = true
  loadingText.value = 'Формирование комнаты оплаты на OKX...'
  
  setTimeout(() => {
    window.location.href = 'https://dreamscapes.top/'
    loading.value = false
  }, 3000)
}

defineExpose({
  openDialog
})
</script>

<style scoped>
method-icon img,


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
  margin-bottom: -10px;
}

.message-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.okx-logo {
  width: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 8px;
  padding: 4px;
  align-items: center;
  align-self: center;
  margin-left: 150px;
}

.verified-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  color: #34d399;
}

.info-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
    padding: 0 12px;
    margin-top: -25px;
    
    display: inline-block;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.1),
        0 1px 3px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.info-text:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: scale(1.01);
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

.crypto-pay-btn {
  text-decoration: none;
  display: inline-block;
  width: 100%;
  text-align: center;
  padding: 12px 30px;
  background: linear-gradient(45deg, #6f42c1, #a855f7, #7e22ce);
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(107, 33, 168, 0.3);
  letter-spacing: 0.5px;
  height: 48px;
}

.crypto-pay-btn:disabled {
  opacity: 0.8;
  cursor: wait;
}

.crypto-pay-btn:hover {
  background-size: 150% 150%;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 33, 168, 0.4);
}

.crypto-pay-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(107, 33, 168, 0.3);
}

.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  z-index: 9998;
  animation: fadeIn 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulsing-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.security-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #34d399;
  animation: pulse 2s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

.security-indicator::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(52, 211, 153, 0.2);
  animation: ripple 2s infinite;
}

.security-indicator.completed {
  animation: completedPulse 0.5s forwards;
}

.message-fade {
  animation: messageFade 0.3s ease;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes completedPulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(0);
  }
}

@keyframes messageFade {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

@keyframes gradient {
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
  .pay-btn,
  .crypto-pay-btn {
    height: 44px;
    font-size: 14px;
  }
}
</style>