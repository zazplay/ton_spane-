<template>
    <div class="payment-container p-4" style="width: 100%;">
        <el-card class="mb-4">
            <template #header>
                <div class="flex justify-between items-center">
                    <span class="text-base">Фильтры</span>
                    <el-button :icon="RefreshRight" circle @click="fetchPayments" />
                </div>
            </template>

            <el-form :model="filterState" :inline="true" class="flex flex-wrap items-start gap-4">
                <el-form-item label="Статус:">
                    <el-select 
                        v-model="filterState.status" 
                        style="width: 140px; margin-right: 30px;" 
                        placeholder="Все" 
                        clearable 
                        @change="fetchPayments"
                    >
                        <el-option label="Все" value="" />
                        <el-option label="Инициирован" value="initiated" />
                        <el-option label="Завершен" value="completed" />
                    </el-select>
                </el-form-item>

                <el-form-item label="ID:">
                    <el-input
                        v-model="filterState.userId"
                        style="width: 200px; margin-right: 20px;"
                        placeholder="ID пользователя"
                        clearable
                        @input="debouncedFetch"
                    >
                        <template #prefix>
                            <el-icon><User /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item label="Период:">
                    <el-date-picker
                        v-model="filterState.dateRange"
                        type="daterange"
                        style="width: 260px;"
                        :shortcuts="shortcuts"
                        start-placeholder="Начало"
                        end-placeholder="Конец"
                        value-format="YYYY-MM-DD"
                        @change="fetchPayments"
                    />
                </el-form-item>
            </el-form>
        </el-card>

        <!-- Table Section -->
        <el-card v-loading="loading" element-loading-text="Загрузка платежей...">
            <template #header>
                <span class="text-base">Список платежей</span>
            </template>

            <!-- Empty State -->
            <el-empty v-if="!loading && !payments.length" description="Платежи не найдены" />

            <!-- Data Table -->
            <el-table
                v-else
                :data="payments"
                border
                stripe
                style="width: 100%"
                row-key="id"
                class="payment-table"
            >
                <el-table-column 
                    prop="id" 
                    label="ID" 
                    min-width="280"
                    fixed="left"
                    show-overflow-tooltip
                />
                <el-table-column 
                    prop="user.email" 
                    label="Email" 
                    min-width="200" 
                    show-overflow-tooltip 
                />
                <el-table-column 
                    prop="user.username" 
                    label="Username" 
                    min-width="200" 
                    show-overflow-tooltip 
                />
                <el-table-column 
                    prop="ipAddress" 
                    label="IP адрес" 
                    min-width="140" 
                />
                <el-table-column 
                    prop="status" 
                    label="Статус" 
                    min-width="120" 
                    align="center"
                >
                    <template #default="{ row }">
                        <el-tag 
                            :type="row.status === 'completed' ? 'success' : 'warning'"
                            class="w-24"
                        >
                            {{ row.status === 'completed' ? 'Завершен' : 'Инициирован' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="createdAt" 
                    label="Дата создания" 
                    min-width="180"
                    sortable
                >
                    <template #default="{ row }">
                        {{ formatDate(row.createdAt) }}
                    </template>
                </el-table-column>
                <el-table-column 
                    label="Действия" 
                    width="90" 
                    fixed="right"
                    align="center"
                >
                    <template #default="{ row }">
                        <el-popconfirm
                            title="Удалить платеж?"
                            @confirm="handleDelete(row.id)"
                        >
                            <template #reference>
                                <el-button 
                                    type="danger" 
                                    :icon="Delete" 
                                    circle 
                                    size="small"
                                />
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RefreshRight, Delete, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'

const API_URL = 'https://ton-back-e015fa79eb60.herokuapp.com/api'

// State
const loading = ref(false)
const payments = ref([])
const filterState = ref({
    status: '',
    userId: '',
    dateRange: null
})

// Shortcuts for date picker
const shortcuts = [
    {
        text: 'Неделя',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        }
    },
    {
        text: 'Месяц',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            return [start, end]
        }
    }
]

// Methods
const fetchPayments = async () => {
    loading.value = true
    try {
        const params = new URLSearchParams()
        if (filterState.value.status) {
            params.append('status', filterState.value.status)
        }
        if (filterState.value.userId) {
            params.append('userId', filterState.value.userId)
        }
        if (filterState.value.dateRange) {
            params.append('startDate', filterState.value.dateRange[0])
            params.append('endDate', filterState.value.dateRange[1])
        }
        
        const url = `${API_URL}/Payments${params.toString() ? `?${params}` : ''}`
        const res = await fetch(url)
        
        if (!res.ok) throw new Error('Ошибка при загрузке платежей')
        payments.value = await res.json()
    } catch (error) {
        ElMessage.error(error.message)
        payments.value = []
    } finally {
        loading.value = false
    }
}

const handleDelete = async (id) => {
    try {
        const res = await fetch(`${API_URL}/Payments/${id}`, { 
            method: 'DELETE'
        })
        
        if (!res.ok) throw new Error('Ошибка при удалении платежа')
        
        ElMessage.success('Платеж успешно удален')
        fetchPayments()
    } catch (error) {
        ElMessage.error(error.message)
    }
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const debouncedFetch = useDebounceFn(fetchPayments, 300)

// Initial load
fetchPayments()
</script>

<style scoped>
.payment-container {
    min-width: 1000px;
}

.payment-table :deep(.el-table__body-wrapper) {
    overflow-x: auto;
}

.payment-table :deep(.el-table__fixed-right) {
    height: 100% !important;
}

:deep(.el-card__header) {
    padding: 10px 15px;
    background-color: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);
}

/* Compact form styles */
:deep(.el-form--inline) {
    gap: 16px;
}

:deep(.el-form--inline .el-form-item) {
    margin: 0;
}

:deep(.el-form-item__label) {
    font-weight: normal;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper),
:deep(.el-date-editor.el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-border-color) inset;
}
</style>