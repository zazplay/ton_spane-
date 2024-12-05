<script lang="js" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'  // Добавьте этот импорт
import ListPostCards from '../../ListPostCards.vue'
// import userSubscribeDonate from '../UserSubsribeModal/UserSubscribe.vue'


const srcPagePhoto = 'https://bannerplus.ru/files/img/pics/devushka-krasivye-kartinki/devushka-krasivye-kartinki-56.webp'
const srcHeaderPhoto = 'https://focus.ua/static/storage/thumbs/920x465/2/19/69ab9b9f-41b9ca57261cb2dc97ea7ca6a4fc5192.jpg?v=8030_1'
const username = 'vikpix'
const about = `Привет! 🌟  Здорово познакомиться!
Я фотограф и путешественник 📸 🌎. В свободное время занимаюсь йогой 🧘‍♀️ и читаю книги по искусству 🎨 📚. Всегда открыта для новых проектов и коллабораций ✨.`
const subscribes = "6789"
const subscriptions = "229"


const activeNames = ref(['1'])

const handleChange = (val) => {
  console.log(val)
}
const router = useRouter()  // Добавьте эту строку

const openDonatePage = () => {
  // Используйте существующий router если он уже импортирован
  router.push('/userSubscribeDonate')}

</script>

<template>
  <div class="common-layout">
    <el-container style="margin-bottom: 30px;">
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
            <el-text tag="h2" size="large" type="Default" class="username">
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
    <el-text class="text-shadow-blue custom-rounded" size="large" type="primary"> <el-text type = "Default">{{subscribes}} подпищиков</el-text> </el-text>
    <el-text class="text-shadow-blue custom-rounded" size="large" type="primary"><el-text type = "Default">{{subscriptions}} лайков</el-text></el-text>
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
            

          </el-main>
          
        </el-container>
        
      </el-container>
      <el-button type="warning" class="firsMonthDonateBtn" plain @click="openDonatePage">Станьте спонором всего за 5$ первый месяц</el-button>         
           <el-button type="success" class="oneYearSubscribe"  plain>Купить годовую подписку за 150$</el-button>
    </el-container>
      <ListPostCards></ListPostCards>
  </div>
</template>

<style scoped>

.common-layout {
  width: 100%;
  align-self: left;
  margin-left: 30px;
}

.page-header {
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 0px;
}

.header-image {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  margin-bottom: 10px;

}

.page-aside {
  width: 28.6%;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 70%;
  padding: 0;
  overflow-x: hidden;  /* Скрываем горизонтальную прокрутку */
  overflow-y: hidden;    /* Разрешаем вертикальную прокрутку если нужно */
  box-sizing: border-box; /* Учитываем padding в общей ширине */
}

.demo-image_placeholder {
  width: auto;
}

.block {
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: auto;
  box-sizing: border-box;
  vertical-align: top;
  margin-top: 2.3%;
}

.demo-image__placeholder .el-image {
  display: flex;
  padding: 0;
  max-width: 90%;
  max-height: 60vh;
  border-radius: 20px;
  align-items: flex-start;
  justify-content: flex-start;
}

.demo-image__placeholder.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 1rem;
}

.text-shadow-blue {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 0 0.2% rgba(64, 158, 255, 0.4);
  font-weight: 500;
  border: 0.2% solid rgba(64, 158, 255, 0.4);
  box-shadow: 0 0 2.7% rgba(64, 158, 255, 0.4);
  padding: 1.4% 2.3%;
  background: rgba(64, 158, 255, 0.12);
  transition: all 0.3s ease;
  letter-spacing: 0.03em;
  width: auto;
  text-align: center;
  margin-left: 3.3%;
  cursor: default;
}

.text-shadow-blue:hover {
  text-shadow: 0 0 0.3% rgba(64, 158, 255, 0.5);
  box-shadow: 0 0 3.2% rgba(64, 158, 255, 0.5);
  background: rgba(64, 158, 255, 0.2);
}

.custom-rounded {
  border-radius: 10px;
  width: 170px;
}

.username {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  margin: 0;
  padding: 0;
  font-size: 1.25rem;
}

.custom-collapse {
  width: 95%;
  min-height: 150px;
  margin: 1.5% 0 0 5px;
  background: transparent;
  border: 1px solid rgba(var(--el-color-primary-rgb), 0.08);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.custom-collapse:hover {
  border-color: rgba(var(--el-color-primary-rgb), 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.custom-collapse :deep(.el-collapse-item__header) {
  padding: 0.4rem 0.6rem;
  background: transparent;
  border-bottom: 1px solid rgba(var(--el-color-primary-rgb), 0.08);
  color: var(--el-text-color-primary);
  font-weight: 500;
  width: 100%;
  transition: background 0.2s ease;
  cursor: pointer;
  /* Убрали фиксированную высоту */
  display: flex;
  align-items: center;
}

.custom-collapse :deep(.el-collapse-item__arrow) {
  margin-left: auto;
  transition: transform 0.2s;
  font-weight: 600;
}

.custom-collapse :deep(.el-collapse-item__header.is-active .el-collapse-item__arrow) {
  transform: rotate(90deg);
}

.custom-collapse :deep(.el-collapse-item__header:hover) {
  background: rgba(var(--el-color-primary-rgb), 0.03);
}

.custom-collapse :deep(.el-collapse-item__header.is-active) {
  border-bottom: 1px solid rgba(var(--el-color-primary-rgb), 0.2);
}

.custom-collapse :deep(.el-collapse-item__content) {
  padding: 0.4rem 0.6rem;
  background: transparent;
  color: var(--el-text-color-regular);
  width: 95%;
}

.custom-collapse :deep(.el-collapse-item__wrap) {
  background: transparent;
}

.collapse-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.collapse-header .title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--el-color-primary);
  transition: color 0.2s ease;
}

.collapse-content {
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--el-text-color-regular);
}



.firsMonthDonateBtn {
  font-weight: bold;
  font-size: 1.25rem;
  margin-top: 2.3%;
  width: 90%;
  height: 5.7%;
  align-self: center;
}

.oneYearSubscribe {
  font-weight: bold;
  font-size: 1.25rem;
  margin-top: 2.3%;
  width: 90%;
  height: 5.7%;
  margin-left: 0;
  align-self: center;

}

</style>