import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from './components/Page/AuthPage/AuthPage.vue';
import MainPage from './components/Page/MainPage.vue';
import AdminPanel from './components/Page/AdminPanel/AdminPanel.vue';

const getThemeByTime = () => {
  const hours = new Date().getHours();
  return hours >= 6 && hours < 16 ? 'light' : 'dark';
};

const routes = [
  { path: '/', redirect: '/app/tape' }, // Редирект на ленту
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
        meta: { publicAccess: true } // Публичный маршрут
      },
      { 
        path: 'user/:id',
        component: () => import('./components/Page/UserPage/UserPage.vue'),
        name: 'userProfile',
        meta: { publicAccess: true } // Публичный маршрут
      },
      { 
        path: 'search', 
        component: () => import('./components/Page/SearchPage.vue'),
        meta: { publicAccess: true } // Публичный маршрут для поиска
      },
      { 
        path: 'tape/popular', 
        component: () => import('./components/Page/PopularTapes.vue'),
        meta: { publicAccess: true } // Публичный маршрут популярных лент
      },
      // Защищенные маршруты
      { 
        path: 'notifications', 
        component: () => import('./components/Page/NotificationsPage.vue'),
        meta: { requiresAuth: true }
      },
      { 
        path: 'clips', 
        component: () => import('./components/Page/ClipsPage.vue'),
        meta: { requiresAuth: true }
      },
      { 
        path: 'message', 
        component: () => import('./components/Page/Chats/ChatsPage.vue'),
        meta: { requiresAuth: true }
      },
      { 
        path: 'purchased', 
        component: () => import('./components/Page/PurchasedPage.vue'),
        meta: { requiresAuth: true }
      },
      { 
        path: 'more', 
        component: () => import('./components/Page/More/MorePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'userSubscribeDonate/:id',
        component: () => import('./components/Page/UserSubsribeModal/UserSubscribe.vue'),
        name: 'userSubscribe',
        meta: { publicAccess: true } // Публичный маршрут для поиска
      },
      {
        path: 'userSubscribeDonateYear/:id',
        component: () => import('./components/Page/UserYearSubPage/YearSubPage.vue'),
        name: 'userSubscribeYear',
        meta: { publicAccess: true } // Публичный маршрут для поиска
      },
      {
        path: 'myPage/:id',
        component: () => import('./components/Page/AuthUserPage/AuthUserPage.vue'),
        name: 'myPage',
        meta: { requiresAuth: true }
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

// Роутер с обработкой авторизации и темы
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

  // Публичные роуты
  
  // Проверка для админ-панели
  if (to.path === '/admin') {
    if (!isAdmin) {
      next('/admin-auth');
      return;
    }
  }

  // Проверка публичного маршрута через мета-тег
  const isPublicRoute = to.matched.some(record => record.meta.publicAccess);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Пропуск публичных маршрутов без проверки авторизации
  if (isPublicRoute) {
    next();
    return;
  }

  // Редирект авторизованного пользователя со страницы входа
  if (to.path === '/auth' && isAuthenticated) {
    next('/app/tape');
    return;
  }

  // Проверка авторизации для защищенных маршрутов
  if (requiresAuth && !isAuthenticated) {
    // Вызываем глобальное событие для показа модального окна авторизации
    window.dispatchEvent(new CustomEvent('show-auth-modal', { 
      detail: { 
        targetRoute: to.fullPath 
      } 
    }));
    next('/app/tape'); // Временный редирект, пока не реализована модалка
    return;
  }

  next();
});

export default router;