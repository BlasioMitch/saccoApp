import axios from "axios";

const baseUrl = 'http://localhost:8000/api'

const createUser = (userData) =>{
    const request = axios.post(`${baseUrl}/users/`, userData)
    return request.then(response => response.data)
}

const getAllUsers = () => {
    const request = axios.get(`${baseUrl}/users/`)
    return request.then(response => response.data)
}

const getOneUser = (id) =>{
    const request =  axios.get(`${baseUrl}/users/${id}/`)
    return request.then(response => response.data)
}
const patchUser =  (id,userData) => {
    const request = axios.patch(`${baseUrl}/users/${id}/`,userData)
    return request.then(response => response.data)
}
const deleteUser =  (id) => {
    const request = axios.delete(`${baseUrl}/users/${id}/`)
    return request.then(response => response.data)
}

export default { createUser, getAllUsers, getOneUser, patchUser,deleteUser}