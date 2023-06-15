<script setup>
import {ref, reactive, computed, onMounted} from 'vue'
import { skillStore } from '../../stores/skillStore';
import { toast } from 'vue3-toastify';
import { useSkill } from '../../service/skill';
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

const router = useRouter();

const store = skillStore();
const modal = ref(false);
const isUpdate = ref(false);
let computedList = ref([])


const contactInfo = reactive({
    name: ''
})


const toggleModal = () => {
    if(modal.value){
        isUpdate.value = false
        contactInfo.name=''
        
    }
    modal.value = !modal.value
}

const updateList = () => {
    useSkill.list().then((res)=>{
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
    }

    useSkill.create(contact).then((res)=>{
        if(res.status == 201){
            toast.success('successfully added contact !', {autoClose: 1500, theme: 'dark', pauseOnHover: false})
            contactInfo.name=''
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
    }


    useSkill.update(id, contact).then((res)=>{
        if(res.status == 200){
            toast.success('successfully updated contact !', {autoClose: 1000, theme: 'dark', pauseOnHover: false})
            contactInfo.name=''
            
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
    useSkill.remove(id).then((res)=>{
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
    toggleModal();
}

computedList = computed(()=> {
    return store.state.list;
})

onMounted(()=>{
    updateList()
})

</script>

<template>
  
  <div class="p-3">
    <h2 class="uppercase dark:text-white text-gray-900 font-bold">My Skills</h2>

    <!-- Main modal -->
    <div tabindex="-1" aria-hidden="true" class="overflow-y-auto flex bg-[rgba(0,0,0,0.4)] overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full" :class="modal ? '' : 'hidden'">
        
        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
            <!-- Modal content -->
            <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <!-- Modal header -->
                <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        <span v-if="!isUpdate">Add new skill</span>
                        <span v-else>Update skill</span>
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
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Skill</label>
                            <input v-model="contactInfo.name" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Project name" required="">
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
                <table class="w-full text-sm">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr class="text-left">
                            <th scope="col" class="px-4 py-3">Name:</th>
                            <th scope="col" class="px-4 py-3">Actions:</th>
                        </tr>
                    </thead>
                    <tbody class="">
                        <tr v-for="(el, index) in computedList" :key="el.id" class="border-b dark:border-gray-700">
                            <td class="px-4 py-3">{{ el.name }}</td>
                           
                            <td class="px-4 py-3 text-[20px]">
                                <div  class="bg-white rounded  shadow flex w-[100px]" >
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
