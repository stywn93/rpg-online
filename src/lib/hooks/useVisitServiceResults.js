import {useEffect, useState} from "react"
import {listVisitServicesByVisit} from "../api/Queue.js"
import {normalizeVisitServiceRecords} from "../utils/Normalization.js"

export default function useVisitServiceResults({token, logout, visitId}) {
    const [records, setRecords] = useState([])
    const [visit, setVisit] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!token || !visitId) {
            return
        }

        let isCancelled = false

        async function fetchVisitServices() {
            setIsLoading(true)
            setError(null)

            try {
                const response = await listVisitServicesByVisit(token, visitId)
                const body = await response.json()

                if (response.status === 401) {
                    logout()
                    return
                }

                if (response.status === 200 && !isCancelled) {
                    setRecords(normalizeVisitServiceRecords(body))
                    setVisit(body?.data?.[0] ?? {})
                } else if (!isCancelled) {
                    setError(body)
                }
            } catch (fetchError) {
                if (!isCancelled) {
                    setError(fetchError)
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false)
                }
            }
        }

        fetchVisitServices()

        return () => {
            isCancelled = true
        }
    }, [token, visitId, logout])

    return {
        records,
        visit,
        isLoading,
        error,
    }
}
