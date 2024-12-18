<template>
    <div class="container">
        <div class="left">
            <ProfilesList @select-user="handleUserSelect" />
        </div>
        <div class="right">
            <div v-if="selectedUser">
                <!-- Add create post button here -->
                
                <ProfileContent :userIdProp="selectedUser" />
            </div>
            <div v-else class="empty-state-container">
                <el-empty
                    :image-size="200"
                    description="Выберите пользователя чтобы просмотреть его профиль"
                >
                    <template #image>
                        <el-icon :size="64" class="empty-state-icon">
                            <UserFilled />
                        </el-icon>
                    </template>
                    <template #extra>
                        <el-button type="primary" @click="$emit('show-users-list')">
                            Показать список пользователей
                        </el-button>
                    </template>
                </el-empty>
            </div>
        </div>

        
        
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ProfilesList from './Models/ProfilesList.vue';
import ProfileContent from './Models/ProfileContent.vue';

const selectedUser = ref(null);

const handleUserSelect = (userId) => {
    selectedUser.value = userId;
    console.log("selectedUser", selectedUser.value);
};
</script>

<style scoped>
.container {
    display: flex;
    width: 100%;
}

.left {
    width: 40%;
}

.right {
    width: 60%;
    background-color: rgb(27, 26, 26);
}

.create-post-button {
    padding: 20px;
    display: flex;
    justify-content: flex-end;
}

.add-post-btn {
    margin-bottom: 15px;
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
    }
    
    .create-post-button {
        padding: 10px;
    }
}
</style>