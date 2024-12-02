<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" 
        @select="handleSelect">
        <el-menu-item index="0"> Для вас</el-menu-item>
        <el-menu-item index="1"> Processing Center</el-menu-item>
        <el-menu-item index="2"> Processing Center </el-menu-item>
    </el-menu>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref('0')
const handleSelect = (key, keyPath) => {
    console.log(key, keyPath)
}
</script>


<style>
/* .el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
} */
</style>