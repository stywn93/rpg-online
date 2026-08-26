import {useEffect, useMemo, useState} from "react"
import {listPatients, listPatientsByParent} from "../api/Patient.js"
import {normalizePatientList} from "../utils/Normalization.js"
import useDebouncedValue from "./useDebouncedValue.js"

export default function usePatientList({token, logout, isUserRole = false, userId = ""}) {
    const [patients, setPatients] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const debouncedSearchTerm = useDebouncedValue(searchTerm, 400)

    useEffect(() => {
        if (!token || isUserRole) {
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
    }, [token, debouncedSearchTerm, logout, isUserRole, userId])

    useEffect(() => {
        if (!token || !isUserRole || !userId) {
            return
        }

        const controller = new AbortController()

        async function fetchChildren() {
            setIsLoading(true)
            setError(null)

            try {
                const response = await listPatientsByParent(token, userId)
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

        fetchChildren()

        return () => controller.abort()
    }, [token, isUserRole, userId, logout])

    const filteredPatients = useMemo(() => {
        if (!isUserRole) {
            return patients
        }

        const keyword = debouncedSearchTerm.trim().toLowerCase()

        if (!keyword) {
            return patients
        }

        return patients.filter((patient) =>
            [
                patient.name,
                patient.id,
                patient.parent_name,
                patient.address,
            ].some((value) => String(value ?? "").toLowerCase().includes(keyword))
        )
    }, [isUserRole, patients, debouncedSearchTerm])

    return {
        patients: filteredPatients,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
    }
}
