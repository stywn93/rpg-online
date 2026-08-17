import {useCallback, useEffect, useState} from "react"
import {useLocalStorage} from "react-use"
import {visitServiceList} from "../api/Queue.js"
import {normalizeQueueList} from "../utils/Normalization.js"

function getTodayDate() {
    const now = new Date()
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)

    return localDate.toISOString().split("T")[0]
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function isDateString(value) {
    return typeof value === "string" && DATE_PATTERN.test(value)
}

function sanitizeStoredDate(value) {
    const parsed = JSON.parse(value)

    return isDateString(parsed) ? parsed : getTodayDate()
}

function useDebouncedValue(value, delay = 400) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}

export default function useVisitServiceList({token, logout}) {
    const [selectedDate, setSelectedDate] = useLocalStorage("tanggalLayanan", getTodayDate(), {
        serializer: (value) => JSON.stringify(value),
        deserializer: sanitizeStoredDate,
    })
    const [status, setStatus] = useState("present")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedServiceIds, setSelectedServiceIds] = useState([])
    const [queues, setQueues] = useState([])
    const [isLoading, setIsLoading] = useState(false)
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
                const response = await visitServiceList(
                    token,
                    selectedDate,
                    1,
                    10,
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

    const toggleService = useCallback((serviceId) => {
        setSelectedServiceIds((current) =>
            current.includes(serviceId)
                ? current.filter((id) => id !== serviceId)
                : [...current, serviceId]
        )
    }, [])

    const resetFilters = useCallback(() => {
        setStatus("present")
        setSearchTerm("")
        setSelectedServiceIds([])
        setSelectedDate(getTodayDate())
    }, [setSelectedDate])

    return {
        queues,
        isLoading,
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
        resetFilters,
    }
}
