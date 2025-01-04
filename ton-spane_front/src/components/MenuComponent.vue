# MenuComponent.vue
<template>
    <div class="menu-container">
        <el-menu
            :default-active="currentRoute"
            class="el-menu-vertical-demo"
        >
            <div class="menu-header">
                <h2 class="menu-title">Меню</h2>
                <div class="menu-divider"></div>
            </div>

            <router-link to="/app/tape">
                <el-menu-item :index="'/app/tape'" class="menu-item" :class="{ 'is-active': isActive('/app/tape') }">
                    <el-icon><House /></el-icon>
                    <span>Лента</span>
                </el-menu-item>
            </router-link>

            <router-link to="/app/clips">
                <el-menu-item :index="'/app/clips'" class="menu-item" :class="{ 'is-active': isActive('/app/clips') }">
                    <el-icon><Film /></el-icon>
                    <span>Клипы</span>
                </el-menu-item>
            </router-link>

            <router-link to="/app/message">
                <el-menu-item :index="'/app/message'" class="menu-item" :class="{ 'is-active': isActive('/app/message') }">
                    <el-icon><Message /></el-icon>
                    <span>Сообщения</span>
                </el-menu-item>
            </router-link>

            <router-link to="/app/notifications">
                <el-menu-item :index="'/app/notifications'" class="menu-item" :class="{ 'is-active': isActive('/app/notifications') }">
                    <el-icon><BellFilled /></el-icon>
                    <span>Обновления</span>
                </el-menu-item>
            </router-link>

            <router-link to="/app/search">
                <el-menu-item :index="'/app/search'" class="menu-item" :class="{ 'is-active': isActive('/app/search') }">
                    <el-icon><Search /></el-icon>
                    <span>Поиск</span>
                </el-menu-item>
            </router-link>

            <router-link to="/app/purchased">
                <el-menu-item :index="'/app/purchased'" class="menu-item" :class="{ 'is-active': isActive('/app/purchased') }">
                    <img src="../assets/dollar-svgrepo-com.svg" class="custom-icon" alt="Dollar icon" />
                    <span>Покупки</span>
                </el-menu-item>
            </router-link>

            <router-link to="/app/more">
                <el-menu-item :index="'/app/more'" class="menu-item" :class="{ 'is-active': isActive('/app/more') }">
                    <el-icon><IconMenu /></el-icon>
                    <span>Еще</span>
                </el-menu-item>
            </router-link>
        </el-menu>

        <div v-if="isActive('/app/tape')" class="recommendations">
            <h3 class="recommendations-title">
                <el-icon><StarFilled /></el-icon>
                Рекомендуемые посты
            </h3>
            
            <el-card class="recommendation-card" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <el-icon :size="24" color="var(--el-color-primary)">
                            <StarFilled />
                        </el-icon>
                        <span>Популярные посты</span>
                    </div>
                </template>
                <div class="card-content">
                    <p>Откройте для себя самый популярный контент этой недели</p>
                    <el-button type="primary" class="action-button" @click="router.push('/app/tape/popular')">
                        Смотреть топ
                    </el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
    Menu as IconMenu,
    StarFilled,
    House,
    Film,
    Message,
    BellFilled,
    Search
} from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const currentRoute = computed(() => route.path);

const isActive = (path) => {
    return route.path === path;
};
</script>

<style scoped>
.menu-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.el-menu-vertical-demo {
    width: 280px !important;
    border-right: none !important;
    margin-top: 0em;
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 16px 0;
    animation: slideIn 0.3s ease-out;
    width: 68% !important; 

}

.menu-header {
    padding: 0 20px 16px;
    position: relative;
}

.menu-title {
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #4f8cff 0%, #2563eb 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
}

.menu-divider {
    height: 2px;
    background: linear-gradient(90deg, 
        rgba(79, 140, 255, 0) 0%,
        rgba(79, 140, 255, 0.2) 50%,
        rgba(79, 140, 255, 0) 100%
    );
    margin-top: 16px;
}

.menu-item {
    border-right: none !important;
    font-size: 16px !important;
    font-weight: 500;
    margin: 4px 12px;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 48px !important;
    padding: 0 16px;
}

.menu-item span {
    font-size: 15px;
    letter-spacing: 0.3px;
}

.el-icon {
    font-size: 20px;
    transition: transform 0.3s ease;
    margin-right: 12px;
}

.custom-icon {
    width: 36px;
    height: 36px;
    margin-left: -8px;
    margin-right: 8px;
    transition: transform 0.3s ease;
}

/* Рекомендации */
.recommendations {
    padding: 0 0px;
    animation: fadeIn 0.4s ease-out;
    width: 68% !important; 

}

.recommendations-title {
    display: flex;
    align-items: center;
    gap:  3px;
    margin: 0 0 16px 8px;
    font-size: 18px;
    font-weight: 600;
    background: linear-gradient(135deg, #4f8cff 0%, #2563eb 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.recommendation-card {
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 0px;
    font-weight: 600;
    padding: 16px;
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 8px 8px;
}

.card-content p {
    margin: 0;
    color: var(--el-text-color-secondary);
    line-height: 1.6;
    font-size: 14px;
}

.action-button {
    align-self: flex-start;
    border-radius: 10px;
    font-weight: 500;
    padding: 8px 16px;
    height: auto;
    transition: all 0.2s ease;
}

.action-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

/* Темная тема */
html.dark .el-menu-vertical-demo {
    color: #E5EAF3;
    background: rgba(22, 27, 34, 0.85);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

html.dark .recommendation-card {
    background: rgba(22, 27, 34, 0.85);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

html.dark .card-content p {
    color: #8b949e;
}

html.dark .menu-item:hover {
    background: rgba(79, 140, 255, 0.15) !important;
}

html.dark .menu-item.is-active {
    background: linear-gradient(90deg, rgba(79, 140, 255, 0.25) 0%, rgba(37, 99, 235, 0.15) 100%) !important;
    color: #4f8cff !important;
}

html.dark .custom-icon {
    filter: invert(1);
}

/* Светлая тема */
html:not(.dark) .el-menu-vertical-demo {
    color: #1f2937;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

html:not(.dark) .recommendation-card {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

html:not(.dark) .menu-item:hover {
    background: rgba(79, 140, 255, 0.08) !important;
}

html:not(.dark) .menu-item.is-active {
    background: linear-gradient(90deg, rgba(79, 140, 255, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%) !important;
    color: #3182ce !important;
}

/* Анимации */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

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

.menu-item:hover {
    transform: translateX(5px);
}

.menu-item:hover .el-icon,
.menu-item:hover .custom-icon {
    transform: scale(1.1);
}

.menu-item:active {
    transform: scale(0.98) translateX(5px);
}

.recommendation-card:hover {
    transform: translateY(-2px);
}

/* Стили ссылок */
a {
    color: inherit !important;
    cursor: pointer !important;
    text-decoration: none !important;
    display: block;
}
</style>