import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useLocalStorage } from "react-use"
import { queueDetails } from "../api/Queue.js"
import useAuth from "../../UseAuth.js"


export function useAssessmentPatient() {
    const { id } = useParams()
    const [token] = useLocalStorage("token", "")
    const { logout } = useAuth()

    const [patient, setPatient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!id || !token) {
            setLoading(false)
            return
        }

        let isMounted = true

        async function fetchPatient() {
            try {
                const response = await queueDetails(token, id)
                const body = await response.json()

                if (response.status === 200) {
                    if (isMounted) {
                        setPatient(body.data)
                        setError(null)
                    }
                }

                if (response.status === 401) {
                    logout()
                    return
                }

                if (!response.ok && isMounted) {
                    setError(body)
                }
            } catch (fetchError) {
                if (isMounted) {
                    setError(fetchError)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchPatient()

        return () => {
            isMounted = false
        }
    }, [id, token, logout])

    return { patient, loading, error }
}
