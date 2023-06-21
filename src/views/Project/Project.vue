<script setup>
import {ref, reactive, computed, onMounted} from 'vue'
import { projectStore } from '../../stores/projectStore';
import { toast } from 'vue3-toastify';
import { useProject } from '../../service/project';
import {useRouter} from 'vue-router'
import { Modal } from 'flowbite-vue'

const isShowModal = ref(false)
function closeModal() {
  isShowModal.value = false
  localStorage.removeItem('delete_id')
}

function showModal(delete_id) {
    localStorage.setItem('delete_id', delete_id)
    isShowModal.value = true
}
const modal2 = ref(false)

function closeModal2() {
  modal2.value = false
  localStorage.removeItem('')
}

function toggleModal2() {
    modal2.value = !modal2.value
}
function showModal2() {
    // localStorage.setItem('delete_id', delete_id)
    modal2.value = true
}

const router = useRouter();

const store = projectStore();
const modal = ref(false);
const isUpdate = ref(false);
let computedList = ref([])


const contactInfo = reactive({
    name: '',
    link: '',
    description: '',
    tag: '',
    workLink: '',

})


const toggleModal = () => {
    if(modal.value){
        isUpdate.value = false
        contactInfo.name=''
        contactInfo.link=''
        contactInfo.description=''
        contactInfo.tag=''
        contactInfo.workLink=''
    }
    modal.value = !modal.value
}

const updateList = () => {
    useProject.list().then((res)=>{
        store.state.list = res.data    
    }).catch((error)=>{
        if(error.message == 'Request failed with status code 401' || error.message == 'token expired' || error.message == 'token not found'){
            router.push({name: 'login'})
        }
        else{
            toast.error('error');
        }
        console.log(error.message);
    })
}


const addContact=(evet)=>{
    evet.preventDefault();
    const contact = {
        name: contactInfo.name,
        link: contactInfo.link,
        description: contactInfo.description,
        tag: contactInfo.tag,
        workLink: contactInfo.workLink
    }
    console.log(contact);
    useProject.create(contact).then((res)=>{
        if(res.status == 201){
            toast.success('successfully added contact !', {autoClose: 1500, theme: 'dark', pauseOnHover: false})
            contactInfo.name=''
            contactInfo.link=''
            contactInfo.description=''
            contactInfo.tag=''
            contactInfo.workLink=''
            toggleModal()
            updateList();
        }
    }).catch((error)=>{
        if(error.message == 'Request failed with status code 401' || error.message == 'token expired' || error.message == 'token not found'){
            router.push({name: 'login'})
        }
        toast.error(error.message)
    })

}

const modifyContact=(event)=>{
    event.preventDefault();
    const id  = localStorage.getItem('id')
    const contact = {
        name: contactInfo.name,
        link: contactInfo.link,
        description: contactInfo.description,
        tag: contactInfo.tag,
        workLink: contactInfo.workLink
    }


    useProject.update(id, contact).then((res)=>{
        if(res.status == 200){
            toast.success('successfully updated contact !', {autoClose: 1000, theme: 'dark', pauseOnHover: false})
            contactInfo.name=''
            contactInfo.link=''
            contactInfo.description=''
            contactInfo.tag=''
            contactInfo.workLink=''
            isUpdate.value = false;
            updateList();
            toggleModal()
        }
    }).catch((error)=>{
        if(error.message == 'Request failed with status code 401' || error.message == 'token expired' || error.message == 'token not found'){
            router.push({name: 'login'})
        }
        toast.error(error.message)
    })

}

const removeContact=()=>{
    const id = localStorage.getItem('delete_id')
    console.log(id);
    useProject.remove(id).then((res)=>{
        if(res.status == 200){
            toast.success('deleted',{autoClose: 1000})
            updateList();
            closeModal()
        }
    }).catch((error)=>{
        console.log(error);
    })
}

const updateContact = (id)=>{
    localStorage.setItem('id', id)
    isUpdate.value = true;
    const foundContact = store.findOne(id)
    contactInfo.name = foundContact[0].name
    contactInfo.link = foundContact[0].link
    contactInfo.description = foundContact[0].description
    contactInfo.tag = foundContact[0].tag
    contactInfo.workLink = foundContact[0].workLink
    toggleModal();
}

computedList = computed(()=> {
    return store.state.list;
})

onMounted(()=>{
    updateList()
})

const addImage = (id)=> {
    toggleModal2()
    localStorage.setItem('project_id', id)
}

let  formdata 

const uploadImage = e => {
    e.preventDefault()
    formdata = new FormData();
    formdata.append('file', e.target.files[0])
}

const updateImage = (event) =>{
    event.preventDefault();
    const id = localStorage.getItem('project_id');
    useProject.updateImage(id, formdata).then((res)=>{
        toggleModal2()
        updateList()
    }).catch((error)=>{
        if(error.message == 'Request failed with status code 401' || error.message == 'token expired' || error.message == 'token not found'){
            router.push({name: 'login'})
        }
        console.log(error);
        toast.error(error.message)
    })
}

</script>

<template>


    
  
  <div class="p-3">
    <h2 class="uppercase dark:text-white text-gray-900 font-bold">My Projects</h2>

    <!-- Main modal -->
    <div tabindex="-1" aria-hidden="true" class="overflow-y-auto flex bg-[rgba(0,0,0,0.4)] overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full" :class="modal ? '' : 'hidden'">
        
        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
            <!-- Modal content -->
            <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <!-- Modal header -->
                <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        <span v-if="!isUpdate">Create new project</span>
                        <span v-else>Update project</span>
                    </h3>
                    <button @click='toggleModal' type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <form >
                    <div class="grid gap-4 mb-4 sm:grid-cols-1">
                        <div>
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Project</label>
                            <input v-model="contactInfo.name" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Project name" required="">
                        </div>
                        <div>
                            <label for="link" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Project link</label>
                            <input v-model="contactInfo.link" type="text" name="link" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="link" required="">
                        </div>
                        <div>
                            <label for="icon" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <input v-model="contactInfo.description" type="text" name="icon"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Description" required="">
                        </div>
                        <div>
                            <label for="icon" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                            <input v-model="contactInfo.tag" type="text" name="icon"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tags" required="">
                        </div>
                        <div>
                            <label for="icon" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deployed link</label>
                            <input v-model="contactInfo.workLink" type="text" name="icon"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Deploy link" required="">
                        </div>
                   
                        
                    
                    </div>
                    <button v-if="!isUpdate" @click="addContact($event)" type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg class="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                        Create
                    </button>
                    <button v-else @click="modifyContact($event)" type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg class="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                        Update
                    </button>

                </form>
            </div>
        </div>
    </div>
    <!-- -------------------------end of modal------------------------------------- -->



<div tabindex="-1" aria-hidden="true" class="overflow-y-auto flex bg-[rgba(0,0,0,0.4)] overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full" :class="modal2 ? '' : 'hidden'">
        
        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
            <!-- Modal content -->
            <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <!-- Modal header -->
                <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                 
                    <button @click='toggleModal2' type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <form >
                    <div class="grid gap-4 mb-4 sm:grid-cols-1">
                       
                        <div>
                            <label for="icon" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
                            <input type="file" @change="uploadImage($event)"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 " placeholder="Upload image" required="">
                        </div>
                   
                        
                    
                    </div>
                  
                    <button @click="updateImage($event)" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg class="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                        Update
                    </button>

                </form>
            </div>
        </div>
    </div>







    <section class=" p-0 sm:p-5 md:p-0 md:py-4">

    <!-- ------------------------table-------------------------------------------- -->
    <div class="w-full max-w-screen-xl px-0 lg:p-0">
        <!-- Start coding here -->
        <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                
                    <button @click="toggleModal" type="button" class="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-6 py-2">
                        <i class='bx bx-plus-medical'></i>
                    </button>
                    
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-sm table-auto">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr class="text-left">
                            <th scope="col" class="px-4 py-3">Name:</th>
                            <th scope="col" class="px-4 py-3">Link:</th>
                            <th scope="col" class="px-4 py-3">Description:</th>
                            <th scope="col" class="px-4 py-3">Tags:</th>
                            <th scope="col" class="px-4 py-3">Deploy Link</th>
                            <th scope="col" class="px-4 py-3">Image</th>
                            <th scope="col" class="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="">
                        <tr v-for="(el, index) in computedList" :key="el.id" class="border-b dark:border-gray-700">
                            <td class="px-4 py-3">{{ el.name }}</td>
                            <td class="px-4 py-3">{{ el.link}}</td>
                            <td class="px-4 py-3">{{ el.description}}</td>
                            <td class="px-4 py-3">{{ el.tag}}</td>
                            <td class="px-4 py-3">{{ el.workLink}}</td>
                            <td class="px-4 py-3"><img :src="el.image" alt="no image" class="w-[45px] h-[45px]"></td>
                            
                            <td class="px-4 py-3 text-[20px]">
                                <div  class="bg-white rounded  shadow flex w-[155px]" >
                                    <button @click="addImage(el.id)" class="py-1 px-4 text-blue-600  hover:bg-gray-200 "><i class='bx bx-cloud-upload'></i></button>
                                    <button @click="updateContact(el.id)" class="py-1 px-4 text-green-400  hover:bg-gray-200 "><i class='bx bx-edit-alt'></i></button>
                                    <button @click="showModal(el.id)" class="py-1 px-4 text-red-500  hover:bg-gray-200 "><i class='bx bx-trash'></i></button>
                                </div>
                            </td>
                        </tr>
                     </tbody>
                </table>
            </div>
            
        </div>
    </div>
    <!-- -------------------------end of table------------------------------------- -->
   
     <Modal size="xl" v-if="isShowModal" @close="closeModal">
            <template #header>
                <div class="flex items-center text-lg text-red-600 ">
                    Warning!
                </div>
            </template>
            <template #body>
                <p class="text-base leading-relaxed">
                     Are you sure delete this position?
                </p>
                
            </template>
            <template #footer>
                <div class="flex justify-between">
                <button @click="closeModal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 ">
                    Decline
                </button>
                <button @click="removeContact" type="button" class="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                    Delete
                </button>
                </div>
            </template>                       
        
        </Modal>


    </section>


  


  </div>


</template>

<style lang="scss" scoped></style>
