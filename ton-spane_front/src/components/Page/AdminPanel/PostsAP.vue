<template>
    <div class="posts-container">
        <PostComponent 
            v-for="post in listPosts" 
            :key="post.id" :id="post.id" 
            :user="post.user"
            :imageUrl="post.imageUrl" 
            :caption="post.caption"
            :isBlurred="post.isBlurred" 
            :price="post.price"
            :createdAt="post.createdAt" />
    </div>
</template>

<script lang="js" setup>
import axios from 'axios';
import config from '@/config';
import { ref, onMounted } from 'vue';
import PostComponent from './PostComponent.vue';

// Реактивный список постов
const listPosts = ref([]);

// Асинхронная функция для получения постов
const getPosts = async () => {
    try {
        const response = await axios.get(`${config.API_BASE_URL}/posts`);
        listPosts.value = response.data; // Обновляем реактивную переменную
        console.log(response.data);
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
    }
};

// Получаем посты при монтировании компонента
onMounted(() => {
    getPosts();
});
</script>

<style scoped>
.posts-container {
    display: flex;
    flex-direction: column;
    justify-self: center;
    max-width: 100%;
}
</style>