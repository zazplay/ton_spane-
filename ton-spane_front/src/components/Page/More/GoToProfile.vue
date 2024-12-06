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
                <span style="color: aliceblue;">{{ userData?.username || 'Loading...' }}</span>
                <el-link 
                    :underline="false" 
                    :href="`/user/${userId}`" 
                    class="link-style"
                >
                    Перейти к профилю >
                </el-link>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const userId = ref('f26088fd-d4aa-4420-a7f6-1f89baa915c3')
const userData = ref(null)
const defaultImage = "https://shutok.ru/uploads/posts/2023-01/1675019582_shutok.ru.01.jpg"

const handleError = () => {
    userData.value.profilePicture = defaultImage
}

const fetchUserData = async () => {
    try {
        const response = await fetch(`https://ton-back-e015fa79eb60.herokuapp.com/api/users/${userId.value}`)
        if (!response.ok) {
            throw new Error('Failed to fetch user data')
        }
        userData.value = await response.json()
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
}

onMounted(() => {
    fetchUserData()
})
</script>

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
        padding: 0 !important;
        padding-left: 10px !important;
    }
}
</style>