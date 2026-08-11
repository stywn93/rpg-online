import {useCallback, useEffect, useState} from "react"
import {useLocalStorage} from "react-use"
import {queueList, updateQueue} from "../api/Queue.js"
import {normalizeQueueList} from "../utils/Normalization.js"

function getTodayDate() {
    const now = new Date()
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)

    return localDate.toISOString().split("T")[0]
}

function useDebouncedValue(value, delay = 400) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}

export default function useQueueList({token, logout}) {
    const [selectedDate, setSelectedDate] = useLocalStorage("tanggalKunjungan", getTodayDate())
    const [status, setStatus] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedServiceIds, setSelectedServiceIds] = useState([])
    const [queues, setQueues] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState(null)

    const debouncedSearchTerm = useDebouncedValue(searchTerm, 400)

    useEffect(() => {
        if (!token) {
            return
        }

        const controller = new AbortController()

        async function fetchQueues() {
            setIsLoading(true)
            setError(null)

            try {
                const response = await queueList(
                    token,
                    selectedDate,
                    1,
                    100,
                    debouncedSearchTerm,
                    status,
                    selectedServiceIds
                )
                const body = await response.json()

                if (response.status === 200) {
                    setQueues(normalizeQueueList(body) ?? [])
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

        fetchQueues()

        return () => controller.abort()
    }, [token, selectedDate, status, debouncedSearchTerm, selectedServiceIds, logout])

    const updateStatus = useCallback(async (id, nextStatus) => {
        setIsUpdating(true)

        try {
            const response = await updateQueue(token, id, nextStatus)
            const body = await response.json()

            if (response.status === 200) {
                const nextQueues = normalizeQueueList(body)

                if (nextQueues) {
                    setQueues(nextQueues)
                } else if (body?.data && typeof body.data === "object") {
                    setQueues((current) =>
                        current.map((item) =>
                            item.queue_id === String(id)
                                ? {...item, ...body.data, id: String(id), queue_id: String(id)}
                                : item
                        )
                    )
                }
            } else if (response.status === 401) {
                logout()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsUpdating(false)
        }
    }, [token, logout])

    const checkIn = useCallback((id) => {
        setQueues((current) =>
            current.map((item) =>
                item.queue_id === String(id)
                    ? {...item, status: "checked_in"}
                    : item
            )
        )
        updateStatus(id, "checked_in")
    }, [updateStatus])

    const markAbsent = useCallback((id) => {
        setQueues((current) =>
            current.map((item) =>
                item.queue_id === String(id)
                    ? {...item, status: "no_show"}
                    : item
            )
        )
        updateStatus(id, "no_show")
    }, [updateStatus])

    const markCalled = useCallback((id) => {
        setQueues((current) =>
            current.map((item) =>
                item.queue_id === String(id)
                    ? {...item, status: "called"}
                    : item
            )
        )
        updateStatus(id, "called")
    }, [updateStatus])

    const toggleService = useCallback((serviceId) => {
        setSelectedServiceIds((current) =>
            current.includes(serviceId)
                ? current.filter((id) => id !== serviceId)
                : [...current, serviceId]
        )
    }, [])

    const resetFilters = useCallback(() => {
        setStatus("")
        setSearchTerm("")
        setSelectedServiceIds([])
        setSelectedDate(getTodayDate())
    }, [setSelectedDate])

    return {
        queues,
        isLoading,
        isUpdating,
        error,
        selectedDate,
        setSelectedDate,
        status,
        setStatus,
        searchTerm,
        setSearchTerm,
        selectedServiceIds,
        setSelectedServiceIds,
        toggleService,
        checkIn,
        markAbsent,
        markCalled,
        resetFilters,
    }
}