import axios from "../axios";

export const usePost = {
    create: (state) => axios.post("/post", state, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        maxContentLength: "infinity",
        maxBodyLength: "infinity", 
    }),
    list : () => axios.get(`/post`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    remove: (id)=> axios.delete(`/post/${id}`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    update: (id, state)=> axios.patch(`/post/${id}`, state, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    
}
