import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Contact from '../views/Contact/Contact.vue'
import Project from '../views/Project/Project.vue'
import Skill from '../views/Skill/Skill.vue'
import Login from '../views/Login/Login.vue'
import Error from '../views/Error/Error.vue'
import Language from '../views/Language/Language.vue'
import Experience from '../views/Experience/Experience.vue'
import Education from '../views/Education/Education.vue'
import Post from '../views/Post/Post.vue'
import PostItem from '../views/Post/PostItem.vue'
import Home from '../views/Home/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
      children:[
        {
          path: '/',
          name: 'home',
          component: Home,
        },
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
        {
          path: '/skill',
          name: 'skill',
          component: Skill,
        },
        {
          path: '/languages',
          name: 'language',
          component: Language,
        },
        {
          path: '/experience',
          name: 'experience',
          component: Experience,
        },
        {
          path: '/education',
          name: 'education',
          component: Education,
        },
        {
          path: '/posts',
          name: 'post',
          component: Post,
        },
        {
          path: '/posts/:id',
          name: 'post-item',
          component: PostItem,
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
