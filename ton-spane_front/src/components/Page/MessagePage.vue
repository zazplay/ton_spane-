<template>
  <div>
    <!-- Стрелка назад для возврата на предыдущую страницу -->
    <el-icon class="back-arrow" @click="goBack">
      <ArrowLeftBold />
    </el-icon>
    <h1>Сообщения</h1>
    <p>Здесь будут отображаться сообщения.</p>
  </div>
</template>

<script>
export default {
  name: 'MessagePage',
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