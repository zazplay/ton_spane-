<template>
    <el-dialog
      v-model="dialogVisible"
      title="Оплата"
      width="500px"
      :modal-append-to-body="true"
      :z-index="9999"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="paymentForm">
        <!-- Выбор метода оплаты -->
        <el-form-item prop="paymentMethod">
          <el-radio-group v-model="form.paymentMethod">
            <el-radio label="card">Банковская карта</el-radio>
            <el-radio label="crypto">Криптовалюта</el-radio>
          </el-radio-group>
        </el-form-item>
  
        <!-- Форма для оплаты картой -->
        <template v-if="form.paymentMethod === 'card'">
          <el-form-item 
            label="Номер карты" 
            prop="cardNumber"
          >
            <el-input
              v-model="form.cardNumber"
              :maxlength="19"
              @input="formatCardNumber"
              placeholder="XXXX XXXX XXXX XXXX"
            />
          </el-form-item>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item 
                label="Срок действия" 
                prop="expiryDate"
              >
                <el-input
                  v-model="form.expiryDate"
                  placeholder="ММ/ГГ"
                  :maxlength="5"
                  @input="formatExpiryDate"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item 
                label="CVV" 
                prop="cvv"
              >
                <el-input
                  v-model="form.cvv"
                  type="password"
                  :maxlength="3"
                  show-password
                  placeholder="XXX"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
  
        <!-- Заглушка для криптоплатежей -->
        <template v-else>
          <el-alert
            title="Оплата криптовалютой"
            type="info"
            description="Функционал оплаты криптовалютой находится в разработке"
            :closable="false"
            show-icon
          />
        </template>
      </el-form>
  
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Отмена</el-button>
          <el-button type="primary" @click="submitForm">Оплатить</el-button>
        </span>
      </template>
    </el-dialog>
</template>
  
<script setup>
import { ref, reactive, defineExpose } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const paymentForm = ref(null)

const form = reactive({
  paymentMethod: 'card',
  cardNumber: '',
  expiryDate: '',
  cvv: ''
})

const rules = {
  cardNumber: [
    { required: true, message: 'Введите номер карты', trigger: 'blur' },
    { min: 19, message: 'Неверный формат номера карты', trigger: 'blur' }
  ],
  expiryDate: [
    { required: true, message: 'Введите срок действия карты', trigger: 'blur' },
    { pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, message: 'Неверный формат даты', trigger: 'blur' }
  ],
  cvv: [
    { required: true, message: 'Введите CVV код', trigger: 'blur' },
    { min: 3, message: 'CVV должен содержать 3 цифры', trigger: 'blur' }
  ]
}

// Форматирование номера карты
const formatCardNumber = (value) => {
  if (!value) return ''
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  if (parts.length) {
    form.cardNumber = parts.join(' ')
  }
}

// Форматирование даты
const formatExpiryDate = (value) => {
  if (!value) return ''
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 2) {
    form.expiryDate = v.slice(0, 2) + '/' + v.slice(2)
  }
}

const submitForm = async () => {
  if (!paymentForm.value) return

  try {
    await paymentForm.value.validate()
    
    if (form.paymentMethod === 'card') {
      // Всегда показываем ошибку при оплате картой
      ElMessage.error('Ошибка обработки платежа. Пожалуйста, попробуйте позже или используйте другой способ оплаты.')
      return
    }
    
    ElMessage.success('Форма успешно отправлена')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('Пожалуйста, проверьте введенные данные')
  }
}

const handleClose = (done) => {
  done()
}

// Метод для открытия модального окна извне
const openDialog = () => {
  dialogVisible.value = true
}

defineExpose({
  openDialog
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>