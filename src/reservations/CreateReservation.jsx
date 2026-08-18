import {useState} from "react"
import {useForm} from "react-hook-form"
import toast from "react-hot-toast"
import {useLocation, useNavigate, useSearchParams} from "react-router-dom"
import {useLocalStorage} from "react-use"
import {createQueue} from "../lib/api/Queue.js"
import useAuth from "../auth/UseAuth.js"
import useServiceOptions from "../lib/hooks/useServiceOptions.js"
import usePatientOptions from "../lib/hooks/usePatientOptions.js"
import useLastVisit from "../lib/hooks/useLastVisit.js"
import ReservationForm from "./ReservationForm.jsx"

function getInitialPatientId(searchParams, locationState) {
    return searchParams.get("patientId")
        ?? locationState?.patientId
        ?? locationState?.patient?.id
        ?? ""
}

function formatVisitDateForApi(value) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        return ""
    }

    const localDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000)

    return localDate.toISOString().split("T")[0]
}

export default function CreateReservation() {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [token] = useLocalStorage("token", "")
    const {logout, user} = useAuth()

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {
            visitDate: new Date(),
        }
    })

    const normalizedRole = String(user?.role ?? "").toLowerCase()
    const isAdmin = normalizedRole === "admin"
    const isUserRole = normalizedRole === "user"
    const userId = String(user?.id ?? "")
    const initialPatientId = getInitialPatientId(searchParams, location.state)

    const {activeServiceOptions, isLoading: isLoadingServices} = useServiceOptions({token, logout})

    const {
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
    } = usePatientOptions({token, logout, isAdmin, isUserRole, userId, initialPatientId})

    const {lastVisitDate, isLoading: isLoadingPatientData} = useLastVisit({
        token,
        logout,
        patientId: selectedPatient?.id,
    })

    const [selectedServiceIds, setSelectedServiceIds] = useState([])
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    function handlePatientSearchChange(event) {
        const nextValue = event.target.value
        setPatientSearchTerm(nextValue)
        setIsPatientDropdownOpen(true)

        if (showAllPatients) {
            setShowAllPatients(false)
        }

        if (selectedPatient && selectedPatient.nama !== nextValue) {
            setSelectedPatient(null)
        }
    }

    function handlePatientSearchKeyDown(event) {
        if (!isAdmin) {
            return
        }

        if (event.key === " ") {
            const currentValue = event.currentTarget.value

            const isThirdConsecutiveSpace = currentValue.length >= 2
                && currentValue.trim() === ""
                && currentValue.endsWith("  ")

            if (isThirdConsecutiveSpace) {
                event.preventDefault()
                setPatientSearchTerm("")
                setShowAllPatients(true)
                setIsPatientDropdownOpen(true)

                if (selectedPatient) {
                    setSelectedPatient(null)
                }
            }
        }
    }

    function handlePatientFocus() {
        if (!isSingleChildUser) {
            setIsPatientDropdownOpen(true)
        }
    }

    function handleSelectPatient(patient) {
        setSelectedPatient(patient)
        setPatientSearchTerm(patient.nama)
        setIsPatientDropdownOpen(false)
    }

    function handleServiceFilterChange(serviceId) {
        setSelectedServiceIds((currentIds) =>
            currentIds.includes(serviceId)
                ? currentIds.filter((id) => id !== serviceId)
                : [...currentIds, serviceId]
        )
    }

    function handleClearServices() {
        setSelectedServiceIds([])
    }

    const onSubmit = async (data) => {
        if (!selectedPatient?.id) {
            toast.error("Pilih pasien terlebih dahulu.")
            return
        }

        if (selectedServiceIds.length === 0) {
            toast.error("Pilih minimal satu jenis layanan.")
            return
        }

        const toastId = toast.loading("Memproses...")
        setIsLoading(true)

        try {
            const payload = {
                patient_id: Number(selectedPatient.id),
                tanggal_kunjungan: formatVisitDateForApi(data.visitDate),
                service_type_ids: selectedServiceIds.map((id) => Number(id)),
                status: "booked"
            }

            const response = await createQueue(token, payload)
            const responseBody = await response.json()

            if (response.status === 401) {
                logout()
                return
            }

            if (response.status !== 200 && response.status !== 201) {
                throw new Error(
                    responseBody?.message
                    ?? responseBody?.messages?.error
                    ?? "Reservasi gagal disimpan."
                )
            }

            const savedQueue = responseBody?.data ?? responseBody ?? {}

            navigate("/reservation/confirm", {
                state: {
                    reservation: {
                        patientId: selectedPatient.id,
                        name: selectedPatient.nama,
                        gender: selectedPatient.jenis_kelamin === "L" ? "Laki-laki" : selectedPatient.jenis_kelamin === "P" ? "Perempuan" : "-",
                        age: selectedPatient.usia ?? "-",
                        visitDate: data.visitDate,
                        services: selectedServiceIds,
                        referenceNumber: savedQueue.kode_booking ?? savedQueue.referenceCode ?? savedQueue.reference_number ?? "-",
                        queueNumber: savedQueue.nomor_antrian ?? savedQueue.queue_number ?? "-",
                        queueId: savedQueue.id ?? null,
                    },
                },
            })
            toast.success("Rencana kunjungan siap dikonfirmasi.", {id: toastId})
        } catch (error) {
            console.error(error)
            toast.error(error.message || "Terjadi kesalahan saat memproses rencana kunjungan.", {id: toastId})
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ReservationForm
            control={control}
            errors={errors}
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isLoading}
            selectedPatient={selectedPatient}
            lastVisitDate={lastVisitDate}
            isLoadingPatientData={isLoadingPatientData}
            patientSearchTerm={patientSearchTerm}
            isSingleChildUser={isSingleChildUser}
            isAdmin={isAdmin}
            isPatientDropdownOpen={isPatientDropdownOpen}
            onPatientSearchChange={handlePatientSearchChange}
            onPatientSearchKeyDown={handlePatientSearchKeyDown}
            onPatientFocus={handlePatientFocus}
            onSelectPatient={handleSelectPatient}
            isLoadingPatients={isLoadingPatients}
            visiblePatientOptions={visiblePatientOptions}
            activeServiceOptions={activeServiceOptions}
            selectedServiceIds={selectedServiceIds}
            isLoadingServices={isLoadingServices}
            isServiceDropdownOpen={isServiceDropdownOpen}
            onToggleServiceDropdown={() => setIsServiceDropdownOpen((current) => !current)}
            onSelectService={handleServiceFilterChange}
            onClearServices={handleClearServices}
        />
    )
}