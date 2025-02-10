import axios from "axios"

const baseUrl = 'http://localhost:8000/api'

// GET ALL
const getAllTransactions = () => {
    const request = axios.get(`${baseUrl}/transactions/`)
    return request.then(response => response.data)

}
// GET ONE
const getOneTransaction = (id) => {
    const request = axios.get(`${baseUrl}/transactions/${id}/`)
    return request.then(response => response.data)
}
// UPDATE
const updateTransaction = (id, object) =>{
    const request = axios.patch(`${baseUrl}/transactions/${id}/`, object)
    return request.then(response => response.data)
}
// CREATE
const createTransaction = (object) => {
    const request = axios.post(`${baseUrl}/transactions/`, object)
    return request.then(response => response.data)
}
// DELETE

const deleteTransaction = (id) => {
    const request = axios.delete(`${baseUrl}/transactions/${id}/`)
    return request.then(response => response.data)
}

export default {getAllTransactions, getOneTransaction, updateTransaction, createTransaction, deleteTransaction}