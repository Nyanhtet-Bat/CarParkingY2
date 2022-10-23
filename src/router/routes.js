
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/FrontPage.vue') },
      { path: '/admin', component: () => import('pages/AdminPage.vue') },
      { path: '/user', component: () => import('pages/UserPage.vue') },
      { path: '/payment', component: () => import('pages/PaymentPage.vue') },
      { path: '/register', component: () => import('pages/RegisterPage.vue') },
      { path: '/payment', component: () => import('pages/PaymentPage.vue') }
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
