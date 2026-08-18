import { apiBaseUrl } from "./baseUrl"


export const queueList = async (
    token,
    tanggal,
    page = 1,
    perPage = 10,
    searchTerm = "",
    status = ""
) => {
    const params = new URLSearchParams({
        visit_date: String(tanggal),
        searchTerm,
        page: String(page),
        per_page: String(perPage),
    })

    if (status) {
        params.set("visit_status", status)
    }

    if(searchTerm) {
        params.set("patient_name", searchTerm)
    }

    return await fetch(`${apiBaseUrl}/visits?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
}

export const visitServiceList = async (
    token,
    tanggal,
    page = 1,
    perPage = 10,
    searchTerm = "",
    status = "",
    serviceTypeIds = []
) => {
    const params = new URLSearchParams({
        visit_date: String(tanggal),
        searchTerm,
        page: String(page),
        per_page: String(perPage),
    })

    if (status) {
        params.set("visit_status", status)
    }

    if (searchTerm) {
        params.set("patient_name", searchTerm)
    }

    if (Array.isArray(serviceTypeIds) && serviceTypeIds.length > 0) {
        params.set("service_id", serviceTypeIds.map((id) => String(id).trim()).filter(Boolean).join(","))
    }

    return await fetch(`${apiBaseUrl}/visit-services?${params.toString()}`, {
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

export const listPatientVisits = async (token, patientId) => {
    const params = new URLSearchParams({
        patient_id: String(patientId),
    })

    return await fetch(`${apiBaseUrl}/visits?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

export const listVisitServices = async (token, {patientId = "", page = 1, perPage = 100} = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
    })

    if (patientId) {
        params.set("patient_id", String(patientId))
    }

    return await fetch(`${apiBaseUrl}/visit-services?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

export const createVisit = async (token, payload) => {
    return await fetch(`${apiBaseUrl}/visits`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
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
    const url = `${apiBaseUrl}/visits/${id}`

    return await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({visit_status: status})
    })
}
