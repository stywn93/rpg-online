import {useEffect, useEffectEvent, useMemo, useState} from "react"
import {Controller, useForm} from "react-hook-form"
import {Datepicker} from "flowbite-react"
import toast from "react-hot-toast"
import {useLocation, useNavigate, useSearchParams} from "react-router-dom"
import {useLocalStorage} from "react-use"
import {listService} from "./lib/api/ServiceTypes.js"
import {getPatientDetail, listPatients, listPatientsByParent} from "./lib/api/Patient.js"
import {listAssesment} from "./lib/api/Assesment.js"
import useAuth from "./UseAuth.js"
import {formatIndonesianDate} from "./lib/utils/formatIndonesianDate.js"

function normalizeServiceOptions(payload) {
    const source = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : Array.isArray(payload)
                ? payload
                : []

    return source
        .map((item) => ({
            id: String(item?.id ?? item?.service_type_id ?? ""),
            name: item?.name ?? item?.nama ?? item?.service_name ?? item?.nama_layanan ?? "",
        }))
        .filter((item) => item.id && item.name)
}

function normalizePatientOptions(payload) {
    const source = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : Array.isArray(payload)
                ? payload
                : []

    return source
        .map((item) => ({
            ...item,
            id: String(item?.id ?? ""),
            nama: item?.nama_lengkap ?? item?.nama ?? "",
        }))
        .filter((item) => item.id && item.nama)
}

function normalizeAssessmentList(payload) {
    if (Array.isArray(payload?.data)) {
        return payload.data
    }

    if (Array.isArray(payload)) {
        return payload
    }

    return []
}

function parseAgeParts(ageValue) {
    const fallback = {years: "-", months: "-"}

    if (typeof ageValue !== "string") {
        return fallback
    }

    const yearsMatch = ageValue.match(/(\d+)\s*(tahun|thn)/i)
    const monthsMatch = ageValue.match(/(\d+)\s*(bulan|bln)/i)

    return {
        years: yearsMatch?.[1] ?? fallback.years,
        months: monthsMatch?.[1] ?? fallback.months,
    }
}

function getInitialPatientId(searchParams, locationState) {
    return searchParams.get("patientId")
        ?? locationState?.patientId
        ?? locationState?.patient?.id
        ?? ""
}

export default function ReservasiBaru() {
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {
            visitDate: new Date(),
        }
    })

    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [token] = useLocalStorage("token", "")
    const {logout, user} = useAuth()

    const [isLoading, setIsLoading] = useState(false)
    const [lastVisitDate, setLastVisitDate] = useState("")
    const [serviceOptions, setServiceOptions] = useState([])
    const [selectedServiceIds, setSelectedServiceIds] = useState([])
    const [isLoadingServices, setIsLoadingServices] = useState(false)
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false)

    const [patientOptions, setPatientOptions] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [patientSearchTerm, setPatientSearchTerm] = useState("")
    const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false)
    const [isLoadingPatients, setIsLoadingPatients] = useState(false)
    const [isLoadingPatientData, setIsLoadingPatientData] = useState(false)

    const initialPatientId = getInitialPatientId(searchParams, location.state)
    const normalizedRole = String(user?.role ?? "").toLowerCase()
    const isAdmin = normalizedRole === "admin"
    const isUserRole = normalizedRole === "user"
    const userId = String(user?.id ?? "")
    const isSingleChildUser = isUserRole && patientOptions.length === 1
    const ageParts = useMemo(() => parseAgeParts(selectedPatient?.usia), [selectedPatient?.usia])

    const fetchServices = useEffectEvent(async function getServices() {
        setIsLoadingServices(true)

        try {
            const response = await listService(token, {paging: 10})
            const responseBody = await response.json()

            if (response.status === 200) {
                setServiceOptions(normalizeServiceOptions(responseBody))
            }

            if (response.status === 401) {
                logout()
            }
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan saat memuat layanan.")
            setServiceOptions([])
        } finally {
            setIsLoadingServices(false)
        }
    })

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
            nama: patient?.nama_lengkap ?? patient?.nama ?? "",
        }
    })

    const fetchPatientOptionsForAdmin = useEffectEvent(async function getPatientsForAdmin(keyword) {
        setIsLoadingPatients(true)

        try {
            const response = await listPatients(token, {perPage: 10, searchTerm: keyword})
            const responseBody = await response.json()

            if (response.status === 200) {
                setPatientOptions(normalizePatientOptions(responseBody))
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

        try {
            const response = await listPatientsByParent(token, userId)
            const responseBody = await response.json()

            if (response.status === 200) {
                const children = normalizePatientOptions(responseBody)
                setPatientOptions(children)

                if (children.length === 1) {
                    setSelectedPatient(children[0])
                    setPatientSearchTerm(children[0].nama)
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

    const fetchLastVisit = useEffectEvent(async function getLastVisit(patientId) {
        if (!patientId) {
            setLastVisitDate("")
            return
        }

        setIsLoadingPatientData(true)

        try {
            const response = await listAssesment(token, patientId)
            const responseBody = await response.json()

            if (response.status === 200) {
                const assessments = normalizeAssessmentList(responseBody)
                const latestAssessment = assessments
                    .filter((item) => item?.tanggal_pemeriksaan)
                    .sort((left, right) => new Date(right.tanggal_pemeriksaan) - new Date(left.tanggal_pemeriksaan))[0]

                setLastVisitDate(latestAssessment?.tanggal_pemeriksaan ?? "")
            }

            if (response.status === 401) {
                logout()
            }
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan saat memuat riwayat kunjungan.")
            setLastVisitDate("")
        } finally {
            setIsLoadingPatientData(false)
        }
    })

    useEffect(() => {
        if (token) {
            fetchServices()
        }
    }, [token])

    useEffect(() => {
        if (!token || !initialPatientId) {
            return
        }

        let isCancelled = false

        async function hydrateInitialPatient() {
            const patient = await fetchPatientDetailById(initialPatientId)

            if (!isCancelled && patient) {
                setSelectedPatient(patient)
                setPatientSearchTerm(patient.nama)
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

        if (isAdmin) {
            const keyword = patientSearchTerm.trim()

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
        }
    }, [token, userId, isUserRole, isAdmin, patientSearchTerm])

    useEffect(() => {
        if (selectedPatient?.id && token) {
            fetchLastVisit(selectedPatient.id)
            return
        }

        setLastVisitDate("")
    }, [token, selectedPatient?.id])

    const visiblePatientOptions = useMemo(() => {
        const keyword = patientSearchTerm.trim().toLowerCase()

        if (!keyword) {
            return isAdmin ? [] : patientOptions
        }

        return patientOptions.filter((patient) =>
            [
                patient.nama,
                patient.nama_lengkap,
                patient.id,
            ].some((value) => String(value ?? "").toLowerCase().includes(keyword))
        )
    }, [isAdmin, patientOptions, patientSearchTerm])

    function handleServiceFilterChange(serviceId) {
        setSelectedServiceIds((currentIds) =>
            currentIds.includes(serviceId)
                ? currentIds.filter((id) => id !== serviceId)
                : [...currentIds, serviceId]
        )
    }

    function getSelectedServiceLabel() {
        if (selectedServiceIds.length === 0) {
            return "Pilih layanan"
        }

        if (selectedServiceIds.length === 1) {
            return serviceOptions.find((item) => item.id === selectedServiceIds[0])?.name ?? "1 layanan"
        }

        return `${selectedServiceIds.length} layanan dipilih`
    }

    function handlePatientSearchChange(event) {
        const nextValue = event.target.value
        setPatientSearchTerm(nextValue)
        setIsPatientDropdownOpen(true)

        if (selectedPatient && selectedPatient.nama !== nextValue) {
            setSelectedPatient(null)
            setLastVisitDate("")
        }
    }

    function handleSelectPatient(patient) {
        setSelectedPatient(patient)
        setPatientSearchTerm(patient.nama)
        setIsPatientDropdownOpen(false)
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
            navigate("/reservation/confirm", {
                state: {
                    reservation: {
                        patientId: selectedPatient.id,
                        name: selectedPatient.nama,
                        gender: selectedPatient.jenis_kelamin === "L" ? "Laki-laki" : selectedPatient.jenis_kelamin === "P" ? "Perempuan" : "-",
                        age: selectedPatient.usia ?? "-",
                        visitDate: data.visitDate,
                        services: selectedServiceIds,
                    },
                },
            })
            toast.success("Rencana kunjungan siap dikonfirmasi.", {id: toastId})
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan saat memproses rencana kunjungan.", {id: toastId})
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section>
            <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Buat Rencana Kunjungan
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div className="relative">
                                <label htmlFor="patient-search" className="block mb-2 text-sm font-medium text-gray-900">
                                    Nama Pasien
                                </label>
                                <input
                                    type="text"
                                    id="patient-search"
                                    value={patientSearchTerm}
                                    onChange={handlePatientSearchChange}
                                    onFocus={() => {
                                        if (!isSingleChildUser) {
                                            setIsPatientDropdownOpen(true)
                                        }
                                    }}
                                    readOnly={isSingleChildUser}
                                    className="read-only:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder={
                                        isSingleChildUser
                                            ? "Pasien otomatis dipilih"
                                            : isAdmin
                                                ? "Ketik nama pasien"
                                                : "Ketik nama anak"
                                    }
                                />

                                {!isSingleChildUser && isPatientDropdownOpen && (
                                    <div className="absolute left-0 right-0 z-10 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                                        <div className="max-h-60 overflow-y-auto">
                                            {isLoadingPatients && (
                                                <p className="px-3 py-2 text-sm text-slate-500">Memuat pasien...</p>
                                            )}

                                            {!isLoadingPatients && visiblePatientOptions.length === 0 && (
                                                <p className="px-3 py-2 text-sm text-slate-500">Pasien tidak ditemukan.</p>
                                            )}

                                            {!isLoadingPatients && visiblePatientOptions.map((patient) => (
                                                <button
                                                    key={patient.id}
                                                    type="button"
                                                    onClick={() => handleSelectPatient(patient)}
                                                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span className="block font-medium text-slate-900">{patient.nama}</span>
                                                    <span className="block text-xs text-slate-500">
                                                        {patient.usia ?? "-"} • {patient.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">
                                    Jenis Kelamin
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    id="gender"
                                    value={
                                        selectedPatient?.jenis_kelamin === "L"
                                            ? "Laki-laki"
                                            : selectedPatient?.jenis_kelamin === "P"
                                                ? "Perempuan"
                                                : ""
                                    }
                                    className="read-only:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Jenis kelamin"
                                />
                            </div>

                            <div>
                                <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900">
                                    Usia
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex w-full rounded-base">
                                        <input
                                            readOnly
                                            type="text"
                                            id="ageYear"
                                            value={ageParts.years}
                                            className="read-only:cursor-not-allowed w-full bg-gray-50 border-gray-300 rounded-none rounded-s-base px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm focus:ring-brand focus:border-brand placeholder:text-body"
                                            placeholder="0"
                                        />
                                        <span className="bg-gray-50 border-gray-300 inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border rounded-e-0 border-default-medium rounded-e-base">
                                            thn
                                        </span>
                                    </div>
                                    <div className="flex w-full rounded-base">
                                        <input
                                            readOnly
                                            type="text"
                                            id="ageMonth"
                                            value={ageParts.months}
                                            className="read-only:cursor-not-allowed w-full bg-gray-50 border-gray-300 rounded-none rounded-s-base px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm focus:ring-brand focus:border-brand placeholder:text-body"
                                            placeholder="0"
                                        />
                                        <span className="bg-gray-50 border-gray-300 inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border rounded-e-0 border-default-medium rounded-e-base">
                                            bln
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastVisit" className="block mb-2 text-sm font-medium text-gray-900">
                                    Kunjungan Terakhir
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    id="lastVisit"
                                    value={
                                        isLoadingPatientData
                                            ? "Memuat riwayat kunjungan..."
                                            : lastVisitDate
                                                ? formatIndonesianDate(lastVisitDate)
                                                : selectedPatient?.id
                                                    ? "Belum ada riwayat kunjungan"
                                                    : ""
                                    }
                                    className="read-only:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Riwayat kunjungan terakhir"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Jenis Layanan
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsServiceDropdownOpen((current) => !current)}
                                        className="inline-flex w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-primary-600 focus:outline-none"
                                    >
                                        <span className="truncate">{getSelectedServiceLabel()}</span>
                                        <span className="ml-3 text-xs text-slate-500">{isServiceDropdownOpen ? "Tutup" : "Pilih"}</span>
                                    </button>

                                    {isServiceDropdownOpen && (
                                        <div className="absolute left-0 z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                                            <div className="mb-2 flex items-center justify-between">
                                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                                    Pilih layanan
                                                </p>
                                                {selectedServiceIds.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedServiceIds([])}
                                                        className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        Bersihkan
                                                    </button>
                                                )}
                                            </div>

                                            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                                                {isLoadingServices && (
                                                    <p className="py-2 text-sm text-slate-500">Memuat layanan...</p>
                                                )}

                                                {!isLoadingServices && serviceOptions.length === 0 && (
                                                    <p className="py-2 text-sm text-slate-500">Data layanan tidak tersedia.</p>
                                                )}

                                                {!isLoadingServices && serviceOptions.map((service) => (
                                                    <label
                                                        key={service.id}
                                                        className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedServiceIds.includes(service.id)}
                                                            onChange={() => handleServiceFilterChange(service.id)}
                                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span>{service.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="visitDate" className="block mb-2 text-sm font-medium text-gray-900">
                                    Tanggal Rencana Berkunjung
                                </label>
                                <Controller
                                    name="visitDate"
                                    control={control}
                                    rules={{required: "Tanggal wajib diisi"}}
                                    render={({field}) => (
                                        <Datepicker
                                            language="id-ID"
                                            minDate={new Date()}
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                        />
                                    )}
                                />
                                {errors.visitDate && (
                                    <span className="text-red-500 text-sm">{errors.visitDate.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Memproses..." : "Simpan"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
