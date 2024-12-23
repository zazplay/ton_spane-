<template>
  <div class="common-layout" style="width: 100%;">
    <el-container>
      <el-header>
        <el-container class="container-header">
          <el-icon class="back-arrow" @click="goBack">
            <ArrowLeftBold />
          </el-icon>
          <el-text style="font-size: 25px;">Чаты</el-text>
          <el-icon>
            <Edit />
          </el-icon>
        </el-container>
      </el-header>

      <el-main>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="Все" name="all" style="color: white;"></el-tab-pane>
          <el-tab-pane label="Онлайн" name="Onlin"></el-tab-pane>
          <ChatPrev></ChatPrev>
        </el-tabs>
      </el-main>
    </el-container>
    <el-container>
      <MessageUser />
    </el-container>
  </div>
</template>

<script>
import ChatPrev from './ChatPreview.vue';

export default {
name: 'ChatView', // Changed from 'Chat' to 'ChatView'
components: {
  ChatPrev,
  
},
data() {
  return {
    activeName: 'all'
  }
},
methods: {
  handleClick(tab) {
    console.log(tab);
  },
  goBack() {
    this.$router.go(-1);
  }
}
}
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

.demo-tabs :deep(.el-tabs__header) {
width: 90%;
margin: 0 auto;
}
</style>