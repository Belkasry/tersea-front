// Composables
import {createRouter, createWebHistory} from "vue-router";
import {getMe, getToken, logout} from "@/helpers/token.helper";
import {config} from "@/services/axios.service";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/Login.vue"),
  },
  {
    path: "/password",
    name: "Password",
    component: () => import("@/views/auth/Password.vue"),
  },
  {
    path: "/",
    redirect: {path: "/admin"},
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "me",
        name: "Profile",
        component: () => import("@/views/employee/Profile.vue"),
        meta: {requiresRole: "employee"}
      },
      {
        path: "historique",
        name: "Historique",
        component: () => import("@/views/Historique.vue"),
        meta: {requiresRole: "admin"}
      },
      {
        path: "admin",
        name: "Admins",
        component: () => import("@/views/admin/List.vue"),
        meta: {requiresRole: "admin"}
      },
      {
        path: "employee",
        name: "Employees",
        component: () => import("@/views/employee/List.vue"),
        meta: {requiresRole: "admin"}
      },
      {
        path: "employee/:id",
        name: "Employee",
        component: () => import("@/views/employee/Show.vue"),
        meta: {requiresRole: "admin"}
      },
      {
        path: "company",
        name: "Companies",
        component: () => import("@/views/company/List.vue"),
        meta: {requiresRole: "admin"}
      },
      {
        path: "company/:id",
        name: "Company",
        component: () => import("@/views/company/Show.vue"),
        meta: {requiresRole: "admin"}
      },

    ],
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = getToken();
  const user = getMe();
  const requiresRole = to.matched.some(record => record.meta.requiresRole);

  if (requiresRole && user && to.meta.requiresRole !== user.role) {
    if (user.role == 'admin') {
      next("/admin");
    } else if (user.role == 'employee') {
      next("/me");
    }
  }

  if (to.path === "/login" || to.path === "/password") {
    next();
  } else if (to.path === "/logout") {
    logout();
    next("/login");
  } else if (!token) {
    next("/login");
  } else {
    next();
  }
});


export default router;

