
<script setup>
import { ref } from 'vue'

// Props
// eslint-disable-next-line no-undef
const props = defineProps({
  username: {
    type: String,
    default: 'vikpix'
  },
  avatarUrl: {
    type: String,
    default: 'https://bannerplus.ru/files/img/pics/devushka-krasivye-kartinki/devushka-krasivye-kartinki-56.webp'
  },
  imageUrl: {
    type: String,
    default: 'https://masterpiecer-images.s3.yandex.net/8c41eb6445aa11ee92c1363fac71b015:upscaled'
  },
  postDesc: {
    type: String,
    default: 'Проснулась сегодня с таким хорошим настроением 😉'
  },
  initialLiked: {
    type: Boolean,
    default: false
  },
  initialShared: {
    type: Boolean,
    default: false
  },
  initialDonated: {
    type: Boolean,
    default: false
  },
  isBlurred: {
  type: Boolean,
  default: false  
  
},
initialSubscribed: {
  type: Boolean,
  default: false
}
  // Add new props here
  // propName: {
  //   type: <Type>,
  //   default: <DefaultValue>
  // }
})

// eslint-disable-next-line no-undef
const emit = defineEmits(['like', 'share', 'donate', 'subscribe'])

// Reactive states
const isLiked = ref(props.initialLiked)
const isShared = ref(props.initialShared)
const isDonated = ref(props.initialDonated)
const isSubscribed = ref(props.initialSubscribed)



// Event handlers
const handleLike = (status) => {
  isLiked.value = status
  emit('like', status)
}
const handleSubscribe = () => {
  isSubscribed.value = !isSubscribed.value
  emit('subscribe', isSubscribed.value)
}

const handleShare = (status) => {
  isShared.value = status
  emit('share', status)
}

const handleDonate = (status) => {
  isDonated.value = status
  emit('donate', status)
}
</script>

<template>
  <el-card style="width: 600px">
    <el-row class="demo-avatar demo-basic">
      <div style="display: flex; align-items: center; width: 100%">
        <el-avatar shape="square" :size="50" :src="avatarUrl" />
        <el-text class="mx-1" style="font-size: 20px; margin-left: 15px;">{{ username }}</el-text>
        <el-button 
  :type="isSubscribed ? 'success' : 'primary'" 
  class="mt-3" 
  style="margin-left: auto" 
  @click="handleSubscribe"
  plain
>
  {{ isSubscribed ? 'Вы подписаны' : 'Подписаться' }}
</el-button>      </div>
    </el-row>
    <img
      :src="imageUrl"
      style="width: 100%"
      :style="{ filter: isBlurred ? 'blur(30px)' : 'none' }"

    />
    <div class="actions-container">
      <el-check-tag 
        :checked="isLiked"
        type="danger"
        @change="handleLike"
        class="custom-heart-tag"
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
          style="vertical-align: middle;"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </el-check-tag>
      
      <el-check-tag 
        :checked="isShared"
        type="warning"
        @change="handleShare"
        class="custom-share-tag"
      >
        <el-icon 
          size="25px" 
          style="vertical-align: middle; color: #E6A23C;"
        >
          <Share />
        </el-icon>
      </el-check-tag>

      <el-check-tag 
        :checked="isDonated"
        type="success"
        @change="handleDonate"
        class="custom-donate-tag"
      >
        <el-icon 
          size="25px" 
          style="vertical-align: middle; color: green;"
        >
          <Money />
        </el-icon>
      </el-check-tag>
      <el-text 
        class="mx-8 text-regular" 
        size="large"
        tag="b"
        emphasis
      >
  {{ postDesc.length > 100 ? postDesc.slice(0, 100) + '...' : postDesc }}
</el-text>
    </div>
  </el-card>
</template>


<style scoped>
.actions-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.custom-heart-tag {
  border-color: red !important;
  color: red !important;
}

.custom-share-tag {
  border-color: #E6A23C !important;
  color: #E6A23C !important;
}

.custom-donate-tag {
  border-color: green !important;
  color: green !important;
}

.custom-heart-tag:hover, 
.custom-share-tag:hover,
.custom-donate-tag:hover {
  opacity: 0.8;
}

.userName {
  font-size: 20px;
}

.demo-basic {
  text-align: center;
  margin-bottom: 10px;
}

.demo-basic .sub-title {
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.demo-basic .demo-basic--square {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-basic .block {
  flex: 1;
}

.demo-basic .el-col:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}
</style>
