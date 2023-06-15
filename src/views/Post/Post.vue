<template>
    <div class="">
        <editor
        api-key="btnsqnwn9qu0mgsxznu75hb8a8honb6au5fb7754s45ltexx"
        v-model="content"
        :init="{
            menubar: false,
            plugins: 'lists link image emoticons',
            toolbar:
            'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
            toolbar:
            'undo redo | blocks fontsize | emoticons bold italic underline strikethrough  | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight checklist numlist bullist  | charmap | removeformat'
        }"
        />
    </div>
    <p>{{content}}</p>
</template>

<script setup>
import Editor from '@tinymce/tinymce-vue'
import {ref} from 'vue'
const content = ref('')
</script>

<style lang="" scoped>

</style>