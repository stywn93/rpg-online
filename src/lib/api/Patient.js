import {apiBaseUrl} from "./baseUrl.js";

export const listPatients = async (token, {page = 1, perPage = 10, searchTerm = ""} = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
    })

    if (searchTerm) {
        params.set("name", searchTerm)
    }

    return await fetch(`${apiBaseUrl}/patients?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

export const listPatientsByParent = async (token, parentId) => {
    return await fetch(`${apiBaseUrl}/patients/parent/${parentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

export const createPatient = async (token, payload) => {
    return await fetch(`${apiBaseUrl}/patients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })
}

export const getPatientDetail = async (token, id) => {
    return await fetch(`${apiBaseUrl}/patients/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}
