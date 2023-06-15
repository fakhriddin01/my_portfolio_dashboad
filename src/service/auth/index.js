import axios from '../axios'


export const useAuth = (user) => axios.post("/admin/login", user)