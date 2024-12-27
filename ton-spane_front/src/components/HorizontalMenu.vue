<template>
    <el-menu class='horizontal-menu' default-active="1"  >
        <router-link to="/app/tape">
            <el-menu-item index="1" >
                <el-icon>
                    <House />
                </el-icon>
                <span>Лента</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/clips">
            <el-menu-item index="2">
                <el-icon>
                    <Film />
                </el-icon>
                <span>Клипы</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/message">
            <el-menu-item index="3">
                <el-icon>
                    <Message />
                </el-icon>
                <span>Сообщения</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/search">
            <el-menu-item index="5">
                <el-icon>
                    <Search />
                </el-icon>
                <span>Поиск</span>
            </el-menu-item>
        </router-link>

        <router-link to="/app/more">
            <el-menu-item index="7">
                <el-icon>
                    <IconMenu />
                </el-icon>
                <span>Профиль</span>
            </el-menu-item>
        </router-link>
    </el-menu>
</template>

<script setup>
import { Menu as IconMenu, House, Film, Message, Search } from '@element-plus/icons-vue';

</script>

<style scoped>
/* Основные стили меню */
.horizontal-menu {
   height: 60px;
   position: fixed;
   bottom: 0;
   width: 101%;
   z-index: 1000;
   backdrop-filter: blur(10px);
   display: flex;
   justify-content: space-around;
   align-items: stretch;
   animation: slideUp 0.3s ease-out;
   padding-left: 0px;
   padding-right: 5px;
}

/* Темная тема для меню */
html.dark .horizontal-menu {
   background: rgba(22, 27, 34, 0.8);
   border-top: 1px solid rgba(255, 255, 255, 0.05);
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
   color: #E5EAF3;
}

/* Светлая тема для меню */
html:not(.dark) .horizontal-menu {
   background: rgba(255, 255, 255, 0.9);
   border-top: 1px solid rgba(0, 0, 0, 0.05);
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
   color: #1f2937;
}

/* Стили для ссылок-контейнеров */
.horizontal-menu a {
   flex: 1;
   display: flex;
   align-items: stretch;
   justify-content: center;
   color: inherit !important;
   text-decoration: none !important;
   min-width: 64px;
   max-width: 100px;
}

/* Стили элементов меню */
.horizontal-menu .el-menu-item {
   width: 80%;
   height: 50px !important;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   padding: 0 !important;
   margin: 4px 12px !important;
   border: none !important;
   gap: 6px;
   position: relative;
   border-radius: 12px;
   transition: all 0.3s ease;
   font-size: 18px !important;
   font-weight: bold;
}

/* Иконки */
.horizontal-menu .el-icon {
   font-size: 20px;
   width: 24px;
   height: 24px;
   display: flex;
   align-items: center;
   justify-content: center;
   transition: transform 0.3s ease;
}

/* Текст под иконками */
.horizontal-menu .el-menu-item span {
   font-size: 12px;
   font-weight: 500;
   text-align: center;
   width: 100%;
   line-height: 1;
   padding: 0 4px;
   margin: 0;
   letter-spacing: 0.3px;
}

/* Наведение - темная тема */
html.dark .horizontal-menu .el-menu-item:hover {
   background: rgba(79, 140, 255, 0.1) !important;
   color: #4f8cff !important;
   transform: translateX(5px);
}

/* Наведение - светлая тема */
html:not(.dark) .horizontal-menu .el-menu-item:hover {
   background: rgba(79, 140, 255, 0.08) !important;
   color: #2563eb !important;
   transform: translateX(5px);
}

/* Наведение иконки */
.horizontal-menu .el-menu-item:hover .el-icon {
   transform: scale(1.1);
}

/* Активное состояние - темная тема */
html.dark .horizontal-menu .el-menu-item.is-active {
   background: linear-gradient(90deg, rgba(79, 140, 255, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%) !important;
   color: #4f8cff !important;
}

/* Активное состояние - светлая тема */
html:not(.dark) .horizontal-menu .el-menu-item.is-active {
   background: linear-gradient(90deg, rgba(79, 140, 255, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%) !important;
   color: #3182ce !important;
}

/* Подчеркивание активного элемента */
html.dark .horizontal-menu .el-menu-item.is-active::after,
html:not(.dark) .horizontal-menu .el-menu-item.is-active::after {
   content: '';
   position: absolute;
   bottom: 0;
   left: 50%;
   transform: translateX(-50%);
   width: 40%;
   height: 3px;
   background: linear-gradient(90deg, #4f8cff 0%, #2563eb 100%);
   border-radius: 2px 2px 0 0;
   width: 90%;

}

/* Эффект при нажатии */
.horizontal-menu .el-menu-item:active {
   transform: scale(0.98) translateX(0px);
}

/* Safe area для iPhone */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
   .horizontal-menu {
       padding-bottom: env(safe-area-inset-bottom);
       height: calc(70px + env(safe-area-inset-bottom));
   }
   
   .horizontal-menu .el-menu-item {
       padding-bottom: env(safe-area-inset-bottom);
   }
}

/* Анимация появления */
@keyframes slideUp {
   from {
       transform: translateY(100%);
       opacity: 0;
   }
   to {
       transform: translateY(0);
       opacity: 1;
   }
}

/* Сброс стилей для ссылок */
.horizontal-menu a:-webkit-any-link {
   color: inherit !important;
   cursor: pointer !important;
   text-decoration: none !important;
   display: block;
}

.horizontal-menu router-link {
   color: inherit;
   text-decoration: none;
   cursor: pointer;
}
</style>