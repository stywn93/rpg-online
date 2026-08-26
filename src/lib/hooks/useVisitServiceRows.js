import {useCallback, useEffect, useState} from "react"
import {useLocalStorage} from "react-use"
import {visitServiceRowList} from "../api/Queue.js"
import {normalizeVisitServiceRows} from "../utils/Normalization.js"
import { getTodayDate, sanitizeStoredDate } from "../utils/date.js"
import useDebouncedValue from "./useDebouncedValue.js"

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
                    10,
                    debouncedSearchTerm,
                    status,
                    selectedServiceIds
                )
                const body = await response.json()

                if (response.status === 200) {
                    setRows(normalizeVisitServiceRows(body) ?? [])
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
