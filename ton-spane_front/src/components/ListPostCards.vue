<script setup>
// Импортируем вашу карточку
import PostCard from './PostCard.vue'

// Фиксированный набор данных для карточек
const posts = [
  {
    username: 'vikpix',
    avatarUrl: 'https://bannerplus.ru/files/img/pics/devushka-krasivye-kartinki/devushka-krasivye-kartinki-56.webp',
    imageUrl: 'https://www.ifoto.ai/blog/wp-content/uploads/ai-swimsuit-models.jpg',
    postDesc: 'Проснулась сегодня с таким хорошим настроением 😉',
    initialLiked: false,
    initialShared: false,
    initialDonated: false,
    isBlurred: false,
    initialSubscribed:true
  },
  {
    username: 'anna_photo',
    avatarUrl: 'https://bannerplus.ru/files/img/pics/devushka-krasivye-kartinki/devushka-krasivye-kartinki-57.webp',
    imageUrl: 'https://cdn.pixabay.com/photo/2023/12/13/06/27/ai-generated-8446378_1280.png',
    postDesc: 'Чудесный день для новых открытий! 🌟',
    initialLiked: false,
    initialShared: false,
    initialDonated: false,
    isBlurred: true
  },
  {
    username: 'maria_art',
    avatarUrl: 'https://bannerplus.ru/files/img/pics/devushka-krasivye-kartinki/devushka-krasivye-kartinki-58.webp',
    imageUrl: 'https://cdn.pixabay.com/photo/2023/05/09/16/30/ai-generated-7981935_1280.jpg',
    postDesc: 'Делюсь моментами радости с вами ❤️',
    initialLiked: false,
    initialShared: false,
    initialDonated: false,
    isBlurred: false,
    initialSubscribed:true

  },

  {
    username: 'anastasiya_hot',
    avatarUrl: 'https://focus.ua/static/storage/thumbs/920x465/2/19/69ab9b9f-41b9ca57261cb2dc97ea7ca6a4fc5192.jpg?v=8030_1',
    imageUrl: 'https://focus.ua/static/storage/originals/0/20/1590c243b1c9eaf16b19c113b8750200.jpg',
    postDesc: 'Мечты становятся реальностью 🌟',
    initialLiked: false,
    initialShared: false,
    initialDonated: false,
    isBlurred: true
  }
]
</script>

<template>
  <div class="posts-container">
    <PostCard
      v-for="(post, index) in posts"
      :key="index"
      v-bind="post"
    />
  </div>
</template>

<style scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  justify-self: center;
  /* gap: 20px; */
  max-width: 600px;
  /* margin: 0 auto; */
  /* padding: 20px; */
}
</style>