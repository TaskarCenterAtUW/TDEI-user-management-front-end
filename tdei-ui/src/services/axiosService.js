import axios from 'axios';

axios.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('accessToken');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
        return config;

    },
    (error) => {
        return Promise.reject(error.response)
    }
)

axios.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        // if(err.response?.status === 401) {
        //     localStorage.removeItem('accessToken');
        //     localStorage.removeItem('refreshToken');
        //     window.location.reload();
        //     return Promise.reject(err.response);
        // }
        return Promise.reject(err.response)
    }
)
