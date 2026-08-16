import {useEffect, useState} from "react"
import {getPatientDetail} from "../api/Patient.js"
import {listVisitServices} from "../api/Queue.js"
import {normalizePatientDetail, normalizeVisitServiceList} from "../utils/Normalization.js"

export default function usePatientDetail({token, patientId, logout}) {
    const [patient, setPatient] = useState(null)
    const [visits, setVisits] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!token || !patientId) {
            return
        }

        const controller = new AbortController()

        async function fetchDetail() {
            setIsLoading(true)
            setError(null)

            try {
                const [patientResponse, visitsResponse] = await Promise.all([
                    getPatientDetail(token, patientId),
                    listVisitServices(token, {patientId}),
                ])

                const patientBody = await patientResponse.json()
                const visitsBody = await visitsResponse.json()

                if (patientResponse.status === 401 || visitsResponse.status === 401) {
                    logout()
                    return
                }

                if (patientResponse.status === 200) {
                    setPatient(normalizePatientDetail(patientBody))
                } else {
                    setError(patientBody)
                }

                if (visitsResponse.status === 200) {
                    setVisits(normalizeVisitServiceList(visitsBody))
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

        fetchDetail()

        return () => controller.abort()
    }, [token, patientId, logout])

    return {
        patient,
        visits,
        isLoading,
        error,
    }
}