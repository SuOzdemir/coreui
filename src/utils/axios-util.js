import axios from 'axios';
import {getGlobalToast} from "./ortak-funcs";
import {createBrowserHistory} from 'history';

export const historyObj = createBrowserHistory();
export const userKey = 'auth';
export let aktifKullanici = {};

const options = {
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Cache-Control': 'no-cache',
    }
};

const axiosObj = axios.create(options);
export const callApiGet = axiosObj.get;
export const callApiPost = axiosObj.post;
export const callApiPut = axiosObj.put;
export const callApiDelete = axiosObj.delete;

const currentUserStr = localStorage.getItem(userKey);
if (currentUserStr) {
    const data = JSON.parse(currentUserStr);
    aktifKullanici = data.user;
    axiosObj.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
}

export function setAktifKullanici(data) {
    aktifKullanici = data.user;
    axiosObj.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
}

axiosObj.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const errorMessage = error.response?.data?.message;
    if (errorMessage && errorMessage.startsWith('Unauthorized')) {
        callLogOut();
    }
    if (error?.response?.status === 401) {
        callLogOut();
    }
    return Promise.reject(error);
});

function callLogOut() {
    console.log('callLogOut:', null);
    historyObj.push('/login');
}

export async function callAPI(axiosFunc, url, param, nextFunc, silent = false, errFunc) {
    const urlOptions = {};
    let newParam;
    if ([callApiGet, callApiDelete].includes(axiosFunc)){
        newParam = {params: param, ...urlOptions};
    } else {
        newParam = param;
    }
    try {
        const res = await axiosFunc(url, newParam, urlOptions);
        if (!silent) {
            console.log('url', url);
            getGlobalToast().show({ severity: 'success', summary: 'Başarılı', detail: 'İşlem başarılı.', life: 3000 });
        }
        if (nextFunc) {
            await nextFunc(res);
        }
    } catch (err) {
        console.log('err.response.status', err);
        if (![403].includes(err.response?.data?.messageCode)) {
            if (errFunc) {
                await errFunc(err);
            } else {
                getGlobalToast().show({ severity: 'error', summary: 'Hata', detail: `Hata Mesajı: ${err.response?.data?.errorMessage ?? err.message}`, life: 3000 });
            }
        }
    }
}

export function rolYetkili(gerekenler) {
    const roller = aktifKullanici.roles.split(',');
    let hasARole = false;
    for (const gereken of gerekenler) {
        if (roller.includes(gereken)) {
            hasARole = true;
        }
    }
    return hasARole;
}

export default axiosObj;
