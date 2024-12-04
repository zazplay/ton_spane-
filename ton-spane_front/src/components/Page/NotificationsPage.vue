<template>
  <div class="common-layout" style="width: 100%;">
    <el-container>

      <el-header>
        <el-container class="container-header">
          <!-- Стрелка назад для возврата на предыдущую страницу -->
          <el-icon class="back-arrow" @click="goBack">
            <ArrowLeftBold />
          </el-icon>
          <div>Уведомления</div>
          <el-icon>
            <Setting />
          </el-icon>
        </el-container>
      </el-header>

      <el-main>
       
      </el-main>
    </el-container>
  </div>
</template>

<script>

  export default {
    name: 'NotificationsPage',
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