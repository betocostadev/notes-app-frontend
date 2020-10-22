import axios from 'axios'
// const baseURL = 'http://localhost:3001/api/notes' // Old URL using local host
// const baseUrl = 'https://obscure-anchorage-17694.herokuapp.com/api/notes' // Access building front-end from local host
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default {
  getAll,
  create,
  update,
  remove,
  setToken
}
