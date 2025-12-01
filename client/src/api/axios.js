// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:5000/api',
// });

// export default api;
// client/src/api/axios.js
import axios from 'axios';

// automatically detects if you are local or on the web
const BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : 'https://YOUR-APP-NAME.onrender.com/api'; // Paste your Render URL here

export default axios.create({
    baseURL: BASE_URL,
});