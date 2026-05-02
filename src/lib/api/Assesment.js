import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useLocalStorage } from "react-use"
import { queueDetails } from "./lib/api/Queue"
import useAuth from "./UseAuth"

export function useAssessmentPatient() {
    const { id } = useParams()
    const [token] = useLocalStorage("token", "")
    const { logout } = useAuth()

    const [patient, setPatient] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPatient() {
            try {
                const response = await queueDetails(token, id)
                const body = await response.json()

                if (response.status === 200) {
                    setPatient(body.data)
                }

                if (response.status === 401) {
                    logout()
                }
            } finally {
                setLoading(false)
            }
        }

        fetchPatient()
    }, [id, token, logout])

    return { patient, loading }
}
