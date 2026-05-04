import {apiBaseUrl} from "./baseUrl.js";

export const listPatients = async (token) => {
    return await fetch(`${apiBaseUrl}/patients`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}