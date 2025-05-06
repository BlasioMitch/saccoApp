import api from './api'

const fetchProfile = (userId) => {
    const request = api.get(`/profile/${userId}`)
    return request.then(response => response.data)
}

export default {
    fetchProfile
}