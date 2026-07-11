import {useEffect, useEffectEvent, useMemo, useState} from "react"
import {useNavigate} from "react-router-dom"
import toast from "react-hot-toast"
import {Scan} from "lucide-react"
import {queueList, updateQueue as patchQueueStatus} from "../lib/api/Queue.js"
import {useLocalStorage} from "react-use"
import useAuth from "../auth/UseAuth.js"
import {formatIndonesianDate} from "../lib/utils/formatIndonesianDate.js"
import {listService} from "../lib/api/ServiceTypes.js"
import QrScanner from "../components/QrScanner.jsx"
import {isUser} from "../auth/permissions.js"


const rowStyles = {
    called: "bg-blue-100 dark:bg-blue-900/50",
    no_show: "bg-red-100 dark:bg-red-900/50",
    waiting: "bg-white dark:bg-slate-900",
    finished: "bg-green-100 dark:bg-green-900/50"
}

function normalizeQueueList(payload) {
    if (Array.isArray(payload?.data)) {
        return payload.data
    }

    if (Array.isArray(payload)) {
        return payload
    }

    return null
}

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
            aktif: item?.aktif,
        }))
        .filter((item) => item.id && item.name)
}

function getTodayDate() {
    const now = new Date()
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)

    return localDate.toISOString().split("T")[0]
}

function splitServiceTypeNames(serviceTypeNames) {
    if (Array.isArray(serviceTypeNames)) {
        return serviceTypeNames.map((item) => String(item).trim()).filter(Boolean)
    }

    if (typeof serviceTypeNames !== "string") {
        return []
    }

    return serviceTypeNames
        .split(/[|,;\n]+/)
        .map((item) => item.trim())
        .filter(Boolean)
}

function ActionButton({children, variant = "primary", onClick}) {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-800 cursor-pointer",
        accent: "bg-fuchsia-600 text-white hover:bg-fuchsia-800 cursor-pointer",
        secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer",
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition ${variants[variant]}`}
        >
            {children}
        </button>
    )
}

export default function ReservationList() {
    const [token, _] = useLocalStorage("token", "")
    const navigate = useNavigate()
    const todayDate = getTodayDate()

    const [selectedDate, setSelectedDate] = useLocalStorage("tanggalKunjungan", todayDate)
    const [queues, setQueues] = useState([])
    const [status, setStatus] = useState("")
    const {logout, user} = useAuth()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [serviceOptions, setServiceOptions] = useState([])
    const [selectedServiceIds, setSelectedServiceIds] = useState([])
    const [isLoadingServices, setIsLoadingServices] = useState(false)
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false)
    const [isScannerOpen, setIsScannerOpen] = useState(false)
    const activeServiceOptions = useMemo(
        () => serviceOptions.filter((item) => item.aktif == 1),
        [serviceOptions]
    )

    // perbaiki cara get antrian ini, nampaknya terlalu berantakan.
    // cek API nya, terlalu banyak redundansi
    const latestQueue = useEffectEvent(async function fetchQueue() {
        //useEffectEvent adalah hooks yang diperkenalkan sejak react 19 untuk memastikan useEffect mendapatkan state terbaru
        try {
            const parentId = isUser(user) ? String(user.id) : ""
            const response = await queueList(token, selectedDate, currentPage, 50, searchTerm, status, selectedServiceIds, parentId)
            const responseBody = await response.json();

            if (response.status === 200) {
                setQueues(normalizeQueueList(responseBody?.data) ?? normalizeQueueList(responseBody) ?? [])
            }
            if (response.status === 401) {
                logout()
            }
        } catch (error) {
            console.log(error)
        }

    })

    const latestServiceOptions = useEffectEvent(async function fetchServiceOptions() {
        setIsLoadingServices(true)

        try {
            const response = await listService(token, {paging: 100})
            const responseBody = await response.json()

            if (response.status === 200) {
                setServiceOptions(normalizeServiceOptions(responseBody))
            }

            if (response.status === 401) {
                logout()
            }
        } catch (error) {
            console.log(error)
            setServiceOptions([])
        } finally {
            setIsLoadingServices(false)
        }
    })
//token, tanggal, page = 1, perPage = 50, searchTerm = "", status = ""
    async function updateQueueStatus(id, status,) {
        try {
            const response = await patchQueueStatus(token, id, status)
            const responseBody = await response.json();

            if (response.status === 200) {
                const nextQueues = normalizeQueueList(responseBody?.data) ?? normalizeQueueList(responseBody)

                if (nextQueues) {
                    setQueues(nextQueues)
                } else if (responseBody?.data && typeof responseBody.data === "object") {
                    setQueues((currentQueue) =>
                        currentQueue.map((item) =>
                            item.id === id
                                ? {...item, ...responseBody.data}
                                : item
                        )
                    )
                }
            }
            if (response.status === 401) {
                logout()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCheckIn = (id) => {
        setQueues((currentQueue) =>
            currentQueue.map((item) =>
                item.id === id
                    ? {...item, status: "checked_in"}
                    : item
            )
        )
        updateQueueStatus(id, "checked_in")
    }

    function handleStatusChange(e){
        const newStatus = e.target.value
        setStatus(newStatus)
        setCurrentPage(1)
    }
    function handleSearchChange(event) {
        const nextSearchTerm = event.target.value
        setSearchTerm(nextSearchTerm)
        setCurrentPage(1)
    }

    function handleQrScan(scannedId) {
        if (!scannedId) {
            toast.error("QR code tidak valid.")
            return
        }

        const matchedQueue = queues.find((q) => String(q.id) === String(scannedId))

        if (matchedQueue) {
            handleCheckIn(matchedQueue.id)
            toast.success(`Pasien ${matchedQueue.nama_pasien} berhasil check-in.`)
        } else {
            toast.success(`Memproses check-in untuk ID ${scannedId}...`)
            updateQueueStatus(scannedId, "checked_in")
            toast.success(`Check-in berhasil.`, {id: "scan-checkin"})
        }
    }

    function handleResetFilters() {
        setSelectedDate(todayDate)
        setStatus("")
        setSearchTerm("")
        setSelectedServiceIds([])
        setIsServiceDropdownOpen(false)
        setCurrentPage(1)
    }

    function handleServiceFilterChange(serviceId) {
        setSelectedServiceIds((currentIds) => {
            const nextIds = currentIds.includes(serviceId)
                ? currentIds.filter((id) => id !== serviceId)
                : [...currentIds, serviceId]

            return nextIds
        })
        setCurrentPage(1)
    }

    function getSelectedServiceLabel() {
        if (selectedServiceIds.length === 0) {
            return "Semua layanan"
        }

        if (selectedServiceIds.length === 1) {
            return activeServiceOptions.find((item) => item.id === selectedServiceIds[0])?.name ?? "1 layanan"
        }

        return `${selectedServiceIds.length} layanan dipilih`
    }

    const handleAbsent = (id) => {
        setQueues((currentQueue) =>
            currentQueue.map((item) =>
                item.id === id
                    ? {...item, status: "no_show"}
                    : item
            )
        )
        updateQueueStatus(id, "no_show")
    }

    const handlePrimaryAction = (item) => {
        console.log("clicked")
        if (item.status === "checked_in" || item.status === "called") {
            updateQueueStatus(item.id, "called")
            navigate(`/reservation/assesment/${item.id}`, {
                state: {
                    patientName: item.patientName,
                    gender: item.gender,
                    age: item.age,
                    visitDate: item.visitDate,
                    referenceCode: item.referenceCode,
                },
            })
            return
        }

        handleCheckIn(item.id)
    }
    useEffect(() => {
        setSelectedDate(todayDate)
    }, [setSelectedDate, todayDate])

    useEffect(() => {
        latestQueue()
    }, [token, selectedDate, currentPage, searchTerm, status, selectedServiceIds])

    useEffect(() => {
        if (token) {
            latestServiceOptions()
        }
    }, [token])

    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Antrian Kunjungan
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Daftar pasien yang sudah memiliki rencana kunjungan.
                        </p>
                    </div>
                    <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Total {queues.length} pasien
                    </div>
                </div>

                <div
                    className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <label htmlFor="visit-date-filter" className="text-sm font-medium text-slate-700 dark:text-slate-100 mr-3">
                            Tanggal
                        </label>
                        <input
                            id="visit-date-filter"
                            type="date"
                            value={selectedDate ?? ""}
                            onChange={(event) => setSelectedDate(event.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-900 dark:bg-slate-950 dark:text-slate-100 focus:border-blue-500 focus:outline-none sm:w-56"
                        />
                        <label htmlFor="queue-status"
                               className="text-sm font-medium text-slate-700 dark:text-slate-100 mr-3 ml-3">
                            Status
                        </label>
                        <select
                            id="queue-status"
                            value={status}
                            onChange={handleStatusChange}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none sm:w-56"
                        >
                            <option value="">Semua</option>
                            <option value="booked">Belum Hadir</option>
                            <option value="checked_in">Hadir</option>
                            <option value="called">Dalam Pemeriksaan</option>
                            <option value="finished">Selesai Dilayani</option>
                            <option value="no_show">Tidak Hadir</option>
                        </select>
                        <label htmlFor="parent-search"
                               className="text-sm font-medium text-slate-700 dark:text-slate-100 ml-3 mr-3">
                            Nama Pasien
                        </label>
                        <input
                            id="parent-search"
                            type="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Masukkan nama pasien"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none sm:w-56"
                        />
                        <div className="relative inline-block">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-100 ml-3 mr-3">
                                Layanan
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsServiceDropdownOpen((current) => !current)}
                                className="inline-flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none sm:w-56"
                            >
                                <span className="truncate">{getSelectedServiceLabel()}</span>
                                <span className="ml-3 text-xs text-slate-400">{isServiceDropdownOpen ? "Tutup" : "Pilih"}</span>
                            </button>

                            {isServiceDropdownOpen && (
                                <div className="absolute left-0 z-10 mt-2 w-full min-w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                            Filter layanan
                                        </p>
                                        {selectedServiceIds.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedServiceIds([])
                                                    setCurrentPage(1)
                                                }}
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

                                        {!isLoadingServices && activeServiceOptions.length === 0 && (
                                            <p className="py-2 text-sm text-slate-500">Data layanan tidak tersedia.</p>
                                        )}

                                        {!isLoadingServices && activeServiceOptions.map((service) => (
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
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setIsScannerOpen(true)}
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            <Scan size={16} className="mr-1.5" />
                            Scan QR
                        </button>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            disabled={!selectedDate && !status && !searchTerm && selectedServiceIds.length === 0}
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Reset filter
                        </button>
                    </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead>
                        <tr className="text-slate-500 dark:text-slate-400">
                            <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Nomor Antrian</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Nama Pasien</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Jenis Kelamin</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Usia</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Tanggal Kunjungan</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Layanan</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {queues.map(((queue) => (
                            <tr key={queue.id} className={rowStyles[queue.status] ?? rowStyles.waiting}>
                                <td className="border-b border-slate-100 px-4 py-4 font-bold text-slate-900 dark:border-slate-700 dark:text-slate-100">
                                    {queue.nomor_antrian}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                    {queue.nama_pasien}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                    {queue.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                    {queue.usia}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                    {formatIndonesianDate(queue.tanggal_kunjungan)}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
                                    <div className="flex flex-wrap gap-2">
                                        {splitServiceTypeNames(queue.service_type_names).map((service, index) => (
                                            <span
                                                key={`${queue.id}-${service}-${index}`}
                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                            >
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
                                    <div className={`${queue.status === "finished" ? "hidden" : "flex"} flex-wrap gap-2`}>
                                        {queue.status !== "no_show" && (
                                            <ActionButton
                                                variant={queue.status === "checked_in" || queue.status === "called" ? "accent" : "primary"}
                                                onClick={() => handlePrimaryAction(queue)}
                                            >
                                                {queue.status === "checked_in" || queue.status === "called" ? "Melayani" : "Check-in"}
                                            </ActionButton>
                                        )}

                                        {queue.status !== "checked_in" && queue.status !== "no_show" && queue.status !== "called" && (
                                            <ActionButton
                                                variant="secondary"
                                                onClick={() => handleAbsent(queue.id)}
                                            >
                                                Tidak Hadir
                                            </ActionButton>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )))}
                        {queues.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                    Tidak ada data kunjungan pada tanggal yang dipilih.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-950">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Keterangan</p>
                    <div className="mt-3 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400 sm:flex-row sm:flex-wrap sm:gap-5">
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full bg-blue-500"/>
                            <span>Warna biru artinya Sedang Dalam Pemeriksaan</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full bg-red-500"/>
                            <span>Warna merah artinya Tidak Hadir</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900"/>
                            <span>Tanpa warna artinya Belum Hadir</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full bg-green-500"/>
                            <span>Warna hijau artinya Selesai Dilayani</span>
                        </div>
                    </div>
                </div>
            </div>
            <QrScanner
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleQrScan}
            />
        </section>
    )
}
