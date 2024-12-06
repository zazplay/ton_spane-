import { createRouter, createWebHistory } from 'vue-router';
import NotificationsPage from './components/Page/NotificationsPage.vue';
import ClipsPage from './components/Page/ClipsPage.vue';
import MessagePage from './components/Page/Message/MessagePage.vue';
import TapePage from './components/Page/TapePage.vue';
import SearchPage from './components/Page/SearchPage.vue';
import PurchasedPage from './components/Page/PurchasedPage.vue';
import MorePage from './components/Page/More/MorePage.vue';
import userTemplate from './components/Page/UserPage/UserPage.vue';
import UserSubscribe from './components/Page/UserSubsribeModal/UserSubscribe.vue';
// import AuthPage from './components/Page/AuthPage/AuthPage.vue';

const routes = [
  // { path: '/auth', component: AuthPage },
  // { path: '/', redirect: '/auth' }, // Редирект на страницу авторизации
  
  { path: '/', redirect: '/tape' },
  
  { path: '/tape', component: TapePage },
  { path: '/notifications', component: NotificationsPage },
  { path: '/clips', component: ClipsPage },
  { path: '/message', component: MessagePage },
  { path: '/search', component: SearchPage },
  { path: '/purchased', component: PurchasedPage },
  { path: '/more', component: MorePage },
  { path: '/userTemplate', component: userTemplate },
  { path: '/userSubscribeDonate', component: UserSubscribe },
  { 
    path: '/user/:id', 
    component: userTemplate,
    name: 'userProfile'
  },
  // Маршрут для подписки/доната
  { 
    path: '/userSubscribeDonate/:id',
    component: UserSubscribe,
    name: 'userSubscribe'
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;