// การืำ routing frontend
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomePage.vue') // set home as path '/'
  },
  //การสร้างpath ใหม่สำหรับหน้า create new blog
  {
    path: '/blog/create',
    name: 'Create new blog',
    component: () => import('./views/blogs/CreateBlog.vue') // set create blog as path '/blog/create'
  },
  {
    path: '/detail/:id',
    name: 'blog detail',
    component: () => import('./views/blogs/BlogDetail.vue') // set create blog as path '/blog/create'
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router