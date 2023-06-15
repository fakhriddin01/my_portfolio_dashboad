<script setup>
import Sidebar from '../components/Sidebar/Sidebar.vue'
</script>

<template>
  <main>
    <section id="main" class="w-full h-[100vh] bg-gray-100">
      <Sidebar />
      <div class="p-4 sm:ml-64 ">
        <div
          class="bg-gray-100 "
        >
        <router-view></router-view>
        </div>
      </div>
    </section>
  </main>
</template>
