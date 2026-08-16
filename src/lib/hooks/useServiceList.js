import {useCallback, useEffect, useState} from "react"
import {listService, deleteServiceType} from "../api/ServiceTypes.js"
import {normalizeServiceList} from "../utils/Normalization.js"

export default function useServiceList({token, logout}) {
    const [services, setServices] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!token) {
            return
        }

        const controller = new AbortController()

        async function fetchServices() {
            setIsLoading(true)
            setError(null)

            try {
                const response = await listService(token, {perPage: 100})
                const body = await response.json()

                if (response.status === 200) {
                    setServices(normalizeServiceList(body))
                } else if (response.status === 401) {
                    logout()
                } else {
                    setError(body)
                }
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") {
                    setError(fetchError)
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        fetchServices()

        return () => controller.abort()
    }, [token, logout])

    const deleteService = useCallback(async (id) => {
        setIsDeleting(true)

        try {
            const response = await deleteServiceType(token, id)
            const body = await response.json()

            if (response.status === 401) {
                logout()
                return false
            }

            if (body?.status !== "success") {
                throw new Error(body?.message ?? "Gagal menghapus layanan.")
            }

            setServices((current) => current.filter((item) => item.id !== String(id)))
            return true
        } finally {
            setIsDeleting(false)
        }
    }, [token, logout])

    return {
        services,
        isLoading,
        isDeleting,
        error,
        deleteService,
    }
}