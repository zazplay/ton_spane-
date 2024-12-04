<template>
    <el-container class="container-profile">
        <el-aside width="100px" style="padding: 0; margin: 0;">
            <el-container class="container-img">
                <div class="demo-basic--circle">
                    <div class="block">
                        <el-avatar shape="square" :size="size" :src="url" />
                    </div>
                </div>
            </el-container>
        </el-aside>
        <el-main class="info-container-profile">
            <span style="color: aliceblue;">Имя</span>
            <span>Текст сообщения</span>
        </el-main>
        
    </el-container>
</template>

<script setup>
const size = 40;
const url = 'https://www.ifoto.ai/blog/wp-content/uploads/ai-swimsuit-models.jpg';
</script>

<style scoped>
container-img {
    padding: 7px;
    padding-left: 15px;
}

.common-layout {
    margin: 0 auto;
}

.container-profile {
    background-color: grey;
    border-radius: 15px;
    height: 88px;
    overflow: hidden;

}

.container-img {
    padding: 7px;
    padding-left: 15px;
}

.info-container-profile {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: start;
    padding: 0;
}

.link-style {
    justify-content: start;
    color: darkslategrey;
}

.link-style:hover {
    color: white;
}

.demo-basic {
    text-align: center;
}

.demo-basic .demo-basic--circle,
.demo-basic .demo-basic--square {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
}

.demo-basic .block:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
}

.demo-basic .block {
    flex: 1;

}

.demo-basic .el-col:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
}
</style>