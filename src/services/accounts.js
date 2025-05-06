import api from './api'

const getAccounts = () => {
    const request = api.get(`/accounts`)
    return request.then(response => response.data)
}

const getOneAccount = (id) => {
    const request = api.get(`/accounts/${id}`)
    return request.then(response => response.data)
}

const createAccount = (accountData) => {
    const request = api.post(`/accounts`, accountData)
    return request.then(response => response.data)
}

const patchAccount = (id,accountData) => {
    const request = api.patch(`/accounts/${id}`, accountData)
    return request.then(response => response.data)
}

const deleteAccount = (id) => {
    const request = api.delete(`/accounts/${id}`)
    return request.then(response => response.data)
}

export default {
    getAccounts, getOneAccount, createAccount, patchAccount, deleteAccount
}