import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Contact from '../views/Contact/Contact.vue'
import Project from '../views/Project/Project.vue'
import Login from '../views/Login/Login.vue'
import Error from '../views/Error/Error.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
      children:[
        {
          path: '/contact',
          name: 'contact',
          component: Contact,
        },
        {
          path: '/project',
          name: 'project',
          component: Project,
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/:pathMatch(.*)*',
      name: "Error",
      component: Error
    }
  ],
  
})
router.beforeEach((to, from, next)=>{
  let token = localStorage.getItem('token');
  if(to.name !== "login" && !token){
    next({name: 'login'})
  }else{
    next()
  }
})
export default router
