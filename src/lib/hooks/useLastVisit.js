import {useEffect, useState} from "react"
import toast from "react-hot-toast"
import {listAssesment} from "../api/Assesment.js"
import {normalizeAssessment} from "../utils/Normalization.js"

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
                const response = await listAssesment(token, patientId)
                const responseBody = await response.json()

                if (response.status === 200) {
                    const assessments = normalizeAssessment(responseBody)
                    const latestAssessment = assessments
                        .filter((item) => item?.tanggal_pemeriksaan)
                        .sort((left, right) => new Date(right.tanggal_pemeriksaan) - new Date(left.tanggal_pemeriksaan))[0]

                    if (!isCancelled) {
                        setLastVisitDate(latestAssessment?.tanggal_pemeriksaan ?? "")
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