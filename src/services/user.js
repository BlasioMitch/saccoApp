import axios from "axios";

// const baseUrl = 'http://localhost:3001'
const baseUrl = 'http://localhost:8000/api'

const createUser = (userData) =>{
    const request = axios.post(`${baseUrl}/users/`, userData)
    return request.then(response => response.data)
}

const getAllUsers = () => {
    const request = axios.get(`${baseUrl}/users/`)
    return request.then(response => response.data)
}

const getOneUser = async (id) =>{
    const response = await axios.get(`${baseUrl}/users/${id}`)
    return response
}
const patchUser = async (id,userData) => {
    const response = await axios.patch(`${baseUrl}/users/${id}`,userData)
    return response
}
const deleteUser = async (id) => {
    const response =await axios.delete(`${baseUrl}/users/${id}`)
    return response
}

export default { createUser, getAllUsers, getOneUser, patchUser,deleteUser}