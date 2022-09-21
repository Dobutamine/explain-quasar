const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/LogInPage.vue") }],
  },
  {
    path: "/start",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/StartupPage.vue") }],
  },
  {
    path: "/charts",
    component: () => import("layouts/PageLayout.vue"),
    children: [{ path: "", component: () => import("pages/ChartsPage.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
