import axios from 'axios';
import { url } from './apiServices';

let refreshTokenRequest = null;

async function refreshRequest() {
    try {
        const token = localStorage.getItem('refreshToken');
        const data = await axios.post(`${url}/refresh-token`, {
            refresh_token: token
        });
        console.log(data);
        localStorage.setItem('accessToken', data?.data?.access_token);
        localStorage.setItem('refreshToken', data?.data?.refresh_token);
    } catch (e) {
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        // window.location.reload();
    }
}

axios.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
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
        if (err.response?.status === 401 && !err.config?._retry) {
            err.config._retry = true;
            try {
                if (!refreshTokenRequest) {
                    refreshTokenRequest = refreshRequest()
                }
                await refreshTokenRequest;
                return await axios(err.config);
            } catch (e) {
                return Promise.reject(e);
            }

        }
        return Promise.reject(err.response)
    }
)
