
<script setup>
/* eslint-disable */ 
import PostCard from './PostCard.vue'
import { defineProps, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  posts: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Watch for subscription changes and update posts accordingly
watch(
  () => store.getters.getSubscriptions,
  async (newSubscriptions) => {
    // Only trigger posts refresh if subscriptions actually changed
    if (newSubscriptions.length > 0) {
      await store.dispatch('refreshPosts')
    }
  }
)
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
      @subscribe="handleSubscription"
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