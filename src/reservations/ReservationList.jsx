import {useState} from "react"
import {useNavigate} from "react-router-dom"
import toast from "react-hot-toast"
import {useLocalStorage} from "react-use"
import useAuth from "../auth/UseAuth.js"
import useQueueList from "../lib/hooks/useQueueList.js"
import useServiceOptions from "../lib/hooks/useServiceOptions.js"
import QueueFilterBar from "./QueueFilterBar.jsx"
import QueueTable from "./QueueTable.jsx"
import QrScanner from "../components/QrScanner.jsx"

export default function ReservationList() {
    const [token] = useLocalStorage("token", "")
    const {logout} = useAuth()
    const navigate = useNavigate()

    const [isScannerOpen, setIsScannerOpen] = useState(false)

    const {
        queues,
        isLoading,
        isUpdating,
        error,
        selectedDate,
        setSelectedDate,
        status,
        setStatus,
        searchTerm,
        setSearchTerm,
        selectedServiceIds,
        setSelectedServiceIds,
        toggleService,
        checkIn,
        markAbsent,
        markCalled,
        resetFilters,
    } = useQueueList({token, logout})

    const {activeServiceOptions, isLoading: isLoadingServices} = useServiceOptions({token, logout})

    const handlePrimaryAction = (item) => {
        console.log(item)
        if (item === "waiting") {
            markCalled(item.queue_id)
            navigate(`/reservation/assesment/${item.queue_id}`)
            return
        }

        // checkIn(item.queue_id)
    }

    const handleQrScan = (scannedId) => {
        if (!scannedId) {
            toast.error("QR code tidak valid.")
            return
        }

        const matchedQueue = queues.find((q) => String(q.queue_id) === String(scannedId))

        if (matchedQueue) {
            checkIn(matchedQueue.queue_id)
            toast.success(`Pasien ${matchedQueue.nama_pasien} berhasil check-in.`)
        } else {
            checkIn(scannedId)
            toast.success(`Check-in berhasil untuk ID ${scannedId}.`, {id: "scan-checkin"})
        }
    }

    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <QueueFilterBar
                    totalCount={queues.length}
                    selectedDate={selectedDate}
                    onDateChange={(event) => setSelectedDate(event.target.value)}
                    status={status}
                    onStatusChange={(event) => setStatus(event.target.value)}
                    searchTerm={searchTerm}
                    onSearchChange={(event) => setSearchTerm(event.target.value)}
                    selectedServiceIds={selectedServiceIds}
                    activeServiceOptions={activeServiceOptions}
                    isServicesLoading={isLoadingServices}
                    onToggleService={toggleService}
                    onClearServices={() => setSelectedServiceIds([])}
                    onReset={resetFilters}
                    onScan={() => setIsScannerOpen(true)}
                />
                <QueueTable
                    queues={queues}
                    isLoading={isLoading}
                    error={error}
                    isUpdating={isUpdating}
                    onPrimaryAction={handlePrimaryAction}
                    onAbsent={markAbsent}
                />
            </div>
            <QrScanner
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleQrScan}
            />
        </section>
    )
}