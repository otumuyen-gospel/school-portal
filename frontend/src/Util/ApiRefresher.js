import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useNavigate } from "react-router-dom";

//config
const axiosInstance = axios.create({
    baseURL: 'https://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});
   
// add access token to every request
axiosInstance.interceptors.request.use(request => {
    const { accessToken } = JSON.parse(localStorage.getItem("auth"));
    if (accessToken) {
        request.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return request;
}, error => {
    return Promise.reject(error);
});

const refreshAuthLogic = async (failedRequest) => {
    const { refresh } =JSON.parse(localStorage.getItem("auth"));
    return axios.post("/auth/refresh/", null, {
        baseURL: "http://localhost:8000",
        headers: {
            Authorization: `Bearer ${refresh}`,
        },
    }).then((resp) => {
        const { access, refresh } = resp.data;
        failedRequest.response.config.headers["Authorization"] = "Bearer " + access;
        localStorage.setItem("auth", JSON.stringify({access, refresh }));
    }).catch(() => {
        localStorage.removeItem("auth");
        // if unable to refresh redirect user to login
        useNavigate("/")
        
    });
};

//create refresher intercepton
createAuthRefreshInterceptor(this.axiosInstance, refreshAuthLogic);

export default axiosInstance;