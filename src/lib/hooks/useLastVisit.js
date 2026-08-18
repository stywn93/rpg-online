import {useEffect, useState} from "react"
import toast from "react-hot-toast"
import {listPatientVisits} from "../api/Queue.js"
import {normalizeQueueList} from "../utils/Normalization.js"

export default function useLastVisit({token, logout, patientId}) {
    const [lastVisitDate, setLastVisitDate] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!patientId || !token) {
            setLastVisitDate("")
            return
        }

        let isCancelled = false

        async function fetchLastVisit() {
            setIsLoading(true)

            try {
                const response = await listPatientVisits(token, patientId)
                const responseBody = await response.json()

                if (response.status === 200) {
                    const visits = normalizeQueueList(responseBody) ?? []
                    const latestFinishedVisit = visits
                        .filter((item) => item?.visit_status === "finished" && item?.visit_date)
                        .sort((left, right) => new Date(right.visit_date) - new Date(left.visit_date))[0]

                    if (!isCancelled) {
                        setLastVisitDate(latestFinishedVisit?.visit_date ?? "")
                    }
                }

                if (response.status === 401) {
                    logout()
                    return
                }
            } catch (error) {
                console.error(error)
                toast.error("Terjadi kesalahan saat memuat riwayat kunjungan.")

                if (!isCancelled) {
                    setLastVisitDate("")
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false)
                }
            }
        }

        fetchLastVisit()

        return () => {
            isCancelled = true
        }
    }, [token, logout, patientId])

    return {lastVisitDate, isLoading}
}