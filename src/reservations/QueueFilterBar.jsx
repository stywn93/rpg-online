import {useState} from "react"
import {Calendar, ChevronDown, Filter, Scan} from "lucide-react"

export default function QueueFilterBar({
    totalCount,
    selectedDate,
    onDateChange,
    status,
    onStatusChange,
    searchTerm,
    onSearchChange,
    showServiceFilter = true,
    selectedServiceIds,
    activeServiceOptions,
    isServicesLoading,
    onToggleService,
    onClearServices,
    showScan = true,
    onReset,
    onScan,
    title = "Antrian Kunjungan",
    description = "Daftar pasien yang sudah memiliki rencana kunjungan.",
}) {
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(() => window.matchMedia("(min-width: 640px)").matches)

    const canReset = !selectedDate && !status && !searchTerm && selectedServiceIds.length === 0

    const activeFilterCount = [!!selectedDate, !!status, !!searchTerm, showServiceFilter && selectedServiceIds.length > 0].filter(Boolean).length

    const selectedServiceLabel = () => {
        if (selectedServiceIds.length === 0) {
            return "Semua layanan"
        }

        if (selectedServiceIds.length === 1) {
            return activeServiceOptions.find((item) => item.id === selectedServiceIds[0])?.name ?? "1 layanan"
        }

        return `${selectedServiceIds.length} layanan dipilih`
    }

    return (
        <>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        {title}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Total {totalCount} pasien
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsFilterOpen((current) => !current)}
                        aria-expanded={isFilterOpen}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 sm:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                        <Filter size={16} />
                        Filter
                        {activeFilterCount > 0 && (
                            <span className="rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                        <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                    </button>
                </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950 sm:flex sm:flex-wrap sm:items-end sm:gap-3">
                <div className={`flex-wrap items-end gap-3 sm:flex-1 ${isFilterOpen ? "flex" : "hidden"} sm:flex`}>
                    <div className="flex min-w-56 flex-1 flex-col gap-1">
                        <label htmlFor="visit-date-filter" className="text-sm font-medium text-slate-700 dark:text-slate-100">
                            Tanggal
                        </label>
                        <div className="relative">
                            <input
                                id="visit-date-filter"
                                type="date"
                                value={selectedDate ?? ""}
                                onChange={onDateChange}
                                onClick={(event) => event.currentTarget.showPicker?.()}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-9 text-sm text-slate-700 dark:border-slate-900 dark:bg-slate-950 dark:text-slate-100 focus:border-blue-500 focus:outline-none [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                            />
                            <Calendar size={16} aria-hidden="true"
                                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"/>
                        </div>
                    </div>
                    <div className="flex min-w-56 flex-1 flex-col gap-1">
                        <label htmlFor="queue-status" className="text-sm font-medium text-slate-700 dark:text-slate-100">
                            Status
                        </label>
                        <select
                            id="queue-status"
                            value={status}
                            onChange={onStatusChange}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Semua</option>
                            <option value="waiting">Belum Hadir</option>
                            <option value="present">Hadir</option>
                            <option value="in_assessment">Dalam Pemeriksaan</option>
                            <option value="finished">Selesai Dilayani</option>
                        </select>
                    </div>
                    <div className="flex min-w-56 flex-1 flex-col gap-1">
                        <label htmlFor="parent-search" className="text-sm font-medium text-slate-700 dark:text-slate-100">
                            Nama Pasien
                        </label>
                        <input
                            id="parent-search"
                            type="search"
                            value={searchTerm}
                            onChange={onSearchChange}
                            placeholder="Masukkan nama pasien"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    {showServiceFilter && (
                        <div className="flex min-w-56 flex-1 flex-col gap-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-100">
                                Layanan
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsServiceDropdownOpen((current) => !current)}
                                    className="inline-flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                                >
                                    <span className="truncate">{selectedServiceLabel()}</span>
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
                                                    onClick={onClearServices}
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    Bersihkan
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                                            {isServicesLoading && (
                                                <p className="py-2 text-sm text-slate-500">Memuat layanan...</p>
                                            )}

                                            {!isServicesLoading && activeServiceOptions.length === 0 && (
                                                <p className="py-2 text-sm text-slate-500">Data layanan tidak tersedia.</p>
                                            )}

                                            {!isServicesLoading && activeServiceOptions.map((service) => (
                                                <label
                                                    key={service.id}
                                                    className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedServiceIds.includes(service.id)}
                                                        onChange={() => onToggleService(service.id)}
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
                    )}
                </div>
                <div className="ml-auto flex items-end gap-2 pt-3 sm:pt-0">
                    {showScan && (
                        <button
                            type="button"
                            onClick={onScan}
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            <Scan size={16} className="mr-1.5" />
                            Scan QR
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onReset}
                        disabled={canReset}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Reset filter
                    </button>
                </div>
            </div>
        </>
    )
}