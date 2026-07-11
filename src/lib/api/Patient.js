import {apiBaseUrl} from "./baseUrl.js";

export const listPatients = async (token, {perPage = 10, searchTerm = ""} = {}) => {
    const params = new URLSearchParams({
        per_page: String(perPage),
    })

    if (searchTerm) {
        params.set("searchTerm", searchTerm)
    }

    return await fetch(`${apiBaseUrl}/patients/with-parents?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

export const listPatientsByParent = async (token, parentId) => {
    return await fetch(`${apiBaseUrl}/patients/with-parents/${parentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
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

export const listUsers = async (token, page = 1, perPage = 10, searchTerm = "", status = "", role = "") => {
    const params = new URLSearchParams({
        searchTerm,
        page: String(page),
        per_page: String(perPage),
    })

    if (status) {
        params.set("status", status)
    }

    if (role) {
        params.set("role", role)
    }

    return await fetch(`${apiBaseUrl}/users?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

export const getUserDetail = async (token, id) => {
    return await fetch(`${apiBaseUrl}/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

export const updateUserDetail = async (token, id, payload) => {
    return await fetch(`${apiBaseUrl}/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })
}
