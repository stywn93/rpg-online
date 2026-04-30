import { apiBaseUrl } from "./baseUrl"

export const queueList = async(token) => {
    const url = `${apiBaseUrl}/queues?per_page=10`

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}
