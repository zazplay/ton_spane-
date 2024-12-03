<template>
  <div>
     <!-- Стрелка назад для возврата на предыдущую страницу -->
     <el-icon class="back-arrow" @click="goBack">
      <ArrowLeftBold />
    </el-icon>
    <h1>Уведомления</h1>
    <p>Здесь будут отображаться уведомления.</p>
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
/* Стили для страницы уведомлений */
</style>