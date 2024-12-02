<template>
    <div class="common-layout  main-container-style">
        <el-container>
            <el-aside class="left-menu" >
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
    width: 800px;
    margin: 0 auto;
}

.left-menu{
    width:20%;
}
.container-content-style {
    width: 80%;
}
</style>
