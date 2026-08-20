import {useLocalStorage} from "react-use"
import {useNavigate} from "react-router-dom"
import useAuth from "../auth/UseAuth.js"
import useVisitServiceList from "../lib/hooks/useVisitServiceList.js"
import useServiceOptions from "../lib/hooks/useServiceOptions.js"
import QueueFilterBar from "./QueueFilterBar.jsx"
import QueueTable from "./QueueTable.jsx"

export default function VisitServiceQueue() {
    const [token] = useLocalStorage("token", "")
    const {logout, user} = useAuth()
    const navigate = useNavigate()

    const {
        queues,
        isLoading,
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
        resetFilters,
    } = useVisitServiceList({token, logout})

    const {activeServiceOptions, isLoading: isLoadingServices} = useServiceOptions({token, logout})

    const handlePrimaryAction = (item) => {
        navigate(`/reservation/fill-service/${item.id ?? item.visit_id}`, {
            state: {visit: item},
        })
    }

    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <QueueFilterBar
                    totalCount={queues.length}
                    title="Antrian Layanan"
                    description="Daftar pasien yang sudah hadir dan siap dilayani."
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
                    showScan={false}
                    onReset={resetFilters}
                    onScan={() => {}}
                />
                <QueueTable
                    queues={queues}
                    isLoading={isLoading}
                    error={error}
                    isUpdating={false}
                    userRole={user?.role}
                    showServices
                    onPrimaryAction={handlePrimaryAction}
                />
            </div>
        </section>
    )
}
