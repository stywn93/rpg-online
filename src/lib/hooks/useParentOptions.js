import {useEffect, useState} from "react"
import {listUsers} from "../api/Patient.js"
import {normalizeUserList} from "../utils/Normalization.js"

function useDebouncedValue(value, delay = 400) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}

export default function useParentOptions({token, logout, enabled = true}) {
    const [parents, setParents] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const debouncedSearchTerm = useDebouncedValue(searchTerm, 400)

    useEffect(() => {
        if (!token || !enabled) {
            return
        }

        const controller = new AbortController()

        async function fetchParents() {
            setIsLoading(true)

            try {
                const response = await listUsers(token, 1, 100, debouncedSearchTerm, "active", "user")
                const body = await response.json()

                if (response.status === 200) {
                    setParents(normalizeUserList(body))
                } else if (response.status === 401) {
                    logout()
                } else {
                    setParents([])
                }
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") {
                    setParents([])
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        fetchParents()

        return () => controller.abort()
    }, [token, enabled, debouncedSearchTerm, logout])

    return {
        parents,
        isLoading,
        searchTerm,
        setSearchTerm,
    }
}