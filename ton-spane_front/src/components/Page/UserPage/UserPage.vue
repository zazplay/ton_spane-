<script lang="js" setup>
import {ref} from 'vue'

const srcPagePhoto = 'https://bannerplus.ru/files/img/pics/devushka-krasivye-kartinki/devushka-krasivye-kartinki-56.webp'
const srcHeaderPhoto = 'https://focus.ua/static/storage/thumbs/920x465/2/19/69ab9b9f-41b9ca57261cb2dc97ea7ca6a4fc5192.jpg?v=8030_1'
const username = 'vikpix'
const about = `Привет! Я фотограф и путешественник.В свободное время занимаюсь йогой и читаю книги 
по искусству. Всегда открыта для новых проектов и коллабораций.`


const activeNames = ref(['1'])

const handleChange = (val) => {
  console.log(val)
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="page-header">
        <el-image class="header-image" :src="srcHeaderPhoto" fit="cover" />
      </el-header>
      <el-container style="border-bottom: solid;">
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
          <el-main class="main-content" >
            <el-text tag="h2" size="large" type="primary" class="username">
    {{ username }}
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
      <g fill="#25c1fd" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" 
        stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" 
        font-family="none" font-weight="none" font-size="none" text-anchor="none" 
        style="mix-blend-mode: normal">
        <g transform="scale(5.12,5.12)">
          <path d="M25,2c-12.682,0 -23,10.318 -23,23c0,12.683 10.318,23 23,23c12.683,0 23,-10.317 23,-23c0,-12.682 -10.317,-23 -23,-23zM35.827,16.562l-11.511,16.963l-8.997,-8.349c-0.405,-0.375 -0.429,-1.008 -0.053,-1.413c0.375,-0.406 1.009,-0.428 1.413,-0.053l7.29,6.764l10.203,-15.036c0.311,-0.457 0.933,-0.575 1.389,-0.266c0.458,0.31 0.577,0.932 0.266,1.39z">
          </path>
        </g>
      </g>
    </svg>
    <el-text class="text-shadow-blue custom-rounded" size="large" type="primary">6789 подпищиков</el-text>
    <el-text class="text-shadow-blue custom-rounded" size="large" type="primary">20149 лайков</el-text>
  </el-text>
             <el-collapse 
              v-model="activeNames"
              @change="handleChange"
              class="custom-collapse"
            >
              <el-collapse-item name="1">
                <template #title>
                  <div class="collapse-header">
                    <span class="title">О себе</span>
                  </div>
                </template>
                <div class="collapse-content">
                  {{ about }}
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-button type="warning" class="firsMonthDonateBtn"  plain>Станьте спонором всего за 5$ первый месяц</el-button>
            <el-button type="success" class="oneYearSubscribe"  plain>Купить годовую подписку за 150$</el-button>

          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

.common-layout {
  width: 880px;
  align-self: center;
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
  margin-top: 20px;
}

.demo-image__placeholder .el-image {
  display: flex;
  padding: 0 0px;
  max-width: 280px;
  max-height: 500px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
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
  border: 2px solid rgba(64, 158, 255, 0.4);
  box-shadow: 0 0 24px rgba(64, 158, 255, 0.4);
  padding: 12px 20px;
  background: rgba(64, 158, 255, 0.12);
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
  width: auto;
  text-align: center;
  margin-left: 29px;
  cursor: default;
}

.text-shadow-blue:hover {
  text-shadow: 0 0 3px rgba(64, 158, 255, 0.5);
  box-shadow: 0 0 28px rgba(64, 158, 255, 0.5);
  background: rgba(64, 158, 255, 0.2);
}

.custom-rounded {
  border-radius: 8px;
}

.username {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  margin: 0;
  padding: 0;
  font-size: 20px;
  
}
.custom-collapse {
  border-radius: 0.75rem;
  border: none;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(var(--el-color-primary-rgb), 0.1);
  width: 31rem;
  margin-top: 20px;
  transition: box-shadow 0.3s ease;
  text-align: left;
}

.custom-collapse :deep(.el-collapse-item__header) {
  background-color: transparent;
  border-bottom: 1px solid rgba(var(--el-color-primary-rgb), 0.15);
  padding: 0.35rem 0.75rem;
  color: var(--el-text-color-primary);
  font-weight: 600;
  height: auto;
  width: 31rem;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.custom-collapse :deep(.el-collapse-item__wrap) {
  width: 31rem;
  box-sizing: border-box;
}

.custom-collapse :deep(.el-collapse-item__content) {
  background-color: transparent;
  padding: 0.35rem 0.75rem;
  color: var(--el-text-color-regular);
  box-sizing: border-box;
}

.collapse-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.collapse-header .title {
  font-size: 0.875rem;
  line-height: 1.2;
  letter-spacing: 0.01em;
  font-weight: 600;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
  /* -webkit-background-clip: text; */
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(var(--el-color-primary-rgb), 0.2);
}

.collapse-content {
  font-size: 0.875rem;
  line-height: 1.4;
  white-space: pre-line;
  color: var(--el-text-color-regular);
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Стили для активного состояния */
.custom-collapse :deep(.el-collapse-item__header.is-active) {
  border-bottom-color: var(--el-color-primary);
  background: linear-gradient(180deg, 
    rgba(var(--el-color-primary-rgb), 0.05),
    transparent
  );
}

/* Стили для hover эффекта */
.custom-collapse :deep(.el-collapse-item__header:hover) {
  background: linear-gradient(90deg,
    rgba(var(--el-color-primary-rgb), 0.08),
    rgba(var(--el-color-primary-rgb), 0.02)
  );
  border-bottom-color: var(--el-color-primary);
}

/* Добавляем эффект свечения при наведении на весь компонент */
.custom-collapse:hover {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(var(--el-color-primary-rgb), 0.2),
              0 0 15px rgba(var(--el-color-primary-rgb), 0.1);
}

.firsMonthDonateBtn{
  font-weight: bold;
  font-size: 20px;
  margin-top: 20px;
  width: 500px;
  height: 50px;
}

.oneYearSubscribe{
  font-weight: bold;
  font-size: 20px;
  margin-top: 20px;
  width: 500px;
  height: 50px;
  margin-left: 0px;
  margin-bottom: 20px ;
}

</style>