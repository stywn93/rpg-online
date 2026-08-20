export default function UsersFilterBar({
    totalCount,
    searchTerm,
    onSearchChange,
    status,
    onStatusChange,
    role,
    onRoleChange,
    onReset,
}) {
    const canReset = !searchTerm && !status && !role

    return (
        <>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                        Pengguna
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Data Pengguna yang telah terdaftar di sistem.
                    </p>
                </div>
                <div
                    className="rounded-full bg-blue-50 dark:bg-blue-950 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-50">
                    Total {totalCount} pengguna
                </div>
            </div>

            <div
                className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                    <label htmlFor="parent-search"
                           className="text-sm font-medium text-slate-700 dark:text-slate-100 mr-3">
                        Cari pengguna
                    </label>
                    <input
                        id="parent-search"
                        type="search"
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Cari nama pengguna"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none sm:w-56"
                    />
                    <label htmlFor="parent-status"
                           className="text-sm font-medium text-slate-700 dark:text-slate-100 mr-3 ml-3">
                        Status
                    </label>
                    <select
                        id="parent-status"
                        value={status}
                        onChange={onStatusChange}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none sm:w-56"
                    >
                        <option value="">Semua</option>
                        <option value="active">Aktif</option>
                        <option value="suspended">Suspend</option>
                    </select>
                    <label htmlFor="role-status"
                           className="text-sm font-medium text-slate-700 dark:text-slate-100 mr-3 ml-3">
                        Peran
                    </label>
                    <select
                        id="role-status"
                        value={role}
                        onChange={onRoleChange}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none sm:w-56"
                    >
                        <option value="">Semua</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <button
                    type="button"
                    onClick={onReset}
                    disabled={canReset}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                    Reset filter
                </button>
            </div>
        </>
    )
}