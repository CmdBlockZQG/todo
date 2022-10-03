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
      path: '/preview',
      component: () => import('./views/Preview.vue')
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
        },
        {
          path: 'hour',
          component: () => import('./views/Course/Hour.vue')
        },
        {
          path: 'period',
          component: () => import('./views/Course/Period.vue')
        }
      ]
    },
    {
      path: '/event',
      children: [
        {
          path: 'new',
          component: () => import('./views/Event/New.vue')
        },
        {
          path: 'newR',
          component: () => import('./views/Event/NewR.vue')
        },
        {
          path: 'edit/:_id',
          component: () => import('./views/Event/Edit.vue')
        },
        {
          path: 'editR/:_id',
          component: () => import('./views/Event/EditR.vue')
        }
      ]
    },
    {
      path: '/plan',
      children: [
        {
          path: 'new',
          component: () => import('./views/Plan/New.vue')
        },
        {
          path: 'edit/:_id',
          component: () => import('./views/Plan/Edit.vue')
        }
      ]
    }
  ]
})

export default router
