export const listService = async (token, { paging = 10 } = {}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/servicetypes?perpage=${paging}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
}
