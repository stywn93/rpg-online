const rawApiPath = import.meta.env.VITE_API_PATH || "/api/v1"

export const apiBaseUrl = rawApiPath.replace(/\/+$/, "")