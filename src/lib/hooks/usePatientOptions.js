import {useEffect, useEffectEvent, useMemo, useState} from "react"
import toast from "react-hot-toast"
import {getPatientDetail, listPatients, listPatientsByParent} from "../api/Patient.js"
import {normalizePeopleDetail} from "../utils/Normalization.js"

export default function usePatientOptions({
    token,
    logout,
    isAdmin,
    isUserRole,
    userId,
    initialPatientId,
}) {
    const [patientOptions, setPatientOptions] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [patientSearchTerm, setPatientSearchTerm] = useState("")
    const [showAllPatients, setShowAllPatients] = useState(false)
    const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false)
    const [isLoadingPatients, setIsLoadingPatients] = useState(false)

    const fetchPatientDetailById = useEffectEvent(async function getPatientById(patientId) {
        if (!patientId) {
            return null
        }

        const response = await getPatientDetail(token, patientId)
        const responseBody = await response.json()

        if (response.status === 401) {
            logout()
            return null
        }

        if (response.status !== 200) {
            return null
        }

        const patient = responseBody?.data

        if (!patient) {
            return null
        }

        return {
            ...patient,
            id: String(patient.id ?? patientId),
            name: patient?.name ?? patient?.nama_lengkap ?? patient?.nama ?? "",
        }
    })

    const fetchPatientOptionsForAdmin = useEffectEvent(async function getPatientsForAdmin(keyword, {showAll = false} = {}) {
        setIsLoadingPatients(true)

        try {
            const response = await listPatients(token, {
                perPage: showAll ? 1000 : 10,
                searchTerm: showAll ? "" : keyword,
            })
            const responseBody = await response.json()

            if (response.status === 200) {
                setPatientOptions(normalizePeopleDetail(responseBody))
                console.log("list all patients is triggered")
            }

            if (response.status === 401) {
                logout()
            }
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan saat memuat daftar pasien.")
            setPatientOptions([])
        } finally {
            setIsLoadingPatients(false)
        }
    })

    const fetchChildrenForUser = useEffectEvent(async function getChildrenForUser() {
        if (!userId) {
            setPatientOptions([])
            return
        }

        setIsLoadingPatients(true)
        console.log("fetchChildrenForUser", userId)

        try {
            const response = await listPatientsByParent(token, userId)
            const responseBody = await response.json()

            if (response.status === 200) {
                console.log("list patients by parent is triggered")
                const children = normalizePeopleDetail(responseBody)
                setPatientOptions(children)

                if (children.length === 1) {
                    setSelectedPatient(children[0])
                    setPatientSearchTerm(children[0].name)
                }
            }

            if (response.status === 401) {
                logout()
            }
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan saat memuat data anak.")
            setPatientOptions([])
        } finally {
            setIsLoadingPatients(false)
        }
    })

    useEffect(() => {
        if (!token || !initialPatientId) {
            return
        }

        let isCancelled = false

        async function hydrateInitialPatient() {
            const patient = await fetchPatientDetailById(initialPatientId)

            if (!isCancelled && patient) {
                setSelectedPatient(patient)
                setPatientSearchTerm(patient.name)
            }
        }

        hydrateInitialPatient()

        return () => {
            isCancelled = true
        }
    }, [token, initialPatientId])

    useEffect(() => {
        if (!token) {
            return
        }

        if (isUserRole) {
            fetchChildrenForUser()
            return
        }

        if (!isAdmin) {
            return
        }

        const keyword = patientSearchTerm.trim()

        if (showAllPatients) {
            const timerId = window.setTimeout(() => {
                fetchPatientOptionsForAdmin("", {showAll: true})
            }, 300)

            return () => {
                window.clearTimeout(timerId)
            }
        }

        if (!keyword) {
            setPatientOptions([])
            return
        }

        const timerId = window.setTimeout(() => {
            fetchPatientOptionsForAdmin(keyword)
        }, 300)

        return () => {
            window.clearTimeout(timerId)
        }
    }, [token, userId, isUserRole, isAdmin, patientSearchTerm, showAllPatients])

    const visiblePatientOptions = useMemo(() => {
        const keyword = patientSearchTerm.trim().toLowerCase()

        if (showAllPatients) {
            return patientOptions
        }

        if (!keyword) {
            return isAdmin ? [] : patientOptions
        }

        return patientOptions.filter((patient) =>
            [
                patient.name,
                patient.id,
            ].some((value) => String(value ?? "").toLowerCase().includes(keyword))
        )
    }, [isAdmin, patientOptions, patientSearchTerm, showAllPatients])

    const isSingleChildUser = isUserRole && patientOptions.length === 1

    return {
        patientOptions,
        selectedPatient,
        setSelectedPatient,
        patientSearchTerm,
        setPatientSearchTerm,
        showAllPatients,
        setShowAllPatients,
        isPatientDropdownOpen,
        setIsPatientDropdownOpen,
        isLoadingPatients,
        visiblePatientOptions,
        isSingleChildUser,
    }
}