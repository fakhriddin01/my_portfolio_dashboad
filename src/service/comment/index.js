import axios from "../axios";

export const useComment = {
    create: (state) => axios.post("/comment", state, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
    }),
    list : () => axios.get(`/comment/false`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    
    remove: (id)=> axios.delete(`/comment/${id}`, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    updateStatus: (id, state)=> axios.patch(`/comment/status/${id}`, state, {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }),
    
}
