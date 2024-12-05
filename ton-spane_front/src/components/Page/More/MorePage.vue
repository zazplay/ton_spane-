<template>
  <div class="common-layout" style="width: 100%;">
    <el-container>

      <el-header>
        <el-container class="container-header">
          <!-- Стрелка назад для возврата на предыдущую страницу -->
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
      </el-main>
    </el-container>
  </div>
</template>

<script>
import GoToProfile from './GoToProfile.vue';
import ThemeSwitcher from '../../../assets/ThemeSwitcher.vue';

  export default {
    name: 'MorePage',
    components:{
      GoToProfile,
      ThemeSwitcher
    },
    methods: {
      goBack() {
        // Возвращаемся на предыдущую страницу
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

</style>