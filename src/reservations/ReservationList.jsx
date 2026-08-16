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
        markCalled,
        resetFilters,
    } = useQueueList({token, logout})

    const {activeServiceOptions, isLoading: isLoadingServices} = useServiceOptions({token, logout})

    const handlePrimaryAction = (item) => {
        console.log(item.visit_id)
        if (item.visit_status === "waiting") {
            console.log("if condition is fulfilled")
            markCalled(item.visit_id)
            // navigate(`/reservation/assesment/${item.queue_id}`)
            return
        }

    }

    
    const handleQrScan = (scannedId) => {
        if (!scannedId) {
            toast.error("QR code tidak valid.", {duration: 3000})
            return
        }

        const matchedQueue = queues.find((q) => String(q.visit_id) === String(scannedId))

        if (matchedQueue) {
            console.log(`matched queue found` + ` with visit_id: ${matchedQueue.visit_id}`)
            markCalled(matchedQueue.visit_id)
            toast.success(`Pasien ${matchedQueue.patient_name} berhasil check-in.`, {duration: 3000})
        } else {
            toast.error(`ID Kunjungan ${scannedId} tidak ditemukan.`, {duration: 3000})
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