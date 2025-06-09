import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const baseURL = process.env.API_ENDPOINT || 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

async function get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // eslint-disable-next-line no-useless-catch
    try {
        const response: AxiosResponse<T> = await api.get(url, config);
        return response.data;
    } catch (error: unknown) {
        throw error;
    }
}

async function post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<T> {
    try {
        const response: AxiosResponse<T> = await api.post(url, data, config);
        return response.data;
    } catch (error: unknown) {
        throw error;
    }
}

async function put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<T> {
    try {
        const response: AxiosResponse<T> = await api.put(url, data, config);
        return response.data;
    } catch (error: unknown) {
        throw error;
    }
}


async function del<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // eslint-disable-next-line no-useless-catch
    try {
        const response: AxiosResponse<T> = await api.delete(url, config);
        return response.data;
    } catch (error: unknown) {
        throw error;
    }
}

export default {
    get,
    post,
    put,
    delete: del,
};
