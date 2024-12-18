<template>
  <div>
    <template v-if="isUnderMaintenance">
      <maintenance-page />
    </template>

    <template v-else>
      <!-- Стрелка назад для возврата на предыдущую страницу -->
      <el-icon class="back-arrow" @click="goBack">
        <ArrowLeftBold />
      </el-icon>
      <h1>Покупки</h1>
      <p>Здесь будут отображаться покупки.</p>
    </template>
  </div>
</template>

<script>
import { ref } from 'vue';
import MaintenancePage from '../Maintenance.vue';

export default {
  name: 'PurchasedPage',
  components: {
    MaintenancePage,
  },
  setup() {
    const isUnderMaintenance = ref(true); // Установите false для отображения обычного контента

    return {
      isUnderMaintenance,
    };
  },
  methods: {
    goBack() {
      // Возвращаемся на предыдущую страницу
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.back-arrow {
  font-size: 24px;
  cursor: pointer;
  margin-left: 20px;
  margin-top: 20px;
}
</style>
