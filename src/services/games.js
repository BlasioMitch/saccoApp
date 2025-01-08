import axios from "axios";

const baseUrl = 'http://localhost:3001'

const getAllStudents =  () => {
    const request = axios.get(`${baseUrl}/students`)
    return request.then(response => response.data)
}

const getAllGames =  () => {
    const request =  axios.get(`${baseUrl}/games`)
    return request.then(response =>  response.data)
}

export default {getAllStudents, getAllGames}