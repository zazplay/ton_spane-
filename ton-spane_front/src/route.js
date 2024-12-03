import { createRouter, createWebHistory } from 'vue-router';
import NotificationsPage from './components/NotificationsPage.vue';
import TapeComponent from './components/TapeComponent.vue';
import ClipsPage from './components/ClipsPage.vue';
import MessagePage from './components/MessagePage.vue';

const routes = [
  { path: '/',redirect: '/tape'},

  { path: '/tape',  component: TapeComponent },
  { path: '/notifications', component: NotificationsPage },
  { path: '/clips', component: ClipsPage },
  { path: '/message', component: MessagePage },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
