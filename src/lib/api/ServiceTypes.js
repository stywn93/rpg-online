import { apiBaseUrl } from "./baseUrl.js";

export const listService = async (token, { page = 1, perPage = 10, searchTerm = "" } = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
    });

    if (searchTerm) {
        params.set("service_name", searchTerm);
    }

    return await fetch(`${apiBaseUrl}/medical-services?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
};

export const getServiceTypeDetail = async (token, id) => {
    return await fetch(`${apiBaseUrl}/medical-services/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
};

export const createServiceType = async (token, payload) => {
    return await fetch(`${apiBaseUrl}/medical-services`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
};

export const updateServiceType = async (token, id, payload) => {
    return await fetch(`${apiBaseUrl}/medical-services/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
};

export const deleteServiceType = async (token, id) => {
    return await fetch(`${apiBaseUrl}/medical-services/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
};