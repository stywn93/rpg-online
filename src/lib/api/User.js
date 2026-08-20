import { apiBaseUrl } from "./baseUrl"

export const userRegister = async ({name, email, phone, password}) => {
    return await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name, email, phone, password
        })
    })
}

export const userLogin = async ({email, password}) => {
    return await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email, password
        })
    })
}

export const userUpdateProfile = async (token, {name}) => {
    return await fetch(`${apiBaseUrl}/users/current`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            name
        })
    })
}

export const userUpdatePassword = async (token, {pass}) => {
    return await fetch(`${apiBaseUrl}/users/current`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            pass
        })
    })
}

export const userDetail = async (token) => {
    return await fetch(`${apiBaseUrl}/users/current`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
}

export const userLogout = async (token) => {
    return await fetch(`${apiBaseUrl}/users/logout`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
}

export const userActivate = async (token, id) => {
    return await fetch(`${apiBaseUrl}/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({status: 'active'})
    })
}

export const userSuspend = async (token, id) => {
    return await fetch(`${apiBaseUrl}/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({status: 'suspended'})
    })
}

export const changeUserPassword = async (token, id, password) => {
    return await fetch(`${apiBaseUrl}/users/${id}/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
    })
}

export const listUsers = async (token, page = 1, perPage = 10, searchTerm = "", status = "", role = "") => {
    const params = new URLSearchParams({
        name: searchTerm,
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
