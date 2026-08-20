import {Fragment, useEffect, useEffectEvent, useState} from "react"
import {Link} from "react-router-dom"
import {listPatientsByParent, listUsers} from "../lib/api/Patient.js"
import {useLocalStorage} from "react-use"
import useAuth from "../auth/UseAuth.js"
import toast from "react-hot-toast"
import {userActivate} from "../lib/api/User.js"
import {
    Key
} from "lucide-react"


function ActionButton({children, variant = "primary", to, onClick, disabled}) {
    const variants = {
        primary: "bg-blue-600 dark:bg-blue-100 text-slate-50 dark:text-slate-900 hover:bg-blue-800 cursor-pointer",
        secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer",
        success: "bg-green-600 dark:bg-green-100 text-slate-50 dark:text-slate-900 hover:bg-green-800 cursor-pointer",
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
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition ${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
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

function getChildValue(child, keys, fallback = "-") {
    for (const key of keys) {
        const value = child?.[key]
        if (value !== null && value !== undefined && value !== "") {
            return value
        }
    }

    return fallback
}

function getGenderLabel(value) {
    if (value === "L") {
        return "Laki-laki"
    }

    if (value === "P") {
        return "Perempuan"
    }

    return value || "-"
}

function normalizeChildrenResponse(body) {
    if (Array.isArray(body?.data)) {
        return body.data
    }

    if (Array.isArray(body?.data?.data)) {
        return body.data.data
    }

    if (Array.isArray(body?.patients)) {
        return body.patients
    }

    if (Array.isArray(body)) {
        return body
    }

    return []
}

async function parseResponseBody(response) {
    const rawBody = await response.text()

    if (!rawBody) {
        return null
    }

    try {
        return JSON.parse(rawBody)
    } catch {
        return null
    }
}

export default function Users() {
    const [searchTerm, setSearchTerm] = useState("")
    const [status, setStatus] = useState("")
    const [role, setRole] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [expandedParentId, setExpandedParentId] = useState(null)
    const perPage = 10
    const [pagination, setPagination] = useState({
        total: 0,
        lastPage: 1,
        currentPage: 1,
    })
    const [token, _] = useLocalStorage("token", "")
    const [parents, setParents] = useState([])
    const [childrenByParentId, setChildrenByParentId] = useState({})
    const [loadingChildrenByParentId, setLoadingChildrenByParentId] = useState({})
    const [childrenErrorByParentId, setChildrenErrorByParentId] = useState({})
    const [fetchedChildrenByParentId, setFetchedChildrenByParentId] = useState({})
    const [activatingUserIdMap, setActivatingUserIdMap] = useState({})
    const {logout} = useAuth()

    const fetchParents = useEffectEvent(async function getParents(page, term, nextStatus, nextRole) {
        try {
            const response = await listUsers(token, page, perPage, term, nextStatus, nextRole)
            const responseBody = await response.json()
            if (response.status === 401) {
                // console.error("Unauthorized")
                logout()
            }
            // console.log(responseBody)
            // console.log(response.status)
            setParents(responseBody.data ?? [])
            setPagination({
                total: responseBody.meta.total,
                lastPage: responseBody.meta.last_page,
                currentPage: responseBody.meta.current_page
            })

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
    function handleRoleChange(e){
        const newRole = e.target.value
        setRole(newRole)
        setCurrentPage(1)
    }

    function handleResetFilter() {
        setSearchTerm("")
        setStatus("")
        setRole("")
        setCurrentPage(1)
    }

    const fetchChildrenByParent = useEffectEvent(async function getChildren(parentId) {
        if (!token || !parentId) {
            return
        }

        if (loadingChildrenByParentId[parentId] || childrenByParentId[parentId]) {
            return
        }

        setLoadingChildrenByParentId((current) => ({
            ...current,
            [parentId]: true,
        }))
        setChildrenErrorByParentId((current) => ({
            ...current,
            [parentId]: "",
        }))

        try {
            const response = await listPatientsByParent(token, parentId)
            const responseBody = await response.json()

            if (response.status === 401) {
                logout()
                return
            }

            if (!response.ok) {
                throw new Error(
                    responseBody?.message
                    ?? responseBody?.messages?.error
                    ?? "Gagal memuat data anak."
                )
            }

            setChildrenByParentId((current) => ({
                ...current,
                [parentId]: normalizeChildrenResponse(responseBody),
            }))
        } catch (error) {
            console.error(error)
            setChildrenErrorByParentId((current) => ({
                ...current,
                [parentId]: error.message ?? "Gagal memuat data anak.",
            }))
        } finally {
            setFetchedChildrenByParentId((current) => ({
                ...current,
                [parentId]: true,
            }))
            setLoadingChildrenByParentId((current) => ({
                ...current,
                [parentId]: false,
            }))
        }
    })

    function toggleExpandedParent(parentId) {
        setExpandedParentId((currentId) => currentId === parentId ? null : parentId)
    }

    const handleActivateUser = async (userId) => {
        if (!token || !userId || activatingUserIdMap[userId]) {
            return
        }

        try {
            setActivatingUserIdMap((prev) => ({ ...prev, [userId]: true }))
            const response = await userActivate(token, userId)
            const responseBody = await parseResponseBody(response)

            if (response.status === 401) {
                logout()
                return
            }

            if (!response.ok) {
                throw new Error(
                    responseBody?.message ?? responseBody?.messages?.error ?? "Gagal mengaktifkan pengguna."
                )
            }

            toast.success("Pengguna berhasil diaktifkan.")
            setParents((currentParents) =>
                currentParents.map((u) => (u.id === userId ? { ...u, status: "active" } : u))
            )
        } catch (error) {
            console.error(error)
            toast.error(error.message ?? "Terjadi kesalahan saat mengaktifkan pengguna.")
        } finally {
            setActivatingUserIdMap((prev) => ({ ...prev, [userId]: false }))
        }
    }


    useEffect(() => {
        fetchParents(currentPage, searchTerm, status, role)
    }, [token, currentPage, perPage, searchTerm, status, role])

    useEffect(() => {
        if (!expandedParentId) {
            return
        }

        if (fetchedChildrenByParentId[expandedParentId] || loadingChildrenByParentId[expandedParentId]) {
            return
        }

        fetchChildrenByParent(expandedParentId)
    }, [expandedParentId, fetchedChildrenByParentId, loadingChildrenByParentId])

    return (
        <section className="space-y-5">
            <div
                className="rounded-lg border border-slate-200 bg-white dark:bg-slate-950 dark:text-slate-50 p-5 shadow-sm">
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
                        Total {pagination.total} pengguna
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
                            onChange={handleSearchChange}
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
                            onChange={handleStatusChange}
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
                            onChange={handleRoleChange}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:outline-none sm:w-56"
                        >
                            <option value="">Semua</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={handleResetFilter}
                        disabled={!searchTerm && !status && !role}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                        Reset filter
                    </button>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead>
                        <tr className="text-slate-500 dark:text-slate-100">
                            <th className="border-b border-slate-200 px-4 py-3 font-medium"></th>
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
                        {parents.map((user, index) => {
                            const isExpanded = expandedParentId === user.id
                            const children = childrenByParentId[user.id] ?? []
                            const isLoadingChildren = Boolean(loadingChildrenByParentId[user.id])
                            const childrenError = childrenErrorByParentId[user.id]

                            return (
                                <Fragment key={user.id}>
                                    <tr className="bg-slate-50 dark:bg-slate-950">
                                        <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 align-top">
                                            <button
                                                type="button"
                                                onClick={() => toggleExpandedParent(user.id)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                                                aria-label={isExpanded ? "Collapse row" : "Expand row"}
                                            >
                                                {isExpanded ? "−" : "+"}
                                            </button>
                                        </td>
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
                                            {user.alamat}
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
                                                        onClick={() => handleActivateUser(user.id)}
                                                        disabled={Boolean(activatingUserIdMap[user.id])}
                                                    >
                                                        {activatingUserIdMap[user.id] ? "Mengaktifkan..." : "Aktifkan"}
                                                    </ActionButton>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {isExpanded && isLoadingChildren && (
                                        <tr className="bg-slate-100/60 dark:bg-slate-900/40">
                                            <td className="px-4 py-3" />
                                            <td colSpan={7} className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-sm text-slate-500 dark:text-slate-300">
                                                Memuat data anak...
                                            </td>
                                        </tr>
                                    )}
                                    {isExpanded && !isLoadingChildren && childrenError && (
                                        <tr className="bg-slate-100/60 dark:bg-slate-900/40">
                                            <td className="px-4 py-3" />
                                            <td colSpan={7} className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                                                {childrenError}
                                            </td>
                                        </tr>
                                    )}
                                    {isExpanded && !isLoadingChildren && !childrenError && children.length === 0 && (
                                        <tr className="bg-slate-100/60 dark:bg-slate-900/40">
                                            <td className="px-4 py-3" />
                                            <td colSpan={7} className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-sm text-slate-500 dark:text-slate-300">
                                                Belum ada data anak untuk orang tua ini.
                                            </td>
                                        </tr>
                                    )}
                                    {isExpanded && !isLoadingChildren && !childrenError && children.map((child, childIndex) => (
                                        <tr key={child.id ?? child.patient_id ?? `${user.id}-child-${childIndex}`} className="bg-slate-100/60 dark:bg-slate-900/40">
                                            <td className="px-4 py-3" />
                                            <td className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-300">
                                                {getChildValue(child, ["id", "patient_id"])}
                                            </td>
                                            <td className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-400 dark:text-slate-500">↳</span>
                                                    <span className="font-medium">{getChildValue(child, ["nama_lengkap", "nama", "name"])}</span>
                                                </div>
                                            </td>
                                            <td className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-300">
                                                -
                                            </td>
                                            <td className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-300">
                                                {getChildValue(child, ["usia", "age"])}
                                            </td>
                                            <td className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-300">
                                                {getChildValue(child, ["alamat", "address"])}
                                            </td>
                                            <td className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-300">
                                                {getGenderLabel(getChildValue(child, ["jenis_kelamin", "gender"]))}
                                            </td>
                                            <td className="border-b border-slate-100 dark:border-slate-700 px-4 py-3" />
                                        </tr>
                                    ))}
                                </Fragment>
                            )
                        })}
                        {parents.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500">
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
