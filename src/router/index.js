import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../pages/LoginPage.vue';
import TasksPage from '../pages/TasksPage.vue';
import PomodoroPage from '../pages/PomodoroPage.vue';
import SessionsPage from '../pages/SessionsPage.vue';
import SignupPage from "../pages/SignupPage.vue";
import AdminPage from "../pages/AdminPage.vue";
import AiHelperPage from "../pages/AiHelperPage.vue";

const routes = [
  { path: "/login", component: LoginPage, meta: { public: true } },
  { path: "/signup", component: SignupPage, meta: { public: true } },
  { path: "/tasks", component: TasksPage },
  { path: "/pomodoro", component: PomodoroPage },
  { path: "/sessions", component: SessionsPage },
  { path: "/admin", component: AdminPage },
  { path: "/ai", component: AiHelperPage },

  { path: "/:catchAll(.*)", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// auth guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  // public pages
  if (to.meta.public) {
    return next();
  }
  // protected pages
  if (!token) {
    return next("/login");
  }
  next();
});

export default router;
