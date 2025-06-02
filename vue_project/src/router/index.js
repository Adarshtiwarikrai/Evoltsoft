import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

import LandingView from '../views/LandingView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingView,
    meta: { requiresGuest: true, title: 'Welcome - ChargerApp' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true, title: 'Login - ChargerApp' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true, title: 'Register - ChargerApp' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, title: 'Dashboard - ChargerApp' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: 'Page Not Found - ChargerApp' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

let authInitialized = false;

router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = 'ChargerApp';
  }

  if (!authInitialized) {
    console.log("Router Guard: App instance loading. Attempting to initialize auth state from storage...");
    try {
      await store.dispatch('auth/initializeAuth');
      console.log("Router Guard: auth/initializeAuth completed. Current isAuthenticated:", store.getters['auth/isAuthenticated']);
    } catch (error) {
      console.error("Router Guard: Error during initial auth/initializeAuth:", error);
    }
    authInitialized = true;
  }

  const isAuthenticated = store.getters['auth/isAuthenticated'];
  console.log(`Router Guard: Navigating from '${from.name || 'initial load'}' to '${to.name}'. IsAuthenticated: ${isAuthenticated}`);

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      console.log(`Router Guard: Route '${to.name}' (path: ${to.fullPath}) requires auth. User NOT authenticated. Redirecting to Login.`);
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      });
    } else {
      console.log(`Router Guard: Route '${to.name}' requires auth. User IS authenticated. Allowing access.`);
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      console.log(`Router Guard: Route '${to.name}' (path: ${to.fullPath}) requires guest. User IS authenticated. Redirecting to Dashboard.`);
      next({ name: 'Dashboard' });
    } else {
      console.log(`Router Guard: Route '${to.name}' requires guest. User IS GUEST. Allowing access.`);
      next();
    }
  } else {
    console.log(`Router Guard: Route '${to.name}' (path: ${to.fullPath}) has no specific auth requirements. Allowing access.`);
    next();
  }
});

export default router;