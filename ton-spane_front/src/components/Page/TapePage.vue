<template>
  <div class="common-layout containet-style">
    <el-container>
      <!-- Заголовок с добавленной иконкой -->
      <el-header class="header-style">
        <div class="header-content">
          <div class="site-name">DreamScape</div>
          <div class="icon-container">
            <router-link to="/notifications">
              <el-icon class="icon-style">
                <BellFilled />
              </el-icon>
            </router-link>
            <el-icon class="icon-style" @click="openForm">
              <CirclePlusFilled />
            </el-icon>
            <!-- Передача пропа isOpen -->
            <AddPostForm :isOpen="isFormOpen" @close="closeForm" />
          </div>
        </div>
      </el-header>

      <!-- Основной контент -->
      <el-main style="padding-top: 0;">
        <el-container>
          <el-tabs v-model="activeTab" class="demo-tabs containet-style" @tab-click="handleTabClick">
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

<script>
import { BellFilled, CirclePlusFilled } from '@element-plus/icons-vue';
import ListPostCards from '../ListPostCards.vue';
import AddPostForm from '../AddPostForm.vue';

export default {
  components: {
    AddPostForm,
    ListPostCards,
    BellFilled,
    CirclePlusFilled,
  },
  data() {
    return {
      isFormOpen: false,  // Управління відкриттям форми
      activeTab: 'first', // Управління активною вкладкою
    };
  },
  methods: {
    openForm() {
      this.isFormOpen = true; // Відкриваємо форму
    },
    closeForm() {
      this.isFormOpen = false; // Закриваємо форму
    },
    handleTabClick(tab) {
      console.log('Вибрана вкладка:', tab.name);
    },
  },
};
</script>

<style>
.demo-tabs>.el-tabs__content {
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
  cursor: pointer;
  color: #E5EAF3;
  padding: 0.3em;
  transition: transform 0.3s ease;
}

.icon-style:hover {
  transform: scale(1.2);
  color: #8D9095;
}

.header-style {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.site-name {
  font-size: 16px;
  font-weight: bold;
  color: #E5EAF3;
  text-align: center;
  flex: 1;
}

.icon-container {
  display: flex;
}
</style>
