<script>
import { ref } from 'vue';


export default {

    data() {
        return {
            activeIndex: ref('1'),
        };
    }
}
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-menu :default-active="activeIndex" mode="horizontal">
                    <el-menu-item index="1">
                        Профили
                    </el-menu-item>
                    <el-menu-item index="2">
                        Посты
                    </el-menu-item>
                </el-menu>
            </el-header>
            <el-main>Main</el-main>
        </el-container>
    </div>
</template>

<style scoped>
.common-layout {
    width: 80vw;
    margin: 0 auto;
}
</style>
