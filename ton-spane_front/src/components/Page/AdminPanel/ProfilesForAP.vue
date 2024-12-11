<template>
    <div class="container">
        <div class="left">
            <ProfilesList @select-user="handleUserSelect" />
        </div>
        <div class="right">
            <div>right block</div>
            <div v-if="selectedUser">
                <!-- Передаем selectedUser как userIdProp -->
                <ProfileContent :userIdProp="selectedUser" />
            </div>
            <div v-else>
                <p>Виберіть користувача, щоб переглянути його профіль</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ProfilesList from './ProfilesList.vue';
import ProfileContent from './ProfileContent.vue'; // Убедитесь, что этот импорт не закомментирован

const selectedUser = ref(null); // Начальное значение null для selectedUser

const handleUserSelect = (userId) => {
    selectedUser.value = userId; // Обновляем данные о выбранном пользователе
    console.log("selectedUser", selectedUser.value);
};
</script>

<style scoped>
.container {
    display: flex;
    /* Використовуємо Flexbox */
    width: 100%;
    /* Контейнер займає всю ширину */
}

.left {
    width: 40%;
}

.right {
    width: 60%;
    /* Права частина займає 60% */
    background-color: lightblue;
    /* Трохи для візуалізації */
}
</style>