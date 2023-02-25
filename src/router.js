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
          component: () => import('./views/Home/Today.vue')
        }
      ]
    },
    {
      path: '/test',
      component: () => import('./views/Test.vue')
    }
  ]
})

export default router