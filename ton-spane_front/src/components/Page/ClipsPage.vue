<template>
  <div>
    <!-- Стрелка назад для возврата на предыдущую страницу -->
    <el-icon class="back-arrow" @click="goBack">
      <ArrowLeftBold />
    </el-icon>

    <h1>Клипы</h1>
    <p>Здесь будут отображаться клипы.</p>
  </div>
</template>

<script>

export default {
  name: 'ClipsPage',
  methods: {
    goBack() {
      // Возвращаемся на предыдущую страницу
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
/* Стили для стрелки */
.back-arrow {
  font-size: 24px;
  cursor: pointer;
  margin-left: 20px;
  margin-top: 20px;
}
</style>
