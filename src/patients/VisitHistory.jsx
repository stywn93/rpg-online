import {formatIndonesianDate} from "../lib/utils/formatIndonesianDate.js"

const statusLabels = {
    waiting: "Menunggu",
    present: "Hadir",
    no_show: "Tidak Hadir",
    finished: "Selesai",
    cancelled: "Dibatalkan",
}

const statusStyles = {
    waiting: "bg-blue-100 text-blue-700",
    present: "bg-amber-100 text-amber-700",
    no_show: "bg-red-100 text-red-700",
    finished: "bg-green-100 text-green-700",
    cancelled: "bg-slate-100 text-slate-700",
}

function StatusBadge({status}) {
    const label = statusLabels[status] ?? status ?? "-"
    const style = statusStyles[status] ?? "bg-slate-100 text-slate-700"

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
            {label}
        </span>
    )
}

function ServiceBadges({services}) {
    const serviceList = String(services ?? "")
        .split(",")
        .map((service) => service.trim())
        .filter(Boolean)

    if (serviceList.length === 0) {
        return <span className="text-slate-400">-</span>
    }

    return (
        <div className="flex flex-wrap gap-2">
            {serviceList.map((service, index) => (
                <span key={index} className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {service}
                </span>
            ))}
        </div>
    )
}

export default function VisitHistory({visits, isLoading, error}) {
    return (
        <section className="w-full">
            <div className="mx-auto w-full">
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Riwayat Kunjungan
                            </h1>
                        </div>
                        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                            Total {visits.length} kunjungan
                        </div>
                    </div>

                    <div className="mt-5 overflow-x-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead>
                            <tr className="text-slate-500">
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Tanggal Kunjungan</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Layanan</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {visits.map((visit) => (
                                <tr key={visit.id} className="bg-white dark:bg-slate-900">
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                        {formatIndonesianDate(visit.visit_date)}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700 dark:text-slate-300">
                                        <ServiceBadges services={visit.services}/>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
                                        <StatusBadge status={visit.visit_status}/>
                                    </td>
                                </tr>
                            ))}
                            {isLoading && visits.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Memuat data...
                                    </td>
                                </tr>
                            )}
                            {!isLoading && error && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-6 text-center text-sm text-red-500">
                                        Gagal memuat riwayat kunjungan.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && visits.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Belum ada kunjungan.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}