import axios from "axios";

const baseUrl = 'http://localhost:8000/api'

const getLoanApps = () => {
    const request = axios.get(`${baseUrl}/loanapplications/`)
    return request.then(response => response.data)
}

const getOneLoanApp = (id) => {
    const request = axios.get(`${baseUrl}/loanapplications/${id}/`)
    return request.then(response => response.data)
}

const createLoanApp = (loanappData) => {
    const request = axios.post(`${baseUrl}/loanapplications/`, loanappData)
    return request.then(response => response.data)
}

const patchLoanApp = (id,loanappData) => {
    const request = axios.patch(`${baseUrl}/loanapplications/${id}/`, loanappData)
    return request.then(response => response.data)
}

const deleteLoanApp = (id) => {
    const request = axios.delete(`${baseUrl}/loanapplications/${id}/`)
    return request.then(response => response.data)
}

export default {
    getLoanApps, getOneLoanApp, createLoanApp, patchLoanApp, deleteLoanApp
}