import {useCallback, useEffect, useState} from "react"
import {useLocalStorage} from "react-use"
import {visitServiceRowList} from "../api/Queue.js"
import {normalizeVisitServiceRows} from "../utils/Normalization.js"

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

export default function useVisitServiceRows({token, logout}) {
    const [selectedDate, setSelectedDate] = useLocalStorage("tanggalLayanan", getTodayDate(), {
        serializer: (value) => JSON.stringify(value),
        deserializer: sanitizeStoredDate,
    })
    const [status, setStatus] = useState("present")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedServiceIds, setSelectedServiceIds] = useState([])
    const [rows, setRows] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const debouncedSearchTerm = useDebouncedValue(searchTerm, 400)

    useEffect(() => {
        if (!token) {
            return
        }

        const controller = new AbortController()

        async function fetchRows() {
            setIsLoading(true)
            setError(null)

            try {
                const response = await visitServiceRowList(
                    token,
                    selectedDate,
                    1,
                    100,
                    debouncedSearchTerm,
                    "",
                    selectedServiceIds
                )
                const body = await response.json()

                if (response.status === 200) {
                    const normalized = normalizeVisitServiceRows(body) ?? []
                    // ponytail: frontend-only status+result filter O(n) capped 100, push has_result to BE if >100/day
                    const filtered = (() => {
                        if (status === "present") {
                            return normalized.filter(
                                (row) =>
                                    row.visit_status === "present" ||
                                    (row.visit_status === "finished" && String(row.result ?? "").trim() === "")
                            )
                        }
                        if (status === "finished") {
                            return normalized.filter(
                                (row) => row.visit_status === "finished" && String(row.result ?? "").trim() !== ""
                            )
                        }
                        if (status) {
                            return normalized.filter((row) => row.visit_status === status)
                        }
                        return normalized
                    })()
                    setRows(filtered)
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

        fetchRows()

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
        rows,
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
