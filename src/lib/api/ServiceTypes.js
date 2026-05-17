import { apiBaseUrl } from "./baseUrl"

export const listService = async (token, { paging = 10 } = {}) => {
    return await fetch(`${apiBaseUrl}/servicetypes?per_page=${paging}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
}
