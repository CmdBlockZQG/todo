import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/home',
      component: () => import('./views/Home/Frame.vue'),
      children: [
        {
          path: '/',
          component: () => import('./views/Home/Today.vue'),
          meta: { navActive: 'today' }
        },
        {
          path: '/work',
          component: () => import('./views/Home/Work.vue'),
          meta: { navActive: 'work' }
        },
        {
          path: '/plan',
          component: () => import('./views/Home/Plan.vue'),
          meta: { navActive: 'plan' }
        },
        {
          path: '/overview',
          component: () => import('./views/Home/Overview.vue'),
          meta: { navActive: 'overview' }
        }
      ]
    },
    {
      path: '/setting',
      component: () => import('./views/Setting/Setting.vue'),
    },
    {
      path: '/setting/course',
      component: () => import('./views/Setting/Course.vue'),
    },
    {
      path: '/test',
      component: () => import('./views/Test.vue')
    }
  ]
})

export default router
