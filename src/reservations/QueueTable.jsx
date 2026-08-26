import ActionButton from "../components/ActionButton.jsx"
import {formatIndonesianDate} from "../lib/utils/formatIndonesianDate.js"
import {isStaffRole} from "../lib/utils/roles.js"

// di sini belum ada key untuk "present", maka kita tambahkan key "present" dengan warna kuning
const rowStyles = {
    present: "bg-blue-100 dark:bg-blue-900/50",
    no_show: "bg-red-100 dark:bg-red-900/50",
    waiting: "bg-white dark:bg-slate-900",
    finished: "bg-green-100 dark:bg-green-900/50",
}

export default function QueueTable({queues, isLoading, error, isUpdating, userRole, showServices = false, onPrimaryAction, primaryActionLabel = ""}) {
    const isStaff = isStaffRole(userRole)
    const showActions = isStaff
    const colSpan = (showServices ? 7 : 6) - (showActions ? 0 : 1)

    const primaryLabel = (queue) => {
        if (queue.visit_status === "waiting") {
            return primaryActionLabel || "Hadir"
        }

        return primaryActionLabel || (isStaff ? "Isi Layanan" : "Pemeriksaan")
    }

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
                        {showServices && (
                            <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Layanan</th>
                        )}
                        {showActions && (
                            <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Aksi</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {queues.map((queue) => (
                        <tr key={queue.id ?? queue.visit_id} className={rowStyles[queue.visit_status] ?? rowStyles.waiting}>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-900 dark:border-slate-700 dark:text-slate-100">
                                {queue.queue_number}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {queue.patient_name}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {queue.patient_gender ?? queue.gender}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {queue.age}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {formatIndonesianDate(queue.visit_date)}
                            </td>
                            {showServices && (
                                <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700 dark:text-slate-300">
                                    <div className="flex flex-wrap gap-2">
                                        {queue.services}
                                    </div>
                                </td>
                            )}
                            {showActions && (
                                <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
                                    <div className={`${queue.visit_status === "finished" ? "hidden" : "flex"} flex-wrap gap-2`}>
                                        {queue.status !== "no_show" && (
                                            <ActionButton
                                                variant={queue.visit_status === "waiting" ? "primary" : "accent"}
                                                disabled={isUpdating}
                                                onClick={() => onPrimaryAction(queue)}
                                            >
                                                {primaryLabel(queue)}
                                            </ActionButton>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    {isLoading && queues.length === 0 && (
                        <tr>
                            <td colSpan={colSpan} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                Memuat data...
                            </td>
                        </tr>
                    )}
                    {!isLoading && error && (
                        <tr>
                            <td colSpan={colSpan} className="px-4 py-6 text-center text-sm text-red-500">
                                {`isLoading: ${isLoading}, error: ${JSON.stringify(error)}`} Gagal memuat data.
                            </td>
                        </tr>
                    )}
                    {!isLoading && !error && queues.length === 0 && (
                        <tr>
                            <td colSpan={colSpan} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
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
