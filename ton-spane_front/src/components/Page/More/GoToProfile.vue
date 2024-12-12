<template>
    <div class="common-layout">
        <el-container class="container-profile">
            <el-aside width="100px" style="padding: 0; margin: 0;">
                <el-container class="container-img">
                    <div class="demo-basic--circle">
                        <div class="block">
                            <el-avatar 
                                shape="square" 
                                :size="70" 
                                :src="userData?.profilePicture || defaultImage"
                                @error="handleError" 
                            />
                        </div>
                    </div>
                </el-container>
            </el-aside>
            <el-main class="info-container-profile">
                <span style="color: aliceblue;">{{ userData?.email || 'Loading...' }}</span>
                <router-link 
                    :to="`/app/myPage/${userId}`" 
                    class="link-style"
                >
                    Перейти к профилю >
                </router-link>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import config from '@/config';

const store = useStore()
const userId = computed(() => store.getters.getSub)
const userData = ref(null)
const defaultImage = "https://img.icons8.com/?size=100&id=83151&format=png&color=22C3E6"

const handleError = () => {
    if (userData.value) {
        userData.value.profilePicture = defaultImage
    }
}

const fetchUserData = async () => {
    try {
        const response = await fetch(`${config.API_BASE_URL}/users/${userId.value}`)
        if (!response.ok) {
            throw new Error('Failed to fetch user data')
        }
        userData.value = await response.json()
    } catch (error) {
        console.error('Error fetching user data:', error)
        userData.value = null
    }
}

onMounted(() => {
    if (userId.value) {
        fetchUserData()
    }
})
</script>


<!-- <template>
    <div class="common-layout">
        <el-container class="container-profile">
            <el-aside width="100px" style="padding: 0; margin: 0; ">
                <el-container class="container-img">
                    <div class="demo-basic--circle">
                        <div class="block">
                            <el-avatar shape="square" :size="70" :src="userData?.profilePicture || defaultImage"
                                @error="handleError" />
                        </div>
                    </div>
                </el-container>
            </el-aside>
            <el-main class="info-container-profile">
                <span style="color: aliceblue;">{{ userData?.email || 'Loading...' }}</span>
                <router-link :to="`/app/user/${userId}`" class="link-style">
                    Перейти к профилю >
                </router-link>
            </el-main>
        </el-container>
    </div>
</template> -->

<style scoped>
.common-layout {
    width: 90%;
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
    padding-left: 10px !important;
    display: flex;
    justify-content: center;
    /* Центруємо зображення по горизонталі */
    align-items: center;
    /* Центруємо зображення по вертикалі */
    overflow: hidden;
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

@media (max-width: 1200px) {
    .container-img {
        margin-top: 8px;
        padding: 0 !important;
        padding-left: 10px !important;
    }
}
</style>