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
      :user="post.user"
      :imageUrl="post.imageUrl"
      :caption="post.caption"
      :isBlurred="post.isBlurred"
      :price="post.price"
      :createdAt="post.createdAt"
      :initialLiked="post.liked"
      :initialShared="post.shared"
      :initialDonated="post.donated"
      :initialSubscribed="post.subscribed"
    />
  </div>
</template>

<style scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  justify-self: center;
  max-width: 600px;
}
</style>