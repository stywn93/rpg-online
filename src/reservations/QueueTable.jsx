import ActionButton from "../components/ActionButton.jsx"
import {formatIndonesianDate} from "../lib/utils/formatIndonesianDate.js"

const rowStyles = {
    called: "bg-blue-100 dark:bg-blue-900/50",
    no_show: "bg-red-100 dark:bg-red-900/50",
    waiting: "bg-white dark:bg-slate-900",
    finished: "bg-green-100 dark:bg-green-900/50",
}

export default function QueueTable({queues, isLoading, error, isUpdating, onPrimaryAction, onAbsent}) {
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
                        <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {queues.map((queue) => (
                        <tr key={queue.visit_id} className={rowStyles[queue.status] ?? rowStyles.waiting}>
                            <td className="border-b border-slate-100 px-4 py-4 font-bold text-slate-900 dark:border-slate-700 dark:text-slate-100">
                                {queue.visit_id}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {queue.patient_name}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {queue.gender}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {queue.age}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                {formatIndonesianDate(queue.visit_date)}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700 dark:text-slate-300">
                                <div className="flex flex-wrap gap-2">
                                    {queue.services}
                                </div>
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
                                <div className={`${queue.status === "finished" ? "hidden" : "flex"} flex-wrap gap-2`}>
                                    {queue.status !== "no_show" && (
                                        <ActionButton
                                            variant={queue.status === "checked_in" || queue.status === "called" ? "accent" : "primary"}
                                            disabled={isUpdating}
                                            onClick={() => onPrimaryAction(queue)}
                                        >
                                            {queue.status === "checked_in" || queue.status === "called" ? "Melayani" : "Check-in"}
                                        </ActionButton>
                                    )}

                                    {queue.status !== "checked_in" && queue.status !== "no_show" && queue.status !== "called" && (
                                        <ActionButton
                                            variant="secondary"
                                            disabled={isUpdating}
                                            onClick={() => onAbsent(queue.queue_id)}
                                        >
                                            Tidak Hadir
                                        </ActionButton>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {isLoading && queues.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                Memuat data...
                            </td>
                        </tr>
                    )}
                    {!isLoading && error && (
                        <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-sm text-red-500">
                                {`isLoading: ${isLoading}, error: ${JSON.stringify(error)}`} Gagal memuat data.
                            </td>
                        </tr>
                    )}
                    {!isLoading && !error && queues.length === 0 && (
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
        </>
    )
}