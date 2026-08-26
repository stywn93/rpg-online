import {useCallback, useEffect, useState} from "react"
import {useLocalStorage} from "react-use"
import {queueList, queueListByParent, updateQueue} from "../api/Queue.js"
import {normalizeQueueList} from "../utils/Normalization.js"
import { getTodayDate, sanitizeStoredDate } from "../utils/date.js"
import useDebouncedValue from "./useDebouncedValue.js"

export default function useQueueList({token, logout, isUserRole = false, userId = ""}) {
    const [selectedDate, setSelectedDate] = useLocalStorage("tanggalKunjungan", getTodayDate(), {
        serializer: (value) => JSON.stringify(value),
        deserializer: sanitizeStoredDate,
    })
    const [status, setStatus] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [queues, setQueues] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState(null)

    const debouncedSearchTerm = useDebouncedValue(searchTerm, 400)

    useEffect(() => {
        if (!token || (isUserRole && !userId)) {
            return
        }

        const controller = new AbortController()

        async function fetchQueues() {
            setIsLoading(true)
            setError(null)

            try {
                const response = isUserRole
                    ? await queueListByParent(
                        token,
                        userId,
                        selectedDate,
                        1,
                        10,
                        debouncedSearchTerm,
                        status
                    )
                    : await queueList(
                        token,
                        selectedDate,
                        1,
                        10,
                        debouncedSearchTerm,
                        status
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
    }, [token, selectedDate, status, debouncedSearchTerm, logout, isUserRole, userId])

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
            // gagal update, biarkan state kembali normal
        } finally {
            setIsUpdating(false)
        }
    }, [token, logout])

    //event handler untuk update status panggil menjadi present
    const markCalled = useCallback((id) => {

        const oldQueues = queues // simpan state queue lama sebelum diubah

        setQueues((current) =>
            current.map((item) => //kenapa dilakukan mapping? karena kita ingin mengubah UI secara cepat tanpa menunggu response dari server
                item.id === String(id) ? {...item, visit_status: "present"} : item
            )
        )
        updateStatus(id, "present").catch(() => { //lakukan update status ke server
            setQueues(oldQueues) // kembalikan state queue lama jika update gagal
        })
    }, [updateStatus, queues])

    const resetFilters = useCallback(() => {
        setStatus("")
        setSearchTerm("")
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
        markCalled,
        resetFilters,
    }
}
