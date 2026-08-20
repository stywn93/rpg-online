import {useLocalStorage} from "react-use"
import useAuth from "../auth/UseAuth.js"
import useUserList from "../lib/hooks/useUserList.js"
import UsersFilterBar from "./UsersFilterBar.jsx"
import UsersTable from "./UsersTable.jsx"

function PaginationButton({children, disabled = false, onClick}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex min-w-8 items-center justify-center rounded-xl py-1 text-sm font-semibold transition ${
                disabled
                    ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
                    : "border border-blue-200 bg-blue-50 text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100 dark:hover:border-blue-800 dark:hover:bg-blue-900"
            }`}
        >
            {children}
        </button>
    )
}

export default function Users() {
    const [token] = useLocalStorage("token", "")
    const {logout} = useAuth()

    const {
        users,
        pagination,
        currentPage,
        perPage,
        isLoading,
        error,
        searchTerm,
        status,
        role,
        handleSearchChange,
        handleStatusChange,
        handleRoleChange,
        resetFilters,
        goToPage,
        activatingUserIdMap,
        activateUser,
    } = useUserList({token, logout})

    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white dark:bg-slate-950 dark:text-slate-50 p-5 shadow-sm">
                <UsersFilterBar
                    totalCount={pagination.total}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    status={status}
                    onStatusChange={handleStatusChange}
                    role={role}
                    onRoleChange={handleRoleChange}
                    onReset={resetFilters}
                />
                <UsersTable
                    users={users}
                    isLoading={isLoading}
                    error={error}
                    currentPage={currentPage}
                    perPage={perPage}
                    activatingUserIdMap={activatingUserIdMap}
                    onActivate={activateUser}
                />

                {users.length > 0 && (
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-200">
                            Menampilkan {(currentPage - 1) * perPage + 1}-
                            {Math.min(currentPage * perPage, pagination.total)} dari {pagination.total} data
                        </p>
                        <div className="flex items-center gap-3">
                            <PaginationButton
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &lt;
                            </PaginationButton>
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-100">
                                {pagination.currentPage} / {pagination.lastPage}
                            </span>

                            <PaginationButton
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === pagination.lastPage}
                            >
                                &gt;
                            </PaginationButton>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}