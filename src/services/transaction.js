import api from './api'
// GET ALL
const getAllTransactions = () => {
    const request = api.get(`/transactions/`)
    return request.then(response => response.data)

}
// GET ONE
const getOneTransaction = (id) => {
    const request = api.get(`/transactions/${id}`)
    return request.then(response => response.data)
}
// UPDATE
const updateTransaction = (id, object) =>{
    const request = api.patch(`/transactions/${id}`, object)
    return request.then(response => response.data)
}
// CREATE
const createTransaction = (object) => {
    const request = api.post(`/transactions`, object)
    return request.then(response => response.data)
}
// DELETE

const deleteTransaction = (id) => {
    const request = api.delete(`/transactions/${id}`)
    return request.then(response => response.data)
}

export default {getAllTransactions, getOneTransaction, updateTransaction, createTransaction, deleteTransaction}