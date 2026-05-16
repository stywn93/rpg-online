import { apiBaseUrl } from "./baseUrl"


export const queueList = async (token, tanggal, page = 1, perPage = 50, searchTerm = "", status = "") => {
    const params = new URLSearchParams({
        tanggal_kunjungan: String(tanggal),
        searchTerm,
        page: String(page),
        per_page: String(perPage),
    })

    if (status) {
        params.set("status", status)
    }

    return await fetch(`${apiBaseUrl}/queues?${params.toString()}`, {
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

export const updateQueue = async(token, id, status) => {
    const url = `${apiBaseUrl}/queues/${id}`

    return await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({status})
    })
}
