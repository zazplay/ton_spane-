<template>
  <div>
    <template v-if="isUnderMaintenance">
      <maintenance-page />
    </template>
    
    <template v-else>
      <h1>Уведомления</h1>
      <p>Здесь будут отображаться уведомления.</p>
    </template>
  </div>
</template>

<script>
import { ref } from 'vue';
import MaintenancePage from '../Maintenance.vue';

export default {
  name: 'NotificationsPage',
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