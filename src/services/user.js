
import api from './api'

const createUser = (userData) => {
  const request = api.post('/users', userData)
  return request.then(response => response.data)
}

const getAllUsers = () => {
  const request = api.get('/users')
  return request.then(response => response.data)
}

const getOneUser = (id) => {
  const request = api.get(`/users/${id}`)
  return request.then(response => response.data)
}

const patchUser = (id, userData) => {
  const request = api.patch(`/users/${id}`, userData)
  return request.then(response => response.data)
}

const deleteUser = (id) => {
  const request = api.delete(`/users/${id}`)
  return request.then(response => response.data)
}

export default { createUser, getAllUsers, getOneUser, patchUser, deleteUser }