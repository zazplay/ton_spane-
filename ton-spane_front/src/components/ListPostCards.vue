<script setup>
import PostCard from './PostCard.vue'
import { defineProps } from 'vue'

defineProps({
  posts: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>

<template>
  <div class="posts-container">
    <PostCard
  v-for="post in posts"
  :key="post.id"
  :id="post.id"
  :user="post.model"
  :imageUrl="post.imageUrl"
  :caption="post.caption"
  :isBlurred="post.isBlurred"
  :price="post.price"
  :createdAt="post.createdAt"
  :updatedAt="post.updatedAt"
  :comments="post.comments"
  :likes="post.likes"
  :isLikedByCurrentUser="post.isLikedByCurrentUser"
  :isSubscribed="post.isSubscribed"
/>
  </div>
</template>

<style scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  justify-self: center;
  max-width: 100%;
}
</style>