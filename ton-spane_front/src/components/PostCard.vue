<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import ShareModal from './ShareModal.vue' 
import TipsModal from './TipsModal.vue'
import { Picture as PictureFailed } from '@element-plus/icons-vue'


// Определение входных параметров компонента
const props = defineProps({
  username: { type: String, default: 'vikpix' },
  avatarUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  postDesc: { type: String, default: '' },
  isBlurred: { type: Boolean, default: false },
  // Начальные состояния интерактивных элементов
  initialLiked: { type: Boolean, default: false },
  initialShared: { type: Boolean, default: false },
  initialDonated: { type: Boolean, default: false },
  initialSubscribed: { type: Boolean, default: false }
})


// Определение событий компонента
const emit = defineEmits(['like', 'share', 'donate', 'subscribe'])

// Реактивные состояния
const isLiked = ref(props.initialLiked)
const isSubscribed = ref(props.initialSubscribed)
const isShared = ref(props.initialShared)
const isDonated = ref(props.initialDonated)

// Состояния модальных окон
const isShareModalVisible = ref(false)
const isTipsModalVisible = ref(false)

// Обработчики событий
const handleLike = () => {
  isLiked.value = !isLiked.value
  emit('like', isLiked.value)
}

const handleSubscribe = () => {
  isSubscribed.value = !isSubscribed.value
  emit('subscribe', isSubscribed.value)
}

const handleShare = () => {
  isShared.value = !isShared.value
  isShareModalVisible.value = true
  emit('share', isShared.value)
}

const handleDonate = () => {
  isDonated.value = !isDonated.value
  isTipsModalVisible.value = true
  emit('donate', isDonated.value)
}
</script>

<template>
  <!-- Модальные окна -->
  <ShareModal v-model:dialogVisible="isShareModalVisible" />
  <TipsModal v-model:dialogDonateVisible="isTipsModalVisible" />

  <!-- Карточка поста -->
  <el-card class="post-card">
    <!-- Шапка с информацией о пользователе -->
    <div class="header">
      <el-avatar :size="50" :src="avatarUrl" />
      <el-text class="username">{{ username }}</el-text>
      <el-button 
        :type="isSubscribed ? 'success' : 'primary'" 
        @click="handleSubscribe"
        plain
      >
        {{ isSubscribed ? 'Вы подписаны' : 'Подписаться' }}
      </el-button>
    </div>

    <!-- Изображение поста -->
    <!-- <img
      :src="imageUrl"
      class="post-image"
      :class="{ 'blurred': isBlurred }"
    /> -->

    <div class="demo-image__preview">
  <el-image
    class="post-image"
    :class="{ 'blurred': isBlurred }"
    :src="imageUrl"
    :zoom-rate="1.2"
    :max-scale="7"
    :min-scale="0.2"
    :preview-src-list="isBlurred ? [] : [imageUrl]"
    :initial-index="4"
    fit="cover"
    @error="() => {}"
    :preview-teleported="true"
  >
    <template #error>
      <div class="image-slot">
        <el-icon><Picture-Failed /></el-icon>
      </div>
    </template>
  </el-image>
</div>

    <!-- Панель действий -->
    <div class="actions">
      <el-check-tag 
        :checked="isLiked"
        @change="handleLike"
        class="action-tag heart"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
          :fill="isLiked ? 'red' : 'none'"
          stroke="red"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </el-check-tag>
      
      <el-check-tag 
        :checked="isShared"
        @change="handleShare"
        class="action-tag share"
      >
        <el-icon size="25px"><Share /></el-icon>
      </el-check-tag>

      <el-check-tag 
        :checked="isDonated"
        @change="handleDonate"
        class="action-tag donate"
      >
        <el-icon size="25px"><Money /></el-icon>
      </el-check-tag>

      <!-- Описание поста -->
      <el-text class="description" tag="b" emphasis>
        {{ postDesc.length > 100 ? postDesc.slice(0, 100) + '...' : postDesc }}
      </el-text>
    </div>
  </el-card>
</template>

<style scoped>
.post-card {
  width: 600px;
  margin-bottom: 30px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.username {
  font-size: 20px;
  margin-left: 15px;
  margin-right: auto;
}

.post-image {
  max-height: 600px;
}

.blurred {
  filter: blur(30px);
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.action-tag {
  display: flex;
  align-items: center;
  padding: 5px;
}

.action-tag.heart { 
  border-color: red;
  color: red;
}

.action-tag.share {
  border-color: #E6A23C;
  color: #E6A23C;
}

.action-tag.donate {
  border-color: green;
  color: green;
}

.description {
  margin-left: 15px;
}
</style>