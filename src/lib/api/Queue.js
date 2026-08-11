import { apiBaseUrl } from "./baseUrl"


export const queueList = async (
    token,
    tanggal,
    page = 1,
    perPage = 50,
    searchTerm = "",
    status = "",
    serviceTypeIds = []
) => {
    const params = new URLSearchParams({
        tanggal_kunjungan: String(tanggal),
        searchTerm,
        page: String(page),
        per_page: String(perPage),
    })

    if (status) {
        params.set("status", status)
    }

    if (Array.isArray(serviceTypeIds) && serviceTypeIds.length > 0) {
        params.set("jenis_layanan", serviceTypeIds.map((id) => String(id).trim()).filter(Boolean).join(","))
    }

    return await fetch(`${apiBaseUrl}/queues/all?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
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

export const createQueue = async (token, payload) => {
    return await fetch(`${apiBaseUrl}/queues`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
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
