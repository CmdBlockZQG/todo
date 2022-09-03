import { createRouter, createWebHashHistory } from "vue-router"

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/home',
      component: () => import('./views/Home/Frame.vue'),
      children: [
        {
          path: '/',
          component: () => import('./views/Home/Day.vue'),
          meta: { navActive: 'day' }
        },
        {
          path: '/event',
          component: () => import('./views/Home/Event.vue'),
          meta: { navActive: 'event' }
        },
        {
          path: '/plan',
          component: () => import('./views/Home/Plan.vue'),
          meta: { navActive: 'plan' }
        },
        {
          path: '/setting',
          component: () => import('./views/Home/Setting.vue'),
          meta: { navActive: 'setting' }
        },
      ]
    },
    {
      path: '/course',
      children: [
        {
          path: '',
          component: () => import('./views/Course/Course.vue')
        },
        {
          path: 'new',
          component: () => import('./views/Course/New.vue')
        },
        {
          path: 'edit/:_id',
          component: () => import('./views/Course/Edit.vue')
        }
      ]
    }
  ]
})

export default router
