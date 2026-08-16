import {useEffect, useState} from "react"
import {listPatients} from "../api/Patient.js"
import {normalizePatientList} from "../utils/Normalization.js"

function useDebouncedValue(value, delay = 400) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}

export default function usePatientList({token, logout}) {
    const [patients, setPatients] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const debouncedSearchTerm = useDebouncedValue(searchTerm, 400)

    useEffect(() => {
        if (!token) {
            return
        }

        const controller = new AbortController()

        async function fetchPatients() {
            setIsLoading(true)
            setError(null)

            try {
                const response = await listPatients(token, {perPage: 100, searchTerm: debouncedSearchTerm})
                const body = await response.json()

                if (response.status === 200) {
                    setPatients(normalizePatientList(body))
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

        fetchPatients()

        return () => controller.abort()
    }, [token, debouncedSearchTerm, logout])

    return {
        patients,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
    }
}