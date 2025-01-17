<script setup>
/* eslint-disable */
import PostCard from './PostCard.vue'
import { defineProps, watch, ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const currentPage = ref(1)
const pageSize = 15

const props = defineProps({
  posts: {
    type: Array,
    required: true,
    default: () => []
  }
})

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize
  const endIndex = startIndex + pageSize
  return props.posts.slice(startIndex, endIndex)
})

const totalPages = computed(() => Math.ceil(props.posts.length / pageSize))

const handlePageChange = (page) => {
  currentPage.value = page
  // Прокрутка вверх при смене страницы
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Сброс на первую страницу при изменении списка постов
watch(() => props.posts, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="posts-container">
    <PostCard
      v-for="post in paginatedPosts"
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
      :likesCount="post.likesCount"
      :isLikedByCurrentUser="post.isLikedByCurrentUser"
      :isSubscribed="post.isSubscribed"
    />
    
    <!-- Пагинация -->
    <div class="pagination-container" v-if="totalPages > 1">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="props.posts.length"
        :pager-count="5"
        class="pagination"
        background
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  justify-self: center;
  max-width: 100%;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  padding: 20px 0;
}

.pagination {
  --el-pagination-hover-color: #a855f7;
  --el-pagination-button-color: #ffffff;
  --el-pagination-button-bg-color: #1a1f2e;
  --el-pagination-button-disabled-color: #606266;
  --el-pagination-button-disabled-bg-color: #1a1f2e;
  --el-pagination-hover-bg-color: #2d3748;
}

.pagination :deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #a855f7;
}

.pagination :deep(.el-pagination.is-background .el-pager li:not(.is-disabled):hover) {
  color: #a855f7;
}

/* Адаптивная верстка */
@media (max-width: 480px) {
  .pagination-container {
    margin: 10px 0;
    padding: 10px 0;
  }
  
  .pagination {
    font-size: 14px;
  }
}

/* Темная тема */
html.dark {
  .pagination {
    --el-pagination-button-bg-color: #1a1f2e;
    --el-pagination-hover-bg-color: #2d3748;
  }
}

/* Светлая тема */
html:not(.dark) {
  .pagination {
    --el-pagination-button-bg-color: #ffffff;
    --el-pagination-button-color: #1a1f2e;
    --el-pagination-hover-bg-color: #f3f4f6;
  }
}
</style>