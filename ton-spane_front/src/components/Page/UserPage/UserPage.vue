
<script lang="ts" setup>
const srcPagePhoto =
  'https://bannerplus.ru/files/img/pics/devushka-krasivye-kartinki/devushka-krasivye-kartinki-56.webp'

const srcHeaderPhoto =
  'https://focus.ua/static/storage/thumbs/920x465/2/19/69ab9b9f-41b9ca57261cb2dc97ea7ca6a4fc5192.jpg?v=8030_1'

const username = 'vikpix'

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header height="320px">
          <el-image style="width: 950px; height: 300px" :src="srcHeaderPhoto" fit="cover" />
      </el-header>
      <el-container>
        <el-aside width="400px">
          <div class="demo-image__placeholder">
    <div class="block">
      <el-image  :src="srcPagePhoto">
        <template #placeholder>
          <div class="image-slot">Loading<span class="dot">...</span></div>
        </template>
      </el-image>
    </div>
  </div>
        </el-aside>
        <el-container>
            <el-main style="display: flex; flex-direction: column; align-items: flex-start; width: 570px;">
                    <h2 class="username">{{ username }} 
                      <img src = "../../../assets/" />
                      <el-text class="text-shadow-blue custom-rounded">6789 подпищиков</el-text>
                      <el-text class="text-shadow-blue custom-rounded">132 подписок</el-text>
                    </h2>
                    <div style="height: 80px; padding-top: 20px; width: auto; display: flex; justify-content: center; ">
                      О себе:
                      lorem impsum  dolor
                    </div>      
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.demo-image__placeholder .block {
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  vertical-align: top;
}
.demo-image__placeholder .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
  
}
.demo-image__placeholder .el-image {
  padding: 0 20px;
  max-width: 400px;
  max-height: 500px;
  
}

.demo-image__placeholder.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 14px;
  
}
.demo-image__placeholder .dot {
  animation: dot 2s infinite steps(3, start);
  overflow: hidden;
}
.text-shadow-blue {
  color: rgba(255, 255, 255, 0.95); /* Белый текст с легкой прозрачностью */
  text-shadow: 0 0 2px rgba(64, 158, 255, 0.4); /* Легкое синее свечение */
  font-weight: 500; /* Умеренная жирность */
  border: 2px solid rgba(64, 158, 255, 0.6);
  box-shadow: 0 0 24px rgba(64, 158, 255, 0.4);
  padding: 12px 20px;
  background: rgba(64, 158, 255, 0.15); /* Легкий синий фон */
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
  width: auto;
  text-align: center;
  margin-left: 60px;
}

.text-shadow-blue:hover {
  text-shadow: 0 0 3px rgba(64, 158, 255, 0.5);
  box-shadow: 0 0 28px rgba(64, 158, 255, 0.5);
  background: rgba(64, 158, 255, 0.2);
}

.custom-rounded {
  border-radius: 8px;
}
</style>
