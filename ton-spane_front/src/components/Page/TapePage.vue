<template>
  <div class="common-layout  containet-style">
    <el-container>
      <!-- Заголовок с добавленной иконкой -->
      <el-header class="header-style">
        <!-- Контейнер для выравнивания элементов -->
        <div class="header-content">
          <div class="site-name">SiteName</div>
          <div class="icon-container">
            <router-link to="/notifications">
              <el-icon class="icon-style">
                <BellFilled />
              </el-icon>
            </router-link>
            <el-icon class="icon-style" @click="switchToTab('second')">
              <CirclePlusFilled />
            </el-icon>
          </div>
        </div>
      </el-header>

      <!-- Основной контент -->
      <el-main style="padding-top: 0;">
        <el-container>
          <el-tabs v-model="activeName" class="demo-tabs containet-style" @tab-click="handleClick">
            <el-tab-pane label="Для вас" name="first">
              <ListPostCards />
            </el-tab-pane>
            <el-tab-pane label="Подписки" name="second">Config</el-tab-pane>
            <el-tab-pane label="Понравилось" name="third">Role</el-tab-pane>
          </el-tabs>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { BellFilled, CirclePlusFilled } from '@element-plus/icons-vue';
import ListPostCards from '../ListPostCards.vue';

// Управление активной вкладкой
const activeName = ref('first');

// Обработчик кликов по вкладкам
const handleClick = (tab, event) => {
  console.log(tab, event);
};

// Функция для переключения вкладок
const switchToTab = (tabName) => {
  activeName.value = tabName;
};
</script>

<style>
.demo-tabs>.el-tabs__content {
  /* padding: 10px; */
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.header-style {
  color: #E5EAF3;
  height: max-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.containet-style {
  width: 100%;
}

.icon-style {
  font-size: 1.5em;
  /* Увеличивает размер иконки */
  cursor: pointer;
  /* Делает иконку кликабельной */
  color: #E5EAF3;
  /* Настраивает цвет (по желанию) */
  padding: 0.1em;
  transition: transform 0.3s ease;
  /* Добавляет эффект при наведении */
}

.icon-style:hover {
  transform: scale(1.2);
  /* Увеличивает иконку при наведении */
  color: #8D9095;
  /* Изменяет цвет при наведении (опционально) */
}

/* Стиль для хедера */
.header-style {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 20px;
}

/* Контейнер для содержания хедера */
.header-content {
  display: flex;
  justify-content: space-between;
  /* Распределение элементов по краям */
  align-items: center;
  width: 100%;
  /* Растягиваем на всю ширину */
}

/* Стили для текста SiteName */
.site-name {
  font-size: 24px;
  font-weight: bold;
  color: #E5EAF3;
  text-align: center;
  flex: 1;
  /* Занимает все свободное пространство */
}

/* Контейнер для иконок */
.icon-container {
  display: flex;
  /* gap: 10px; */
  /* Отступы между иконками */
}
</style>
