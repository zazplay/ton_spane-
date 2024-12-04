<template>
  <div class="common-layout" style="width: 100%;">
    <el-container>

      <el-header>
        <el-container class="container-header">
          <!-- Стрелка назад для возврата на предыдущую страницу -->
          <el-icon class="back-arrow" @click="goBack">
            <ArrowLeftBold />
          </el-icon>
          <div>Сообщения</div>
          <el-icon>
            <Edit />
          </el-icon>
        </el-container>
      </el-header>

      <el-main>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="Все" name="all">All</el-tab-pane>
          <el-tab-pane label="Онлайн" name="Onlin">Online</el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <el-container>
      <MessageUser />
    </el-container>
  </div>
</template>

<script>
import MessageUser from './MessageUser.vue';


export default {
  name: 'MessagePage',
  components: {
    MessageUser
  },
  data() {
    return {
      activeName: 'all', // Управління активною вкладкою
    };
  },
  methods: {
    goBack() {
      // Возвращаемся на предыдущую страницу
      this.$router.go(-1);
    },
    handleClick(tab, event) {
      console.log(tab, event)
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

.demo-tabs>.el-tabs__content {
  margin-top: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.demo-tabs /deep/ .el-tabs__header {
  width: 90%;
  margin: 0 auto;
}
</style>