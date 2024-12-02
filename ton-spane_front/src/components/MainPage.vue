<template>
    <div class="common-layout  main-container-style">
        <el-container>
            <el-aside width="20%">
                <MenuComponent />
            </el-aside>
            <el-container class="container-content-style">
                <TareComponent />
            </el-container>
        </el-container>
    </div>
</template>


<script>
import TareComponent from './TapeComponent.vue';
import MenuComponent from './MenuComponent.vue';


export default {
    name: 'MainPage',
    components: {
        MenuComponent,
        TareComponent,
    }
}
</script>

<style scoped>
.main-container-style {
    width: 1000px;
    margin: 0 auto;
}

.container-content-style {
    width: 80%;
}
</style>
