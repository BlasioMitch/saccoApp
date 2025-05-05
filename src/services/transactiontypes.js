import axios from "axios"

const baseUrl = 'http://localhost:3001/api/auth'

// GET ALL
const getAllTransactiontypes = () => {
    const request = axios.get(`${baseUrl}/transactiontypes/`)
    return request.then(response => response.data)

}
// GET ONE
const getOneTransactiontype = (id) => {
    const request = axios.get(`${baseUrl}/transactiontypes/${id}/`)
    return request.then(response => response.data)
}
// UPDATE
const updateTransactiontype = (id, object) =>{
    const request = axios.patch(`${baseUrl}/transactiontypes/${id}/`, object)
    return request.then(response => response.data)
}
// CREATE
const createTransactiontype = (object) => {
    const request = axios.post(`${baseUrl}/transactiontypes/`, object)
    return request.then(response => response.data)
}
// DELETE

const deleteTransactiontype = (id) => {
    const request = axios.delete(`${baseUrl}/transactiontypes/${id}/`)
    return request.then(response => response.data)
}

export default {
    getAllTransactiontypes, 
    getOneTransactiontype, 
    updateTransactiontype, 
    createTransactiontype, 
    deleteTransactiontype
}