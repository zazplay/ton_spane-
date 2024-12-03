<template>
    <div>
       <!-- Стрелка назад для возврата на предыдущую страницу -->
       <el-icon class="back-arrow" @click="goBack">
        <ArrowLeftBold />
      </el-icon>
      <h1>Покупки</h1>
      <p>Здесь будут отображаться покупки.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PurchasedPage',
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