import Vue from 'vue';
import VueRouter from 'vue-router';
import AdvertView from '../views/Adverts.vue';
import IndexView from '../views/Index.vue';
import LoginView from '../views/Login.vue';
import ProfileView from '../views/Profile.vue';
import SignupView from '../views/Signup.vue';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index', component: IndexView },
  { path: '/adverts/:advertName', component: AdvertView },
  { path: '/login', component: LoginView },
  { path: '/profile', component: ProfileView },
  { path: '/signup', component: SignupView },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

// Setup Authentication guard
/* router.beforeEach((to, from, next) => {
  if (store.state.isAuthenticated || to.path === '/login') {
    next();
  } else {
    console.info('Unauthenticated user. Redirecting to login page.');
    next('/login');
  }
  });
  */
router.beforeEach((to, from, next) => {
  console.log('from:');
  console.log(from);
  if (!store.state.isAuthenticated && to.path === '/profile') {
    console.info('Unauthenticated user. Redirecting to login page.');
    next('/login');
  } else if (store.state.isAuthenticated && to.path === '/login') {
    next('/profile');
  } else {
    next();
  }
});

export default router;
