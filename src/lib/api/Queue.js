import { apiBaseUrl } from "./baseUrl"


export const queueList = async(token, tanggal) => {
    const url = `${apiBaseUrl}/queues?tanggal=${tanggal}`

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

export const queueDetails = async(token, id) => {
    const url = `${apiBaseUrl}/queues/${id}`

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}