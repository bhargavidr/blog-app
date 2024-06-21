import axios from 'axios'

export default axios.create({
    // baseURL:'http://localhost:4034'
    baseURL:process.env.APP_URL
})