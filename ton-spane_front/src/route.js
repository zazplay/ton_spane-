import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from './components/Page/AuthPage/AuthPage.vue';
import MainPage from './components/Page/MainPage.vue';
import AdminPanel from './components/Page/AdminPanel/AdminPanel.vue';

const getThemeByTime = () => {
  const hours = new Date().getHours();
  return hours >= 6 && hours < 16 ? 'light' : 'dark';
};

const routes = [
  { path: '/', redirect: '/auth' },
  { 
    path: '/admin', 
    component: AdminPanel,
    beforeEnter: (to, from, next) => {
      const isAdmin = sessionStorage.getItem('adminToken');
      if (!isAdmin) {
        next('/admin-auth');
        return;
      }
      next();
    }
  },
  { path: '/admin-auth', component: () => import('./components/Page/AdminPanel/authAdmin.vue') },
  { path: '/auth', component: AuthPage },
  {
    path: '/app',
    component: MainPage,
    children: [
      { path: 'tape', component: () => import('./components/Page/TapePage.vue') },
      { path: 'notifications', component: () => import('./components/Page/NotificationsPage.vue') },
      { path: 'clips', component: () => import('./components/Page/ClipsPage.vue') },
      { path: 'message', component: () => import('./components/Page/Chats/ChatsPage.vue') },
      { path: 'search', component: () => import('./components/Page/SearchPage.vue') },
      { path: 'purchased', component: () => import('./components/Page/PurchasedPage.vue') },
      { path: 'more', component: () => import('./components/Page/More/MorePage.vue') },
      
      {
        path: 'user/:id',
        component: () => import('./components/Page/UserPage/UserPage.vue'),
        name: 'userProfile',
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

  // Обработка авторизации
  if (to.path === '/admin' && !isAdmin) {
    next('/admin-auth');
    return;
  }

  if (to.path.startsWith('/app') && !isAuthenticated) {
    next('/auth');
    return;
  }

  next();
});

export default router;