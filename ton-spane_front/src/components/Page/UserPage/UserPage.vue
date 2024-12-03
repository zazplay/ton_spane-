<script lang="js" setup>
const srcPagePhoto = 'https://bannerplus.ru/files/img/pics/devushka-krasivye-kartinki/devushka-krasivye-kartinki-56.webp'
const srcHeaderPhoto = 'https://focus.ua/static/storage/thumbs/920x465/2/19/69ab9b9f-41b9ca57261cb2dc97ea7ca6a4fc5192.jpg?v=8030_1'
const username = 'vikpix'
const about = `Привет! Я фотограф и путешественник.В свободное время занимаюсь йогой и читаю книги 
по искусству. Всегда открыта для новых проектов и коллабораций.`
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="page-header">
        <el-image class="header-image" :src="srcHeaderPhoto" fit="cover" />
      </el-header>
      <el-container>
        <el-aside class="page-aside">
          <div class="demo-image__placeholder">
            <div class="block">
              <el-image :src="srcPagePhoto">
                <template #placeholder>
                  <div class="image-slot">Loading<span class="dot">...</span></div>
                </template>
              </el-image>
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-main class="main-content">
            <h2 class="username">{{ username }}
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
                <g fill="#25c1fd" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                  stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                  font-family="none" font-weight="none" font-size="none" text-anchor="none"
                  style="mix-blend-mode: normal">
                  <g transform="scale(5.12,5.12)">
                    <path d="M25,2c-12.682,0 -23,10.318 -23,23c0,12.683 10.318,23 23,23c12.683,0 23,-10.317 
                      23,-23c0,-12.682 -10.317,-23 -23,-23zM35.827,16.562l-11.511,16.963l-8.997,-8.349c-0.405,
                      -0.375 -0.429,-1.008 -0.053,-1.413c0.375,-0.406 1.009,-0.428 1.413,-0.053l7.29,
                      6.764l10.203,-15.036c0.311,-0.457 0.933,-0.575 1.389,-0.266c0.458,0.31 0.577,0.932 
                      0.266,1.39z">
                    </path>
                  </g>
                </g>
              </svg>
              <el-text class="text-shadow-blue custom-rounded">6789 подпищиков</el-text>
              <el-text class="text-shadow-blue custom-rounded">132 подписок</el-text>
            </h2>
            <el-card class="about-card">
              <template #header>
                <div class="card-header">
                  <span>О себе </span>
                </div>
              </template>
              <p>{{ about }}</p>
            </el-card>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  width: 880px;
}

.page-header {
  height: 270px;
  display: flex;
  justify-content: center;
}

.header-image {
  width: 820px;
  height: 250px;
  border-radius: 10px;
}

.page-aside {
  width: 340px;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 530px;
  padding: 0;
}

.demo-image_placeholder {
  width: 300px;
}

.block {
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 300px;
  box-sizing: border-box;
  vertical-align: top;
}

.demo-image__placeholder .el-image {
  padding: 0 0px;
  max-width: 280px;
  max-height: 500px;
  border-radius: 10px;

}

.demo-image__placeholder.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.text-shadow-blue {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 0 2px rgba(64, 158, 255, 0.4);
  font-weight: 500;
  border: 2px solid rgba(64, 158, 255, 0.6);
  box-shadow: 0 0 24px rgba(64, 158, 255, 0.4);
  padding: 12px 20px;
  background: rgba(64, 158, 255, 0.15);
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
  width: auto;
  text-align: center;
  margin-left: 10px;
}

.text-shadow-blue:hover {
  text-shadow: 0 0 3px rgba(64, 158, 255, 0.5);
  box-shadow: 0 0 28px rgba(64, 158, 255, 0.5);
  background: rgba(64, 158, 255, 0.2);
}

.custom-rounded {
  border-radius: 8px;
}

.about-card {
  margin-top: 20px;
  width: 500px;
  background-color: transparent;
  border: transparent;
  text-align: left;
}

.about-card .card-header {
  font-weight: 600;
  height: 15px;
}

.about-card p {
  margin: 0;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}
</style>