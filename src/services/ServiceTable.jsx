import ActionButton from "../components/ActionButton.jsx"

export default function ServiceTable({services, isLoading, isDeleting, error, onDelete}) {
    return (
        <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead>
                <tr className="text-slate-500 dark:text-slate-100">
                    <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">ID</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Nama Layanan</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {services.map((service) => (
                    <tr key={service.id} className="bg-slate-50 dark:bg-slate-950">
                        <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                            {service.id}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-900 dark:border-slate-700 dark:text-slate-100">
                            {service.name}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
                            <div className="flex flex-wrap gap-2">
                                <ActionButton to={`/services/${service.id}/edit`}>Edit</ActionButton>
                                <ActionButton
                                    variant="danger"
                                    disabled={isDeleting}
                                    onClick={() => onDelete(service)}
                                >
                                    Hapus
                                </ActionButton>
                            </div>
                        </td>
                    </tr>
                ))}
                {isLoading && services.length === 0 && (
                    <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Memuat data...
                        </td>
                    </tr>
                )}
                {!isLoading && error && (
                    <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-sm text-red-500">
                            Gagal memuat data layanan.
                        </td>
                    </tr>
                )}
                {!isLoading && !error && services.length === 0 && (
                    <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Tidak ada data layanan.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}