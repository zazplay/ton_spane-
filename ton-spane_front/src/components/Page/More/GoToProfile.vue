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
  max-width: 1200px;
}

.container-profile {
  background: linear-gradient(
    145deg, 
    rgba(32, 40, 62, 0.8) 0%,
    rgba(45, 55, 72, 0.9) 100%
  );
  border-radius: 16px;
  height: 88px;
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

}

.container-profile:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.15),
    0 12px 20px rgba(0, 0, 0, 0.12),
    inset 0 2px 4px rgba(255, 255, 255, 0.15);
}

.container-img {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 96%;
  padding: 10px;
  padding-left: 16px !important;
  box-sizing: border-box;
  border-radius: 50%;
  margin-top: 3px;


}

.container-img :deep(img) {
  width: 70px;
  height: 70px;
  object-fit: cover;
}

.container-img:hover :deep(img) {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.4);
}

.info-container-profile {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: start;
  padding: 12px 16px;
  gap: 4px;
}

.info-container-profile :deep(.el-text) {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: color 0.2s ease;
}

.link-style {
  justify-content: start;
  color: #94a3b8;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
}

.link-style:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.link-style::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 8px;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #60a5fa, #818cf8);
  transition: width 0.3s ease;
}

.link-style:hover::after {
  width: calc(100% - 16px);
}

.demo-basic {
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 8px;
  margin-top: 8px;
}

.demo-basic .demo-basic--circle,
.demo-basic .demo-basic--square {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
}

.demo-basic .block {
  flex: 1;
  padding: 12px;
  transition: background-color 0.3s ease;
  border-radius: 8px;
}

.demo-basic .block:hover {
  background: rgba(255, 255, 255, 0.05);
}

.demo-basic .block:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.demo-basic .el-col:not(:last-child) {
  position: relative;
}

.demo-basic .el-col:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
}

/* Анимации */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Медиа-запросы */
@media (max-width: 1200px) {
  .common-layout {
    width: 95%;
  }

  .container-img {
    margin-top: 8px;
    padding: 8px !important;
    padding-left: 12px !important;
  }

  .info-container-profile {
    padding: 8px 12px;
  }

  .demo-basic {
    padding: 4px;
  }

  .demo-basic .demo-basic--circle,
  .demo-basic .demo-basic--square {
    padding: 4px 8px;
  }

  .demo-basic .block {
    padding: 8px;
  }
}

/* Добавляем поддержку темной темы */
:root[data-theme="dark"] {
  .container-profile {
    background: linear-gradient(
      145deg, 
      rgba(17, 24, 39, 0.8) 0%,
      rgba(31, 41, 55, 0.9) 100%
    );
  }

  .link-style {
    color: #9ca3af;
  }

  .link-style:hover {
    color: #f9fafb;
  }
}

/* Добавляем анимацию при появлении элементов */
.container-profile,
.info-container-profile,
.demo-basic {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>