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
        <el-button class="languageButton">English</el-button>
        <LogoutButton />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import GoToProfile from './GoToProfile.vue';
import ThemeSwitcher from '../../../assets/ThemeSwitcher.vue';
import LogoutButton from './LogoutButton.vue';

export default {
  name: 'MorePage',
  components: {
    GoToProfile,
    ThemeSwitcher,
    LogoutButton
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.container-header {
  display: flex;
  justify-content: space-between;
  color: white;
  width: 100%;
  margin-top: 1em;
  font-size: x-large;
}
.languageButton{
  margin-left: 37px;
  width: 90%;
  height: 50px;
  font-size: 15px;
  border-radius: 10px;
  margin-top: 25px;
}
</style>