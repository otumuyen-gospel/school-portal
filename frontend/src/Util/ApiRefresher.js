import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useNavigate } from "react-router-dom";

//config
const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.9:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});
   
// add access token to every request
axiosInstance.interceptors.request.use(request => {
    const { access } = JSON.parse(localStorage.getItem("auth"));
    if (access) {
        request.headers['Authorization'] = `Bearer ${access}`;
    }
    return request;
}, error => {
    return Promise.reject(error);
});

//refresh user token that has expired
const refreshAuthLogic = async (failedRequest) => {
    const { refresh } = JSON.parse(localStorage.getItem("auth"));
    return axios.post("/auth/refresh/", {refresh:{refresh}}, {
        baseURL: "http://192.168.1.9:8000",
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
        useNavigate("/");
        
    });
};

//create refresher intercepton
createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic);

export default axiosInstance;