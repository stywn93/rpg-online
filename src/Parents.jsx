import {useEffect, useEffectEvent, useState} from "react"
import {Link} from "react-router-dom"
import {listParents} from "./lib/api/Patient.js"
import {useLocalStorage} from "react-use"
import useAuth from "./UseAuth.js"

function ActionButton({children, variant = "primary", to}) {
    const variants = {
        primary: "bg-blue-600 dark:bg-blue-100 text-slate-50 dark:text-slate-900 hover:bg-blue-800 cursor-pointer",
        secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer",
    }

    if (to) {
        return (
            <Link
                to={to}
                className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition ${variants[variant]}`}
            >
                {children}
            </Link>
        )
    }

    return (
        <button
            type="button"
            className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition ${variants[variant]}`}
        >
            {children}
        </button>
    )
}

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

function StatusBadge({value}) {
    const isLowStatus = value.toLowerCase() === "suspended"

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                isLowStatus ? "bg-red-100 text-red-700" : "bg-green-500 text-slate-50"
            }`}
        >
            {value}
        </span>
    )
}

export default function Parents() {
    const [searchTerm, setSearchTerm] = useState("")
    const [status, setStatus] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 10
    const [pagination, setPagination] = useState({
        total: 0,
        lastPage: 1,
        currentPage: 1,
    })
    const [token, _] = useLocalStorage("token", "")
    const [parents, setParents] = useState([])
    const {logout} = useAuth()

    const fetchParents = useEffectEvent(async function getParents(page, term, nextStatus) {
        try {
            const response = await listParents(token, page, perPage, term, nextStatus)
            const responseBody = await response.json()
            console.log(responseBody)
            setParents(responseBody.data ?? [])
            setPagination({
                total: responseBody.meta.total,
                lastPage: responseBody.meta.last_page,
                currentPage: responseBody.meta.current_page
            })
            if (response.status === 401) {
                logout()
            }
        } catch (e) {
            console.error(e)
        }
    })

    function handleSearchChange(event) {
        const nextSearchTerm = event.target.value
        setSearchTerm(nextSearchTerm)
        setCurrentPage(1)
    }
    function handleStatusChange(e){
        const newStatus = e.target.value
        setStatus(newStatus)
        setCurrentPage(1)
    }

    function handleResetFilter() {
        setSearchTerm("")
        setStatus("")
        setCurrentPage(1)
    }

    useEffect(() => {
        fetchParents(currentPage, searchTerm, status)
    }, [token, currentPage, perPage, searchTerm, status])

    return (
        <section className="space-y-5">
            <div
                className="rounded-lg border border-slate-200 bg-white dark:bg-slate-950 dark:text-slate-50 p-5 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                            Orang Tua
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-200">
                            Data Orang Tua yang telah terdaftar di sistem.
                        </p>
                    </div>
                    <div
                        className="rounded-full bg-blue-50 dark:bg-blue-950 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-50">
                        Total {pagination.total} orang tua
                    </div>
                </div>

                <div
                    className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <label htmlFor="parent-search"
                               className="text-sm font-medium text-slate-700 dark:text-slate-100 mr-3">
                            Cari orang tua
                        </label>
                        <input
                            id="parent-search"
                            type="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Cari nama orang tua"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none sm:w-56"
                        />
                        <label htmlFor="parent-status"
                               className="text-sm font-medium text-slate-700 dark:text-slate-100 mr-3 ml-3">
                            Status
                        </label>
                        <select
                            id="parent-status"
                            value={status}
                            onChange={handleStatusChange}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none sm:w-56"
                        >
                            <option value="">Semua</option>
                            <option value="active">Aktif</option>
                            <option value="suspended">Suspend</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={handleResetFilter}
                        disabled={!searchTerm && !status}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                        Reset filter
                    </button>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead>
                        <tr className="text-slate-500 dark:text-slate-100">
                        <th className="border-b border-slate-200 px-4 py-3 font-medium">ID</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium">Nama Orang Tua</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium">Email</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium">Telepon</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium">Alamat</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium">Status</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {parents.map((parent, index) => (
                            <tr key={parent.id} className="bg-slate-50 dark:bg-slate-950">
                                <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4">
                                        <span
                                            className="rounded-full bg-slate-100 dark:bg-slate-950 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-slate-700 dark:text-slate-100">
                                            {(currentPage - 1) * perPage + index + 1}
                                        </span>
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                                    {parent.name}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">
                                    {parent.email}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">
                                    {parent.phone}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">
                                    {parent.alamat}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">
                                    <StatusBadge value={parent.status}/>
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        <ActionButton to={`/parents/${parent.id}`}>Detail</ActionButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {parents.length === 0 && (
                            <tr>
                                <td colSpan={9} className="px-4 py-6 text-center text-sm text-slate-500">
                                    Orang tua tidak ditemukan.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {parents.length > 0 && (
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-200">
                            Menampilkan {(currentPage - 1) * perPage + 1}-
                            {Math.min(currentPage * perPage, pagination.total)} dari {pagination.total} data
                        </p>
                        <div className="flex items-center gap-3">
                            <PaginationButton
                                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                disabled={currentPage === 1}
                            >
                                &lt;
                            </PaginationButton>
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-100">
                                {pagination.currentPage} / {pagination.lastPage}
                            </span>

                            <PaginationButton
                                onClick={() => setCurrentPage((page) => Math.min(pagination.lastPage, page + 1))}
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
