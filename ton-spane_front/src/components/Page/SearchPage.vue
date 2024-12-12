<template>
  <div>
    <!-- Стрелка назад для возврата на предыдущую страницу -->
    

    <!-- Если сайт на техобслуживании -->
    <maintenance-page v-if="isUnderMaintenance" />
    
    <!-- Основной контент страницы -->
    <template v-else>
      <h1>Поиск</h1>
      <p>Здесь будут отображаться поиск.</p>
    </template>
  </div>
</template>

<script>
import { ref } from 'vue';
import MaintenancePage from '../Maintenance.vue';

export default {
  name: 'SearchPage',
  components: {
    MaintenancePage,
  },
  setup() {
    const isUnderMaintenance = ref(true); // Установите false для отображения обычного контента
    
    return {
      isUnderMaintenance
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
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