<script setup>
import { ref, reactive, computed, onMounted }  from 'vue'
import { postStore } from '../../stores/postStore';
import { toast } from 'vue3-toastify';
import { usePost } from '../../service/post';
import { useRouter, useRoute } from 'vue-router'
import { Modal, Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'flowbite-vue'
import Editor from '@tinymce/tinymce-vue'


const route = useRoute()
const post_id = route.params.id
const post = ref('');
const comments = ref([])

onMounted(async ()=>{
    usePost.getOne(post_id).then((res)=>{
        post.value = res.data
    })
    usePost.comments(post_id).then((res)=>{
        comments.value = res.data
    })
})


</script>

<template>
  
  <div class="p-3">
    <h2 class="uppercase dark:text-white text-gray-900 font-bold mb-3">{{post.title}}</h2>

    <h3>Comments:</h3>

    <div v-for="el in comments" :key="el.id" class="border ml-2 m-2">
        <p>{{el.content}}</p>
        <p class="text-[13px]">from: {{el.username}} - <span>{{el.createdAt.substring(0,10)}}</span></p>
    </div>


    <section class=" p-0 sm:p-5 md:p-0 md:py-4">

    </section>

    </div>

</template>

<style lang="scss" scoped></style>
