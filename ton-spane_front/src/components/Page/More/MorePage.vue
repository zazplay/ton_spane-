<template>
  <div class="common-layout" style="width: 100%;">
    <el-container>
      <el-header>
        <el-container class="container-header">
          <el-icon class="back-arrow" @click="goBack">
            <ArrowLeftBold />
          </el-icon>
          <div>Еще</div>
          <div></div>
        </el-container>
      </el-header>
      
      <el-main>
        <GoToProfile/>
        <ThemeSwitcher/>
        <LanguageSwitcher />  <!-- Заменили кнопку на компонент -->
        <LogoutButton />
      </el-main>
    </el-container>
    
    <!-- Скрытый элемент для Google Translate -->
    <div id="google_translate_element"></div>
  </div>
</template>

<script>
import GoToProfile from './GoToProfile.vue';
import ThemeSwitcher from '../../../assets/ThemeSwitcher.vue';
import LogoutButton from './LogoutButton.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';  // Импортируем новый компонент

export default {
  name: 'MorePage',
  components: {
    GoToProfile,
    ThemeSwitcher,
    LogoutButton,
    LanguageSwitcher  // Добавляем в components
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>