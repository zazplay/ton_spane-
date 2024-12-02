<template>
    <div class="common-layout main-container-style">
        <el-container>
            <el-aside width="300px">
                <MenuComponent />
        </el-aside>
        <el-container>
            <el-header>
                <HeaderComponent/>
            </el-header>
            <el-main>
                components
            </el-main>
        </el-container>
        </el-container>
    </div>
</template>


<script>
import HeaderComponent from './HeaderComponent.vue';
import MenuComponent from './MenuComponent.vue';
// import PostCard from './PostCard.vue';

export default {
    name: 'MainPage',
    components: {
        MenuComponent,
        HeaderComponent,
        // PostCard
    }
}
</script>

<style scoped>
.main-container-style {
    width: 1000px;
    margin: 0 auto;
}
</style>
