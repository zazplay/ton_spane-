import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from './components/Page/AuthPage/AuthPage.vue';
import MainPage from './components/Page/MainPage.vue';
import AdminPanel from './components/Page/AdminPanel/AdminPanel.vue';

const getThemeByTime = () => {
  const hours = new Date().getHours();
  return hours >= 6 && hours < 16 ? 'light' : 'dark';
};

const routes = [
  { path: '/', redirect: '/app/tape' }, // Изменяем редирект на ленту вместо auth
  { 
    path: '/admin', 
    component: AdminPanel,
    meta: { publicAccess: true }
  },
  { path: '/admin-auth', component: () => import('./components/Page/AdminPanel/authAdmin.vue') },
  { path: '/auth', component: AuthPage },
  {
    path: '/app',
    component: MainPage,
    children: [
      { 
        path: 'tape', 
        component: () => import('./components/Page/TapePage.vue'),
        meta: { publicAccess: true } // Помечаем как публичный маршрут
      },
      { 
        path: 'user/:id',
        component: () => import('./components/Page/UserPage/UserPage.vue'),
        name: 'userProfile',
        meta: { publicAccess: true } // Помечаем как публичный маршрут
      },
      // Защищенные маршруты
      { path: 'notifications', component: () => import('./components/Page/NotificationsPage.vue') },
      { path: 'clips', component: () => import('./components/Page/ClipsPage.vue') },
      { path: 'message', component: () => import('./components/Page/Chats/ChatsPage.vue') },
      { path: 'search', component: () => import('./components/Page/SearchPage.vue') },
      { path: 'purchased', component: () => import('./components/Page/PurchasedPage.vue') },
      { path: 'more', component: () => import('./components/Page/More/MorePage.vue') },
      { 
        path: 'tape/popular', 
        component: () => import('./components/Page/PopularTapes.vue'),
        meta: { publicAccess: true } // Помечаем как публичный маршрут
      },
      {
        path: 'userSubscribeDonate/:id',
        component: () => import('./components/Page/UserSubsribeModal/UserSubscribe.vue'),
        name: 'userSubscribe',
      },
      {
        path: 'userSubscribeDonateYear/:id',
        component: () => import('./components/Page/UserYearSubPage/YearSubPage.vue'),
        name: 'userSubscribeYear',
      },
      {
        path: 'myPage/:id',
        component: () => import('./components/Page/AuthUserPage/AuthUserPage.vue'),
        name: 'myPage',
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Единый guard для обработки авторизации и темы
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('authToken');
  const isAdmin = sessionStorage.getItem('adminToken');

  // Обработка тем
  if (to.path === '/admin' || to.path === '/admin-auth') {
    document.documentElement.className = 'dark';
    localStorage.setItem('theme', 'dark');
  } else {
    const savedTheme = localStorage.getItem('theme') || getThemeByTime();
    document.documentElement.className = savedTheme;
  }

  // Публичные роуты, доступные без авторизации
  const publicRoutes = ['/auth', '/admin-auth'];
  
  // Проверка для админ-панели
  if (to.path === '/admin') {
    if (!isAdmin) {
      next('/admin-auth');
      return;
    }
  }

  // Проверяем, является ли маршрут публичным через meta
  const isPublicRoute = to.matched.some(record => record.meta.publicAccess);

  // Если маршрут публичный - пропускаем без проверки авторизации
  if (isPublicRoute) {
    next();
    return;
  }

  // Если пользователь авторизован и пытается зайти на страницу авторизации,
  // перенаправляем на главную
  if (to.path === '/auth' && isAuthenticated) {
    next('/app/tape');
    return;
  }

  // Проверка авторизации для защищенных маршрутов
  if (!publicRoutes.includes(to.path) && !isPublicRoute) {
    if (!isAuthenticated) {
      next('/auth');
      return;
    }
  }

  next();
});

export default router;