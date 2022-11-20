
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') },
      { path: '/front', component: () => import('pages/FrontPage.vue') },
      { path: '/admin', component: () => import('src/pages/DashboardAdmin.vue') },
      { path: '/user', component: () => import('pages/UserPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      { path: '/register', component: () => import('pages/RegisterPage.vue') },
      { path: '/payment', component: () => import('pages/PaymentPage.vue') },
      { path: '/method', component: () => import('pages/AdminPage.vue') },
      { path: '/listuser', component: () => import('pages/ListUserPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
