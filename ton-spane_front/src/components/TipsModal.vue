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
          <button class="close-btn" @click="closeModal">
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="amounts-section">
            <label class="section-label">Сумма</label>
            <div class="amounts-grid">
              <button
                v-for="value in amounts"
                :key="value"
                class="amount-btn"
                :class="{ active: sum === value }"
                @click="handleAmountSelect(value)"
              >
                {{ value }} USD
              </button>
            </div>
          </div>

          <div class="message-section">
            <label class="section-label">Ваше сообщение</label>
            <textarea
              v-model="form.message"
              class="message-input"
              placeholder="Напишите что-нибудь приятное..."
              rows="3"
              @input="(e) => handleMessageInput(e.target.value)"
            ></textarea>
          </div>

          <button class="submit-btn" @click="handleSubmit">
            Отправить
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, onBeforeUnmount,defineProps,defineEmits } from 'vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  dialogDonateVisible: { type: Boolean, required: true },
  initialSum: { type: String, default: '5' },
  title: { type: String, default: 'Чаевые 💰' }
})

const emit = defineEmits(['update:dialogDonateVisible', 'sumChange', 'messageChange', 'submit'])

const amounts = ['5', '10', '20', '50']
const form = reactive({ message: '' })
const sum = ref(props.initialSum)

const isVisible = computed({
  get: () => props.dialogDonateVisible,
  set: (value) => emit('update:dialogDonateVisible', value)
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

const handleMessageInput = (value) => {
  emit('messageChange', value)
}

const handleSubmit = () => {
  emit('submit', {
    amount: sum.value,
    message: form.message
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
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
  background: var(--el-bg-color);
  border-radius: 16px;
  width: 90%;
  max-width: 440px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  animation: modalAppear 0.2s ease-out;
  font-family: Arial, Helvetica, sans-serif;

}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.close-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--el-fill-color-light);
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  margin-bottom: 12px;
}

.amounts-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.amount-btn {
  padding: 12px;
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.amount-btn:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.amount-btn.active {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: white;
}

.message-input {
  width: 90%;
  padding: 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background: var(--el-bg-color-overlay);
  color: var(--el-text-color-primary);
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;
}

.message-input:focus {
  outline: none;
  border-color: var(--el-color-primary);
}

.submit-btn {
  background: var(--el-color-success);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
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
    padding: 12px 16px;
  }

  .modal-header h3 {
    font-size: 16px;
  }

  .modal-body {
    padding: 16px;
    gap: 20px;
  }

  .amounts-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .amount-btn {
    padding: 10px;
    font-size: 14px;
  }

  .message-input {
    font-size: 13px;
    padding: 10px;
    min-height: 80px;
  }

  .section-label {
    font-size: 13px;
    margin-bottom: 10px;
  }

  .submit-btn {
    font-size: 14px;
    padding: 10px 20px;
  }
}
</style>