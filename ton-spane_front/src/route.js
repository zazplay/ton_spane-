import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from './components/Page/AuthPage/AuthPage.vue';
import MainPage from './components/Page/MainPage.vue';
import AdminPanel from './components/Page/AdminPanel/AdminPanel.vue';

const routes = [

  { path: '/', redirect: '/auth' },
  { path: '/admin', component: AdminPanel },
  { path: '/auth', component: AuthPage },
  {
    path: '/app',
    component: MainPage, // Основное приложение
    children: [
      { path: 'tape', component: () => import('./components/Page/TapePage.vue') },
      { path: 'notifications', component: () => import('./components/Page/NotificationsPage.vue') },
      { path: 'clips', component: () => import('./components/Page/ClipsPage.vue') },
      { path: 'message', component: () => import('./components/Page/Message/MessagePage.vue') },
      { path: 'search', component: () => import('./components/Page/SearchPage.vue') },
      { path: 'purchased', component: () => import('./components/Page/PurchasedPage.vue') },
      { path: 'more', component: () => import('./components/Page/More/MorePage.vue') },
      {
        path: 'user-chat/:id',
        name: 'UserChat',
        component: () => import('./components/Page/Message/UserChat.vue'),
      },
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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('authToken'); // Пример проверки авторизации
  if (to.path.startsWith('/app') && !isAuthenticated) {
    next('/auth'); // Перенаправить на страницу авторизации
  } else {
    next(); // Разрешить переход
  }
});

export default router;
