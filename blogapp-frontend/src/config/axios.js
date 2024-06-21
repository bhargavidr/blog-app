import axios from 'axios'

export default axios.create({
    // baseURL:'http://localhost:4034'
    baseURL:process.env.REACT_APP_URL
})
