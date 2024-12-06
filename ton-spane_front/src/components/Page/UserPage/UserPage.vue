<script lang="js" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ListPostCards from '../../ListPostCards.vue'

// Константы профиля
const srcPagePhoto = 'https://bannerplus.ru/files/img/pics/devushka-krasivye-kartinki/devushka-krasivye-kartinki-56.webp'
const srcHeaderPhoto = 'https://focus.ua/static/storage/thumbs/920x465/2/19/69ab9b9f-41b9ca57261cb2dc97ea7ca6a4fc5192.jpg?v=8030_1'
const username = 'vikpix'
const about = `Привет! 🌟 Здорово познакомиться!
Я фотограф и путешественник 📸 🌎. В свободное время занимаюсь йогой 🧘‍♀️ и читаю книги по искусству 🎨 📚. Всегда открыта для новых проектов и коллабораций ✨.`
const subscribes = "6432"
const subscriptions = "229"

// Состояние и роутинг
const activeNames = ref(['1'])
const router = useRouter()
const openDonatePage = () => router.push('/userSubscribeDonate')
</script>

<template>
  <div class="layout">
    <el-container>
      <!-- Шапка профиля -->
      <el-header class="header">
        <el-image class="header-image" :src="srcHeaderPhoto" fit="cover" />
      </el-header>
    </el-container>
    <!-- Контейнер с основной информацией -->
    <el-container class="content-container">
      <el-aside class="aside">
        <!-- Фото профиля -->
        <div class="profile-image">
          <el-image :src="srcPagePhoto">
            <template #placeholder>
              <div class="image-slot">Загрузка<span class="dot">...</span></div>
            </template>
          </el-image>
        </div>
      </el-aside>
      <el-container>
        <el-main class="main-content">
          <el-text tag="h2" size="large" class="username">
            {{ username }}
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
              <g fill="#25c1fd" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                font-family="none" font-weight="none" font-size="none" text-anchor="none"
                style="mix-blend-mode: normal">
                <g transform="scale(5.12,5.12)">
                  <path
                    d="M25,2c-12.682,0 -23,10.318 -23,23c0,12.683 10.318,23 23,23c12.683,0 23,-10.317 23,-23c0,-12.682 -10.317,-23 -23,-23zM35.827,16.562l-11.511,16.963l-8.997,-8.349c-0.405,-0.375 -0.429,-1.008 -0.053,-1.413c0.375,-0.406 1.009,-0.428 1.413,-0.053l7.29,6.764l10.203,-15.036c0.311,-0.457 0.933,-0.575 1.389,-0.266c0.458,0.31 0.577,0.932 0.266,1.39z">
                  </path>
                </g>
              </g>
            </svg>
            <el-text class="text-shadow-blue custom-rounded" size="large" type="primary"> <el-text>{{ subscribes }}
                подпищиков</el-text> </el-text>
            <el-text class="text-shadow-blue custom-rounded" size="large" type="primary"><el-text>{{ subscriptions }}
                лайков</el-text></el-text>
          </el-text>
          <el-collapse v-model="activeNames" @change="handleChange" class="custom-collapse">
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
        <el-aside>
          <!-- Имя пользователя и статистика -->
          <el-text tag="h2" class="username">
            {{ username }}
            <!-- Значок верификации -->
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
              <g fill="#25c1fd" fill-rule="nonzero">
                <g transform="scale(5.12,5.12)">
                  <path
                    d="M25,2c-12.682,0 -23,10.318 -23,23c0,12.683 10.318,23 23,23c12.683,0 23,-10.317 23,-23c0,-12.682 -10.317,-23 -23,-23zM35.827,16.562l-11.511,16.963l-8.997,-8.349c-0.405,-0.375 -0.429,-1.008 -0.053,-1.413c0.375,-0.406 1.009,-0.428 1.413,-0.053l7.29,6.764l10.203,-15.036c0.311,-0.457 0.933,-0.575 1.389,-0.266c0.458,0.31 0.577,0.932 0.266,1.39z">
                  </path>
                </g>
              </g>
            </svg>
            <!-- Бейджи статистики -->

          </el-text>
          <el-text class="stat-badge" type="primary">
            <el-text class="stat-text">{{ subscribes }} подписчиков</el-text>
          </el-text>
          <el-text class="stat-badge" type="primary">
            <el-text class="stat-text">{{ subscriptions }} лайков</el-text>
          </el-text>
        </el-aside>
      </el-container>

      <!-- Секция "О себе" -->
      <el-container>
        <el-main class="main">
          <el-collapse v-model="activeNames" class="about-section">
            <el-collapse-item name="1">
              <template #title>
                <div class="collapse-header">
                  <span class="title">О себе</span>
                </div>
              </template>
              <div class="collapse-content">{{ about }}</div>
            </el-collapse-item>
          </el-collapse>
        </el-main>
      </el-container>

      <!-- Кнопки подписки -->
      <el-button type="warning" class="action-button" plain @click="openDonatePage">
        Станьте спонсором всего за 5$ первый месяц
      </el-button>
      <el-button type="success" class="action-button" plain>
        Купить годовую подписку за 150$
      </el-button>
    </el-container>

    <!-- Список постов -->
    <ListPostCards />
  </div>
</template>

<style scoped>
/* Базовые стили */
.layout {
  width: 100%;
  align-self: center;
}

/* Стили шапки */
.header {
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
}

.header-image {
  width: 100%;
  max-height: 300px !important;
  border-radius: 20px;
  margin-bottom: 10px;
}

/* Секция профиля */
.aside {
  width: 100%;
  display: flex;
  align-items: center;
}

.profile-image {
  width: 15%;
  margin-right: 20px;
}

.profile-image :deep(.el-image) {
  border-radius: 20px;
  align-self: flex-start;
  justify-self: flex-start;
}

/* Имя пользователя и статистика */
.username {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
  padding: 0;
  width: 43%;
}

.stat-badge {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
  font-weight: 500;
  border-radius: 15px;
  padding: 12px 20px;
  width: auto;
  margin-left: 20px;
  background: linear-gradient(135deg,
      rgba(64, 158, 255, 0.15) 0%,
      rgba(100, 180, 255, 0.25) 50%,
      rgba(64, 158, 255, 0.15) 100%);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(64, 158, 255, 0.2);
  box-shadow:
    0 4px 6px rgba(64, 158, 255, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
}

.stat-badge:hover {
  background: linear-gradient(135deg,
      rgba(64, 158, 255, 0.25) 0%,
      rgba(100, 180, 255, 0.35) 50%,
      rgba(64, 158, 255, 0.25) 100%);
  transform: translateY(-2px);
  box-shadow:
    0 8px 12px rgba(64, 158, 255, 0.15),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

/* Основной контент */
.main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 70%;
  padding: 0;
  overflow: hidden;
  margin-bottom: 0px;
}

/* Секция "О себе" */
.about-section {
  width: 99%;
  min-height: 150px;
  margin: 1.5% 0 0 5px;
  background: transparent;
  border: 1px solid rgba(var(--el-color-primary-rgb), 0.08);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  margin-bottom: 0px;
}

.about-section:hover {
  border-color: rgba(var(--el-color-primary-rgb), 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.about-section :deep(.el-collapse-item__header) {
  padding: 0.4rem 0.6rem;
  background: transparent;
  border-bottom: 1px solid rgba(var(--el-color-primary-rgb), 0.08);
}

.about-section :deep(.el-collapse-item__content) {
  padding: 0.4rem 0.6rem;
  width: 95%;
}

.collapse-header .title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--el-color-primary);
}

.collapse-content {
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--el-text-color-regular);
}

/* Кнопки действий */
.action-button {
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 25px;
  width: 99%;
  height: 5.7%;
  align-self: center;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-left: 0;


}

/* Адаптивные стили */
@media (max-width: 480px) {
  .content-container {
    flex-direction: column !important;
  }

  .main {
    width: 100%;
    padding: 0 15px;
  }

  .username {
    font-size: 14px;
    width: 30%;
    flex-wrap: wrap;
    gap: 5px;
  }

  .profile-image {
    width: 40%;
    margin-right: 20px;
  }

  .stat-badge {
    width: 70.6% !important;
    padding: 10px;
    margin: 5px;
  }

  .stat-badge :deep(.el-text) {
    font-size: 10px !important;
  }

  .about-section {
    width: 100%;
    margin: 0px 0;
  }

  .collapse-header .title,
  .collapse-content {
    font-size: 14px;
  }

  .action-button {
    font-size: 0.42rem !important;
    height: auto;
    padding: 10px;
  }
}
</style>