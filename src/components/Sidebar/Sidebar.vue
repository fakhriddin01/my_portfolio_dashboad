<script setup>
import {ref, onMounted} from 'vue'
import { navLinks } from '../../constants/navlinks';
import {useRouter} from "vue-router";

const router = useRouter();
const navlink = ref(navLinks)

const logout=()=>{
  localStorage.clear();
  router.push({name:"login"})
}

onMounted(() => {

});
</script>

<template>
  <div>
    
    <aside
      class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 "
      aria-label="Sidebar"
    >
      <div class="h-full px-3 py-4 overflow-y-auto bg-[#03111B] text-white">
        <ul class="space-y-2 font-medium">
          <li v-for="link in navlink" :key="link.id">
            <router-link 
              :to="link.link"  
              class="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 hover:text-black"
            >
              <i :class="link.icon"></i>
              <span class="ml-3">{{link.title}}</span>
            </router-link>
          </li>
        </ul>
        <button @click="logout" class="flex justify-center items-center gap-2 bg-red-500 px-3 py-2 rounded-xl focus:ring-4 ring-gray-500 text-white absolute bottom-3"><i class='bx bx-log-out text-[20px]'></i> Logout</button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.router-link-active{
  border: 1px solid rgb(128, 128, 128, 0.586);
  background-color: rgb(255 255 255);
  color: black
}
</style>
