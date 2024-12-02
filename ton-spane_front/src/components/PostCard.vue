<template>
  <el-card style="max-width: 480px">
    <el-row class="demo-avatar demo-basic">
      <div style="display: flex; align-items: center; width: 100%">
        <el-avatar shape="square" :size="50" :src="avatarUrl" />
        <el-text class="mx-1" style="font-size: 20px; margin-left: 15px;">vikpix</el-text>
        <el-button type="primary" class="mt-3" style="margin-left: auto" plain>Подписаться</el-button>
      </div>
    </el-row>
    <img src="https://photobooth.cdn.sports.ru/preset/post/2/a9/7f9fbe6484f16b490eaf7b68806f5.jpeg"
      style="width: 100%" />
  </el-card>
</template>

<script setup>
import { reactive, toRefs } from 'vue'


const state = reactive({
  avatarUrl: 'https://pictures.ua.tribuna.com/image/642258ce-18ed-4728-a2d2-0ca953ccb2de?width=1260&quality=70'
})

const { avatarUrl } = toRefs(state)
</script>

<style scoped>
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