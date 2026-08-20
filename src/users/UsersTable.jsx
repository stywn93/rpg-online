import {Key} from "lucide-react"
import ActionButton from "../components/ActionButton.jsx"

function StatusBadge({value}) {
    const isLowStatus = String(value ?? "").toLowerCase() === "suspended"

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                isLowStatus ? "bg-red-100 text-red-700" : "bg-green-500 text-slate-50"
            }`}
        >
            {value ?? "-"}
        </span>
    )
}

function RoleBadge({value}) {
    const isLowStatus = String(value ?? "").toLowerCase() === "admin"

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                isLowStatus ? "bg-blue-500 text-slate-50" : "bg-slate-700 text-slate-50"
            }`}
        >
            {isLowStatus && <Key size={14} />}
            {value ?? "-"}
        </span>
    )
}

export default function UsersTable({
    users,
    isLoading,
    error,
    currentPage,
    perPage,
    activatingUserIdMap,
    onActivate,
}) {
    return (
        <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead>
                <tr className="text-slate-500 dark:text-slate-100">
                    <th className="border-b border-slate-200 px-4 py-3 font-medium">ID</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium">Nama</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium">Email</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium">Telepon</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium">Alamat</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium">Peran</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium">Status</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={user.id} className="bg-slate-50 dark:bg-slate-950">
                        <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4">
                            <span
                                className="rounded-full bg-slate-100 dark:bg-slate-950 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-slate-700 dark:text-slate-100">
                                {(currentPage - 1) * perPage + index + 1}
                            </span>
                        </td>
                        <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                            {user.name}
                        </td>
                        <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">
                            {user.email}
                        </td>
                        <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">
                            {user.phone}
                        </td>
                        <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">
                            {user.alamat ?? user.address}
                        </td>
                        <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">
                            <RoleBadge value={user.role}/>
                        </td>
                        <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">
                            <StatusBadge value={user.status}/>
                        </td>
                        <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                                <ActionButton to={`/users/${user.id}`}>Detail</ActionButton>
                                {user.status?.toLowerCase() !== "active" && (
                                    <ActionButton
                                        variant="success"
                                        onClick={() => onActivate(user.id)}
                                        disabled={Boolean(activatingUserIdMap[user.id])}
                                    >
                                        {activatingUserIdMap[user.id] ? "Mengaktifkan..." : "Aktifkan"}
                                    </ActionButton>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                {isLoading && users.length === 0 && (
                    <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500">
                            Memuat data...
                        </td>
                    </tr>
                )}
                {!isLoading && error && (
                    <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-sm text-red-600 dark:text-red-300">
                            Gagal memuat data pengguna.
                        </td>
                    </tr>
                )}
                {!isLoading && !error && users.length === 0 && (
                    <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500">
                            Pengguna tidak ditemukan.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}