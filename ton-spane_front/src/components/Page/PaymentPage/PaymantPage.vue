<template>
    <el-dialog
      v-model="dialogVisible"
      title="Оплата"
      width="100%"
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
                  style="width: fit-content;"
                  
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item 
                label="CVV" 
                prop="cvv"
                style="margin-left: 10px;"
              >
                <el-input
                  v-model="form.cvv"
                  type="password"
                  :maxlength="3"
                  show-password
                  placeholder="XXX"
                  style="width: 100px; margin-left: 10px !important;"

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
:deep(.el-dialog) {
  max-width: 100%;
  width: 95% !important;
  margin: 20px auto;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Адаптивные стили для мобильных устройств */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 10px auto;
  }

  :deep(.el-dialog__header) {
    padding: 15px;
  }

  :deep(.el-dialog__body) {
    padding: 15px;
  }

  :deep(.el-dialog__footer) {
    padding: 15px;
  }

  /* Стили для кнопок */
  :deep(.el-button) {
    height: 40px;
    font-size: 14px;
    padding: 10px 15px;
    margin-left: 0px !important;
  }

  /* Стили для меток формы */
  :deep(.el-form-item__label) {
    font-size: 16px;
    margin-top: 8px;
    margin-bottom: 0px;
    line-height: 1.1;
    margin-right: 0px !important;
    margin-left: 0px !important;
    padding: 0;

  }

  /* Стили для полей ввода */
  :deep(.el-input__wrapper) {
    height: 40px;
    width: 50px;
    margin-right: 10px !important;
  }

  :deep(.el-input__inner) {
    font-size: 14px;
  }

  /* Стили для радио-кнопок */
  :deep(.el-radio) {
    margin-bottom: 10px;
    font-size: 14px;
  }

  :deep(.el-radio__label) {
    font-size: 14px;
  }

  /* Стили для футера с кнопками */
  .dialog-footer {
    flex-direction: column;
    gap: 10px;
  }

  :deep(.dialog-footer .el-button) {
    width: 100%;
    margin: 0px !important;
  }

  /* Стили для алерта */
  :deep(.el-alert) {
    font-size: 14px;
  }

  :deep(.el-alert__title) {
    font-size: 14px;
  }

  :deep(.el-alert__description) {
    font-size: 13px;
    margin: 5px 0 0;
  }
}

/* Дополнительные стили для очень маленьких экранов */
@media (max-width: 320px) {
  :deep(.el-dialog__body) {
    padding: 10px;
  }

  :deep(.el-form-item) {
    margin-bottom: 15px;
  }

  :deep(.el-form-item__label) {
    font-size: 13px;
  }

  :deep(.el-input__inner) {
    font-size: 13px;
  }
}
</style>