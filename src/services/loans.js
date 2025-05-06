import api from './api'

const createLoan = (loanData) => {
    const request = api.post(`/loans`, loanData)
    return request.then(response => response.data)
}

const getAllLoans = () => {
    const request = api.get(`/loans`)
    return request.then(response => response.data)
}

const getOneLoan = (id) => {
    const request = api.get(`/loans/${id}`)
    return request.then(response => response.data)
}

const patchLoan = (id, loanData) => {
    const request = api.patch(`/loans/${id}`, loanData)
    return request.then(response => response.data)
}

const deleteLoan = (id) => {
    const request = api.delete(`/loans/${id}`)
    return request.then(response => response.data)
}

export default {
    createLoan, getAllLoans, getOneLoan, patchLoan, deleteLoan
}