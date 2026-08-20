import {useCallback, useEffect, useState} from "react"
import toast from "react-hot-toast"
import {listUsers, userActivate} from "../api/User.js"
import {normalizeUserList} from "../utils/Normalization.js"

const PER_PAGE = 10

function useDebouncedValue(value, delay = 400) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}

export default function useUserList({token, logout}) {
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [status, setStatus] = useState("")
    const [role, setRole] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({
        total: 0,
        lastPage: 1,
        currentPage: 1,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const [activatingUserIdMap, setActivatingUserIdMap] = useState({})

    const debouncedSearchTerm = useDebouncedValue(searchTerm, 400)

    useEffect(() => {
        if (!token) {
            return
        }

        const controller = new AbortController()

        async function fetchUsers() {
            setIsLoading(true)
            setError(null)

            try {
                const response = await listUsers(
                    token,
                    currentPage,
                    PER_PAGE,
                    debouncedSearchTerm,
                    status,
                    role
                )
                const body = await response.json().catch(() => null)

                if (response.status === 401) {
                    logout()
                    return
                }

                if (!response.ok) {
                    setError(body ?? {message: "Gagal memuat data pengguna."})
                    return
                }

                setUsers(normalizeUserList(body))
                setPagination({
                    total: body?.meta?.total ?? 0,
                    lastPage: body?.meta?.last_page ?? 1,
                    currentPage: body?.meta?.current_page ?? 1,
                })
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

        fetchUsers()

        return () => controller.abort()
    }, [token, currentPage, debouncedSearchTerm, status, role, logout])

    const activateUser = useCallback(async (userId) => {
        if (!token || !userId || activatingUserIdMap[userId]) {
            return
        }

        setActivatingUserIdMap((prev) => ({...prev, [userId]: true}))

        try {
            const response = await userActivate(token, userId)
            const body = await response.json().catch(() => null)

            if (response.status === 401) {
                logout()
                return
            }

            if (!response.ok) {
                throw new Error(
                    body?.message
                    ?? body?.messages?.error
                    ?? "Gagal mengaktifkan pengguna."
                )
            }

            toast.success("Pengguna berhasil diaktifkan.")
            setUsers((current) =>
                current.map((user) =>
                    user.id === String(userId) ? {...user, status: "active"} : user
                )
            )
        } catch (error) {
            toast.error(error.message ?? "Terjadi kesalahan saat mengaktifkan pengguna.")
        } finally {
            setActivatingUserIdMap((prev) => ({...prev, [userId]: false}))
        }
    }, [token, logout, activatingUserIdMap])

    const resetFilters = useCallback(() => {
        setSearchTerm("")
        setStatus("")
        setRole("")
        setCurrentPage(1)
    }, [])

    const handleSearchChange = useCallback((event) => {
        setSearchTerm(event.target.value)
        setCurrentPage(1)
    }, [])

    const handleStatusChange = useCallback((event) => {
        setStatus(event.target.value)
        setCurrentPage(1)
    }, [])

    const handleRoleChange = useCallback((event) => {
        setRole(event.target.value)
        setCurrentPage(1)
    }, [])

    const goToPage = useCallback((page) => {
        setCurrentPage(Math.min(pagination.lastPage, Math.max(1, page)))
    }, [pagination.lastPage])

    return {
        users,
        pagination,
        currentPage,
        perPage: PER_PAGE,
        isLoading,
        error,
        searchTerm,
        status,
        role,
        setCurrentPage,
        handleSearchChange,
        handleStatusChange,
        handleRoleChange,
        resetFilters,
        goToPage,
        activatingUserIdMap,
        activateUser,
    }
}