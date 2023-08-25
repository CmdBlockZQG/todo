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
          meta: { nav: 'today' }
        },
        {
          path: '/work',
          component: () => import('./views/Home/Work.vue'),
          meta: { nav: 'work' }
        },
        {
          path: '/plan',
          component: () => import('./views/Home/Plan.vue'),
          meta: { nav: 'plan' },
          children: [
            {
              path: '/plan',
              component: () => import('./views/Plan/Plan.vue'),
              meta: { tab: 'plan' }
            },
            {
              path: 'event',
              component: () => import('./views/Plan/Event.vue'),
              meta: { tab: 'event' }
            },
            {
              path: 'routine',
              component: () => import('./views/Plan/Routine.vue'),
              meta: { tab: 'routine' }
            },
          ]
        },
        {
          path: '/overview',
          component: () => import('./views/Home/Overview.vue'),
          meta: { nav: 'overview' }
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
