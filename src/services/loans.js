import axios from "axios"

const baseUrl = "http://localhost:8000/api"

const createLoan = (loanData) => {
    const request = axios.post(`${baseUrl}/loans/`, loanData)
    return request.then(response => response.data)
}

const getAllLoans = () => {
    const request = axios.get(`${baseUrl}/loans/`)
    return request.then(response => response.data)
}

const getOneLoan = (id) => {
    const request = axios.get(`${baseUrl}/loans/${id}`)
    return request.then(response => response.data)
}

const patchLoan = (id, loanData) => {
    const request = axios.patch(`${baseUrl}/loans/${id}`, loanData)
    return request.then(response => response.data)
}

const deleteLoan = (id) => {
    const request = axios.delete(`${baseUrl}/loans/${id}`)
    return request.then(response => response.data)
}

export default {
    createLoan, getAllLoans, getOneLoan, patchLoan, deleteLoan
}