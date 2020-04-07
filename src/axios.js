import axios from 'axios'
import config from './config/config'

axios.defaults.baseURL = config.apiURL

const instance = axios.create({})

instance.interceptors.request.use(config => {
    console.log('Interceptando requisição:', config)
    config.data = {
        ...config.data,
        curso: 'Vue Js'
    }

    // config.headers.common['Authorization'] =  `Bearer ${window.localStorage.getItem('token')}`
    config.headers.common['Authorization'] =  `Bearer token_jwt`
    config.header.put["Meu-Cabecalho"] = 'VueJS'

    return config
})

instance.interceptors.response.use(response => {
    if(Array.isArray(response.data)){
        response.data = response.data.slice(1, 3)
    }
    return response
}, error => {
    return Promise.reject(error)
})


export default axios