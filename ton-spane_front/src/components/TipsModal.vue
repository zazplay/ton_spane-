<script setup>
import { ref, reactive, computed, defineProps, defineEmits } from 'vue'

// Входные параметры
const props = defineProps({
  dialogDonateVisible: { type: Boolean, required: true },
  initialSum: { type: String, default: '5' },
  title: { type: String, default: 'Чаевые 💰' }
})

// События
const emit = defineEmits(['update:dialogDonateVisible', 'sumChange', 'messageChange'])

// Состояния
const amounts = ['5', '10', '20', '50']
const form = reactive({ message: '' })
const sum = ref(props.initialSum)

// Вычисляемое свойство для v-model диалога
const isVisible = computed({
  get: () => props.dialogDonateVisible,
  set: (value) => emit('update:dialogDonateVisible', value)
})

// Обработчики событий
const handleSumChange = (value) => emit('sumChange', value)
const handleMessageInput = (value) => emit('messageChange', value)
</script>

<template>
  <el-dialog
    v-model="isVisible"
    :title="title"
    width="500px"
    :show-close="true"
    :lock-scroll="false"
  >
    <div class="donation-form">
      <Transition
        enter-active-class="animate__animated animate__fadeIn"
        appear
      >
        <el-form
          label-position="right"
          label-width="auto"
          :model="form"
        >
          <!-- Выбор суммы -->
          <el-form-item label="Сумма">
            <el-radio-group 
              v-model="sum" 
              @change="handleSumChange"
            >
              <el-radio-button
                v-for="value in amounts"
                :key="value"
                :value="value"
              >
                {{ value }} USD
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <!-- Поле сообщения -->
          <el-form-item label="Ваше сообщение">
  <el-input
    v-model="form.message"
    type="textarea"
    :rows="5"
    @input="handleMessageInput"
  />
</el-form-item>
          <el-button type="success" plain>Отправить</el-button>
        </el-form>
      </Transition>
    </div>
  </el-dialog>
</template>

<style scoped>
.donation-form {
  padding: 10px 0;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  text-align: center;
  margin-right: 0;
  padding: 15px;
}

.animate__animated {
  animation-duration: 0.5s;
}
</style>