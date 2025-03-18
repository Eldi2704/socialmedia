import axios from 'axios';
import { useUserStore } from "../stores/userSession";
import router from "@/router";
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();
const backend_url = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
    withCredentials: false,
    baseURL: backend_url,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const userSession = useUserStore();
    if (userSession.token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${userSession.token}`,
        };
    }
    return config;
});

api.interceptors.response.use(
    response => response, // Pass successful responses through
    error => {
        const res = error.response;
        if (!res) {
            notify({
                title: "Network Error",
                type: "error",
                text: "Could not connect to the server.",
            });
            throw error;
        }

        switch (res.status) {
            case 401:
            case 419:
                router.push({ name: 'login' });
                notify({
                    title: 'Unauthenticated',
                    type: "error",
                    text: 'You are not logged in',
                });
                break;
            case 400:
                notify({
                    title: '',
                    type: "error",
                    text: res.data.message,
                });
                break;
            case 403:
                notify({
                    title: 'Forbidden',
                    type: "error",
                    text: res.data.message,
                });
                break;
            case 422:
                let text = '';
                for (const value of Object.values(res.data.errors || {}).flat()) {
                    text += '\n' + value;
                }
                notify({
                    title: "Validation Error",
                    type: "error",
                    text: text || "Please check your input.",
                });
                break;
            case 500:
                notify({
                    title: "Server Error",
                    type: "error",
                    text: res.data.message || "An unexpected error occurred.",
                });
                break;
        }
        throw error; 
    }
);

export async function post(path, data, header) {
    return await api.post(path, data, header);
}

export async function get(path, data) {
    return await api.get(path, data);
}

export async function patch(path, data) {
    return await api.patch(path, data);
}

export async function destroy(path) {
    return await api.delete(path);
}