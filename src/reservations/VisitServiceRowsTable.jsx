import ActionButton from "../components/ActionButton.jsx"
import {formatIndonesianDate} from "../lib/utils/formatIndonesianDate.js"
import {isStaffRole} from "../lib/utils/roles.js"

const rowStyles = {
    present: "bg-blue-100 dark:bg-blue-900/50",
    no_show: "bg-red-100 dark:bg-red-900/50",
    waiting: "bg-white dark:bg-slate-900",
    finished: "bg-green-100 dark:bg-green-900/50",
}

export default function VisitServiceRowsTable({rows, isLoading, error, isUpdating, userRole, onPrimaryAction, primaryActionLabel = "Entri Hasil Layanan"}) {
    const isStaff = isStaffRole(userRole)
    const showActions = isStaff
    const colSpan = showActions ? 6 : 5

    return (
        <>
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
                        {showActions && (
                            <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Aksi</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row) => (
                        <tr key={row.visit_service_id || row.id} className={rowStyles[row.visit_status] ?? rowStyles.waiting}>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {row.queue_number}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-900 dark:border-slate-700 dark:text-slate-100">
                                <div className="font-medium">{row.patient_name}</div>
                                {row.parent_name && (
                                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                        Orang tua: {row.parent_name}
                                    </div>
                                )}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {row.gender}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {row.age}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {formatIndonesianDate(row.visit_date)}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700 dark:text-slate-300">
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                        {row.service_name}
                                    </span>
                                </div>
                            </td>
                            {showActions && (
                                <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
                                    <div className={`${row.visit_status === "finished" ? "hidden" : "flex"} flex-wrap gap-2`}>
                                        {row.visit_status !== "no_show" && (
                                            <ActionButton
                                                variant="accent"
                                                disabled={isUpdating}
                                                onClick={() => onPrimaryAction(row)}
                                            >
                                                {primaryActionLabel}
                                            </ActionButton>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    {isLoading && rows.length === 0 && (
                        <tr>
                            <td colSpan={colSpan} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                Memuat data...
                            </td>
                        </tr>
                    )}
                    {!isLoading && error && (
                        <tr>
                            <td colSpan={colSpan} className="px-4 py-6 text-center text-sm text-red-500">
                                Gagal memuat data.
                            </td>
                        </tr>
                    )}
                    {!isLoading && !error && rows.length === 0 && (
                        <tr>
                            <td colSpan={colSpan} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                Tidak ada data layanan pada tanggal yang dipilih.
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
                        <span className="h-3 w-3 rounded-full bg-blue-100 dark:bg-blue-900/50"/>
                        <span>Sedang Dalam Pemeriksaan</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900"/>
                        <span>Belum Hadir</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-green-100 dark:bg-green-900/50"/>
                        <span>Selesai Dilayani</span>
                    </div>
                </div>
            </div>
        </>
    )
}
