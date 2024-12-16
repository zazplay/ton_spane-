<template>
    <div class="container">
        <div class="left">
            <ProfilesList @select-user="handleUserSelect" />
        </div>
        <div class="right">
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
import ProfileContent from './ProfileContent.vue'; 

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
    background-color: rgb(27, 26, 26);
    /* Трохи для візуалізації */
}

@media (max-width: 1200px) {

    .container {
        flex-direction: column;

    }

    .left {
        width: 100%;
        height: max-content;
    }

    .right {
        margin-top: 10px;
        width: 100%;
        /* Права частина займає 60% */
    }
}
</style>