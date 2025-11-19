import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useNavigate } from "react-router-dom";
import { Config } from "./Configs";

//config
const axiosInstance = axios.create({
    baseURL: Config.SERVER_BASE_URL,
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
const axiosRefreshInstance = axios.create();
const refreshAuthLogic = async (failedRequest) => {
    const { refresh } = JSON.parse(localStorage.getItem("auth"));
    return axiosRefreshInstance.post("/auth/refresh/", {refresh:refresh}, {
        baseURL: Config.SERVER_BASE_URL,
        headers: {
             Authorization: `Bearer ${refresh}`,
            'Content-Type': 'application/json',
        },
    }).then((resp) => {
        const {access} = resp.data;
        const auth =  JSON.parse(localStorage.getItem("auth"));
        auth['access'] = access;
        localStorage.setItem("auth", JSON.stringify(auth));
        failedRequest.response.config.headers["Authorization"] = "Bearer " + access;
    }).catch(() => {
        localStorage.removeItem("auth");
        // if unable to refresh redirect user to login
        useNavigate("/");
        
    });
};

//create refresher intercepton
createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic);

export default axiosInstance;