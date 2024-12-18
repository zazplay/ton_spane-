<template>
  <Teleport to="body">
    <div 
      v-if="isVisible" 
      class="modal-overlay"
      @click="closeModal"
    >
      <div 
        class="modal-container"
        @click.stop
      >
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button 
            class="close-btn" 
            @click="closeModal"
            aria-label="Закрыть"
          >
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="amounts-section">
            <label class="section-label" for="amounts-grid">Сумма</label>
            <div 
              id="amounts-grid" 
              class="amounts-grid"
              role="radiogroup"
              aria-label="Выберите сумму"
            >
              <button
                v-for="value in amounts"
                :key="value"
                class="amount-btn"
                :class="{ active: sum === value }"
                @click="handleAmountSelect(value)"
                :aria-pressed="sum === value"
                type="button"
              >
                {{ value }} USD
              </button>
            </div>
          </div>

          <div class="message-section">
            <label class="section-label" for="message-input">Ваше сообщение</label>
            <textarea
              id="message-input"
              v-model="form.message"
              class="message-input"
              placeholder="Напишите что-нибудь приятное..."
              rows="3"
              maxlength="500"
              @input="handleMessageInput"
            ></textarea>
          </div>

          <button 
            class="submit-btn" 
            @click="handleSubmit"
            :disabled="!isFormValid"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  <PaymentModal 
    ref="paymentModalRef" 
    @payment-success="handlePaymentSuccess"
    @payment-error="handlePaymentError"
  />
</template>

<script setup>
import { ref, reactive, computed, watch, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PaymentModal from './Page/PaymentPage/PaymantPage.vue'
const props = defineProps({
  dialogDonateVisible: { type: Boolean, required: true },
  initialSum: { type: String, default: '5' },
  title: { type: String, default: 'Чаевые 💰' }
})

const emit = defineEmits(['update:dialogDonateVisible', 'sumChange', 'messageChange', 'submit'])

const paymentModalRef = ref(null)
const amounts = ['5', '10', '20', '50']
const form = reactive({ message: '' })
const sum = ref(props.initialSum)

const isVisible = computed({
  get: () => props.dialogDonateVisible,
  set: (value) => emit('update:dialogDonateVisible', value)
})

const isFormValid = computed(() => {
  return sum.value && sum.value.length > 0
})

watch(() => isVisible.value, (newValue) => {
  if (newValue) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

onBeforeUnmount(() => {
  document.body.classList.remove('modal-open')
})

const closeModal = () => {
  isVisible.value = false
}

const handleAmountSelect = (value) => {
  sum.value = value
  emit('sumChange', value)
}

const handleMessageInput = (event) => {
  form.message = event.target.value
  emit('messageChange', event.target.value)
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  paymentModalRef.value?.openDialog()
  emit('submit', {
    amount: sum.value,
    message: form.message
  })
}

const handlePaymentSuccess = () => {
  ElMessage.success('Платеж успешно выполнен!')
  closeModal()
}

const handlePaymentError = () => {
  ElMessage.error('Произошла ошибка при оплате')
}
</script>

<style scoped>
.modal-overlay {
 position: fixed;
 inset: 0;
 background: rgba(0, 0, 0, 0.7);
 backdrop-filter: blur(8px);
 display: flex;
 align-items: center;
 justify-content: center;
 z-index: 9999;
}

.modal-container {
 position: fixed;
 left: 50vw;
 top: 50vh;
 transform: translate(-50%, -50%);
 background: linear-gradient(145deg, #2d3748, #1a202c);
 border-radius: 24px;
 width: 90%;
 max-width: 440px;
 box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7),
             0 0 0 1px rgba(255, 255, 255, 0.1);
 animation: modalAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
 font-family: system-ui, -apple-system, sans-serif;
}

.modal-header {
 display: flex;
 align-items: center;
 justify-content: space-between;
 padding: 20px 24px;
 border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
 margin: 0;
 font-size: 20px;
 font-weight: 600;
 color: #fff;
 letter-spacing: -0.5px;
}

.close-btn {
 background: rgba(255, 255, 255, 0.1);
 border: none;
 padding: 10px;
 cursor: pointer;
 color: rgba(255, 255, 255, 0.8);
 border-radius: 12px;
 transition: all 0.2s;
}

.close-btn:hover {
 background: rgba(255, 255, 255, 0.15);
 transform: scale(1.05);
}

.modal-body {
 padding: 24px;
 display: flex;
 flex-direction: column;
 gap: 28px;
}

.section-label {
 display: block;
 font-size: 15px;
 font-weight: 500;
 color: rgba(255, 255, 255, 0.9);
 margin-bottom: 14px;
}

.amounts-grid {
 display: grid;
 grid-template-columns: repeat(4, 1fr);
 gap: 12px;
}

.amount-btn {
 padding: 14px;
 border: 2px solid rgba(255, 255, 255, 0.1);
 background: rgba(255, 255, 255, 0.07);
 border-radius: 14px;
 cursor: pointer;
 transition: all 0.2s;
 color: rgba(255, 255, 255, 0.9);
 font-weight: 600;
}

.amount-btn:hover {
 border-color: rgba(99, 102, 241, 0.5);
 color: #6366f1;
 transform: translateY(-2px);
}

.amount-btn.active {
 background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
 border-color: transparent;
 color: white;
 box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.message-input {
 width: 90%;
 padding: 16px;
 border: 2px solid rgba(255, 255, 255, 0.1);
 border-radius: 14px;
 background: rgba(255, 255, 255, 0.07);
 color: #fff;
 font-size: 15px;
 line-height: 1.6;
 resize: vertical;
 min-height: 120px;
 transition: all 0.2s;
}

.message-input:focus {
 outline: none;
 border-color: rgba(99, 102, 241, 0.5);
 background: rgba(255, 255, 255, 0.09);
}

.message-input::placeholder {
 color: rgba(255, 255, 255, 0.4);
}

.submit-btn {
 background: linear-gradient(135deg, #10B981 0%, #059669 100%);
 color: white;
 border: none;
 border-radius: 14px;
 padding: 14px 28px;
 font-size: 16px;
 font-weight: 600;
 cursor: pointer;
 transition: all 0.2s;
 box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.submit-btn:hover {
 transform: translateY(-2px);
 box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

@keyframes modalAppear {
 from {
   opacity: 0;
   transform: translate(-50%, -45%);
 }
 to {
   opacity: 1;
   transform: translate(-50%, -50%);
 }
}

:deep(body.modal-open) {
 overflow: hidden;
}

@media (max-width: 480px) {
 .modal-container {
   width: 85%;
 }

 .modal-header {
   padding: 16px 20px;
 }

 .modal-header h3 {
   font-size: 18px;
 }

 .modal-body {
   padding: 20px;
   gap: 24px;
 }

 .amounts-grid {
   grid-template-columns: repeat(2, 1fr);
   gap: 10px;
 }

 .amount-btn {
   padding: 12px;
   font-size: 14px;
 }

 .message-input {
   font-size: 14px;
   padding: 12px;
   min-height: 100px;
 }

 .section-label {
   font-size: 14px;
   margin-bottom: 12px;
 }

 .submit-btn {
   font-size: 15px;
   padding: 12px 24px;
 }
}
</style>