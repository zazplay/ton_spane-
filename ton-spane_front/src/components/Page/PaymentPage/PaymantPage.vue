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

          <div class="security-banners" v-else>
            <div class="security-banner">
              <el-icon class="banner-icon"><Lock /></el-icon>
              <div class="banner-text">
                <span>Безопасная оплата</span>
                <small>256-битное шифрование</small>
              </div>
            </div>
            
            <div class="security-banner">
              <el-icon class="banner-icon"><CircleCheck /></el-icon>
              <div class="banner-text">
                <span>Защита платежей</span>
                <small>Мониторинг 24/7</small>
              </div>
            </div>
            
            <div class="security-banner">
              <el-icon class="banner-icon"><Clock /></el-icon>
              <div class="banner-text">
                <span>Мгновенная обработка</span>
                <small>Автоматическое зачисление</small>
              </div>
            </div>
            
            <div class="security-banner">
              <el-icon class="banner-icon"><Service /></el-icon>
              <div class="banner-text">
                <span>Поддержка клиентов</span>
                <small>Круглосуточная помощь</small>
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
import { Lock, CircleCheck, Clock, Service } from '@element-plus/icons-vue'

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
  loadingText.value = 'Подготовка платежа...'
  
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
  max-height: 90vh;
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

.security-banners {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 20px 0;
}

.security-banner {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.banner-icon {
  font-size: 24px;
  color: #34d399;
}

.banner-text {
  display: flex;
  flex-direction: column;
}

.banner-text span {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.banner-text small {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
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

  .security-banners {
    grid-template-columns: 1fr;
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