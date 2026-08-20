import {useEffect, useEffectEvent, useState} from "react";
import {useParams} from "react-router-dom";
import {useLocalStorage} from "react-use";
import toast from "react-hot-toast";
import {getUserDetail, updateUserDetail} from "../lib/api/User.js";
import {userActivate, changeUserPassword} from "../lib/api/User.js";
import {listPatientsByParent} from "../lib/api/Patient.js";
import {normalizeChildren} from "../lib/utils/Normalization.js";
import useAuth from "../auth/UseAuth.js";


const USER_FORM_FIELDS = [
    {label: "Nama", name: "name"},
    {label: "Email", name: "email", type: "email"},
    {label: "Telepon", name: "phone"},
    {label: "Status", name: "status", readOnly: true},
    {label: "Alamat", name: "address"},
]

const UPDATABLE_USER_FIELDS = ["name", "email", "phone", "address"]

function createFormData(user) {
    return {
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        address: user?.address ?? user?.alamat ?? "",
        status: user?.status ?? "",
    }
}

function InfoRow({label, value}) {
    return (
        <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-400">{label}</p>
            <p className="text-sm leading-6 text-slate-700">{value}</p>
        </div>
    )
}

function EditableInfoRow({label, name, value, isEditing, onChange, type = "text", readOnly = false}) {
    return (
        <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6 sm:items-center">
            <label className="text-xs font-semibold tracking-[0.22em] text-slate-400" htmlFor={name}>
                {label}
            </label>
            {isEditing && !readOnly ? (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                />
            ) : (
                <p className="text-sm leading-6 text-slate-700">{value || "-"}</p>
            )}
        </div>
    )
}

function DetailCard({title, description, children}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{title}</h2>
                {description ? (
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                ) : null}
            </div>
            <div className="space-y-5 px-5 py-5 sm:px-6">
                {children}
            </div>
        </div>
    )
}

function resolveChildren(user) {
    if (Array.isArray(user?.children)) {
        return user.children
    }

    if (Array.isArray(user?.patients)) {
        return user.patients
    }

    if (Array.isArray(user?.patient)) {
        return user.patient
    }

    if (user?.patient && typeof user.patient === "object") {
        return [user.patient]
    }

    return []
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

function buildUpdatePayload(formData, user) {
    return UPDATABLE_USER_FIELDS.reduce((payload, field) => {
        if ((formData[field] ?? "") !== (user?.[field] ?? "")) {
            payload[field] = formData[field]
        }

        return payload
    }, {})
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

export default function UserDetails() {
    const {userID} = useParams()
    const [token, _] = useLocalStorage("token", "")
    const {logout, user: currentUser} = useAuth()
    const [user, setUser] = useState(null)
    const [formData, setFormData] = useState(createFormData())
    const [isEditing, setIsEditing] = useState(false)
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" })
    const [isEditingRole, setIsEditingRole] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isActivating, setIsActivating] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [isChangingRole, setIsChangingRole] = useState(false)
    const [role, setRole] = useState("")
    const [children, setChildren] = useState([])
    const [isLoadingChildren, setIsLoadingChildren] = useState(false)
    const [childrenError, setChildrenError] = useState(null)
    const embeddedChildren = resolveChildren(user)
    const displayChildren = children.length > 0 ? children : embeddedChildren
    const canActivate = Boolean(user) && user?.status?.toLowerCase() !== "active"

    useEffect(() => {
        if(user) {
            setRole(user.role ?? "user")
        }
    }, [user])

    const fetchUserDetail = useEffectEvent(async function getDetailUser() {
        try {
            const userResponse = await getUserDetail(token, userID)
            const userBody = await userResponse.json()

            if(userResponse.ok) {
                setUser(userBody.data ?? null)
            }

        } catch (e) {
            console.error(e)
        }
    })

    function syncForm(nextUser) {
        setFormData(createFormData(nextUser))
    }

    function handleChange(event) {
        const {name, value} = event.target
        setFormData((current) => ({
            ...current,
            [name]: value,
        }))
    }

    function handleEdit() {
        if (!user) {
            return
        }

        syncForm(user)
        setIsEditing(true)
    }

    function handleCancelEdit() {
        syncForm(user)
        setIsEditing(false)
    }

    const handleSave = async function saveUserDetail() {
        if (!token || !userID || isSaving || isActivating) {
            return
        }

        try {
            setIsSaving(true)
            const payload = buildUpdatePayload(formData, user)

            if (Object.keys(payload).length === 0) {
                setIsEditing(false)
                toast("Tidak ada perubahan data.")
                return
            }

            const response = await updateUserDetail(token, userID, payload)
            const body = await parseResponseBody(response)

            if (!response.ok) {
                throw new Error(body?.message ?? body?.messages?.error ?? "Gagal memperbarui data pengguna.")
            }

            const updatedUser = body?.data ?? {
                ...user,
                ...payload,
            }

            setUser(updatedUser)
            syncForm(updatedUser)
            setIsEditing(false)
            toast.success("Data pengguna berhasil diperbarui.")
        } catch (error) {
            console.error(error)
            toast.error(error.message ?? "Terjadi kesalahan saat menyimpan data.")
        } finally {
            setIsSaving(false)
        }
    }

    function handlePasswordChange(event) {
        const {name, value} = event.target
        setPasswordData((current) => ({
            ...current,
            [name]: value,
        }))
    }

    function handleEditPassword() {
        setPasswordData({ newPassword: "", confirmPassword: "" })
        setIsEditingPassword(true)
    }

    function handleCancelEditPassword() {
        setPasswordData({ newPassword: "", confirmPassword: "" })
        setIsEditingPassword(false)
    }

    const handleSavePassword = async function savePassword() {
        if (!token || !userID || !user || isChangingPassword) {
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Password tidak cocok.")
            return
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password minimal 6 karakter.")
            return
        }

        try {
            setIsChangingPassword(true)
            const response = await changeUserPassword(token, userID, passwordData.newPassword)
            const body = await parseResponseBody(response)

            if (!response.ok) {
                throw new Error(body?.message ?? body?.messages?.error ?? "Gagal mengubah password.")
            }

            toast.success("Password berhasil diubah.")
            handleCancelEditPassword()
        } catch (error) {
            console.error(error)
            toast.error(error.message ?? "Terjadi kesalahan saat mengubah password.")
        } finally {
            setIsChangingPassword(false)
        }
    }

    const handleSaveRole = async function saveRole() {
        if (!token || !userID || !user || isChangingRole) {
            return
        }

        try {
            setIsChangingRole(true)
            const response = await updateUserDetail(token, userID, { role })
            const body = await parseResponseBody(response)

            if (!response.ok) {
                throw new Error(body?.message ?? body?.messages?.error ?? "Gagal mengubah peran.")
            }

            setUser({ ...user, role })
            setIsEditingRole(false)
            toast.success("Peran berhasil diubah.")
        } catch (error) {
            console.error(error)
            toast.error(error.message ?? "Terjadi kesalahan saat mengubah peran.")
        } finally {
            setIsChangingRole(false)
        }
    }

    function handleEditRole() {
        if (!user) return
        setRole(user.role ?? "user")
        setIsEditingRole(true)
    }

    function handleCancelEditRole() {
        setRole(user.role ?? "user")
        setIsEditingRole(false)
    }

    function handlePrimaryAction() {
        if (isEditing) {
            handleSave()
            return
        }

        handleEdit()
    }

    useEffect(() => {
        if (!token || !userID) {
            return
        }

        fetchUserDetail()
    }, [token, userID])

    useEffect(() => {
        if (!user) {
            return
        }

        syncForm(user)
    }, [user])

    useEffect(() => {
        if (!token || !userID) {
            return
        }

        const controller = new AbortController()

        async function fetchChildren() {
            setIsLoadingChildren(true)
            setChildrenError(null)

            try {
                const response = await listPatientsByParent(token, userID)
                const body = await response.json().catch(() => null)

                if (response.status === 401) {
                    logout()
                    return
                }

                if (!response.ok) {
                    setChildrenError(
                        body?.message
                        ?? body?.messages?.error
                        ?? "Gagal memuat data anak."
                    )
                    return
                }

                setChildren(normalizeChildren(body))
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") {
                    setChildrenError(fetchError.message ?? "Gagal memuat data anak.")
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingChildren(false)
                }
            }
        }

        fetchChildren()

        return () => controller.abort()
    }, [token, userID, logout])

    return (
        <section className="w-full space-y-5">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Detail Pengguna</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Informasi orang tua dan data anak terkait dalam satu tampilan.
                </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
                <DetailCard
                    title="Data Pribadi"
                    description="Informasi dasar pengguna yang terdaftar di sistem."
                >
                    <div
                            className="space-y-5"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && isEditing) {
                                    e.preventDefault()
                                    handleSave()
                                }
                            }}
                        >
                        {USER_FORM_FIELDS.map((field) => (
                            <EditableInfoRow
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={formData[field.name]}
                                isEditing={field.readOnly ? false : isEditing}
                                onChange={handleChange}
                                readOnly={field.readOnly}
                            />
                        ))}
                        
                        <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6 sm:items-center">
                            <label className="text-xs font-semibold tracking-[0.22em] text-slate-400" htmlFor="role">Peran</label>
                            {isEditingRole ? (
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            ) : (
                                <p className="text-sm leading-6 text-slate-700">{user?.role ?? "-"}</p>
                            )}
                        </div>

                        {isEditingPassword ? (
                            <>
                                <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6 sm:items-center">
                                    <label className="text-xs font-semibold tracking-[0.22em] text-slate-400" htmlFor="newPassword">Password Baru</label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                                    />
                                </div>
                                <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6 sm:items-center">
                                    <label className="text-xs font-semibold tracking-[0.22em] text-slate-400" htmlFor="confirmPassword">Konfirmasi</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                                    />
                                </div>
                            </>
                        ) : null}

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            {!isEditingRole && !isEditingPassword && (
                                <button
                                    type="button"
                                    onClick={handlePrimaryAction}
                                    disabled={!user || isSaving || isChangingPassword || isChangingRole}
                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSaving ? "Menyimpan..." : isEditing ? "Simpan" : "Edit"}
                                </button>
                            )}
                            {currentUser?.role === "admin" && !isEditing && !isEditingPassword && (
                                <button
                                    type="button"
                                    onClick={isEditingRole ? handleSaveRole : handleEditRole}
                                    disabled={!user || isSaving || isChangingPassword || isChangingRole}
                                    className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isChangingRole ? "Menyimpan..." : isEditingRole ? "Simpan Peran" : "Ganti Peran"}
                                </button>
                            )}
                            {(isEditingRole || isEditing || isEditingPassword) && (
                                <button
                                    type="button"
                                    onClick={isEditingPassword ? handleCancelEditPassword : isEditingRole ? handleCancelEditRole : handleCancelEdit}
                                    disabled={isChangingRole || isSaving || isChangingPassword}
                                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Batal
                                </button>
                            )}
                            {isEditingPassword && (
                                <button
                                    type="button"
                                    onClick={handleSavePassword}
                                    disabled={isChangingPassword}
                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isChangingPassword ? "Menyimpan..." : "Simpan Password"}
                                </button>
                            )}
                            {!isEditing && !isEditingRole && !isEditingPassword ? (
                                <button
                                    type="button"
                                    onClick={handleEditPassword}
                                    disabled={!user || isActivating || isSaving || isChangingPassword || isChangingRole}
                                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Ubah Password
                                </button>
                            ) : null}
                        </div>
                    </div>
                </DetailCard>

                <DetailCard
                    title="Data Anak"
                    description="Data anak yang terhubung dengan akun pengguna ini."
                >
                    {isLoadingChildren && displayChildren.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                            Memuat data anak...
                        </div>
                    )}
                    {!isLoadingChildren && childrenError && (
                        <div className="rounded-xl border border-dashed border-red-300 bg-red-50 px-4 py-6 text-sm text-red-600">
                            {childrenError}
                        </div>
                    )}
                    {!isLoadingChildren && !childrenError && displayChildren.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                            Data anak belum tersedia untuk pengguna ini.
                        </div>
                    )}
                    {!isLoadingChildren && !childrenError && displayChildren.length > 0 && (
                        displayChildren.map((child, index) => (
                            <div
                                key={child?.id ?? child?.patient_id ?? `child-${index}`}
                                className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-sm font-semibold tracking-[0.16em] text-slate-500">
                                        Anak {index + 1}
                                    </h3>
                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                                        {getChildValue(child, ["id", "patient_id"], "-")}
                                    </span>
                                </div>
                                <InfoRow label="Nama" value={getChildValue(child, ["nama_lengkap", "nama", "name"])}/>
                                <InfoRow label="Usia" value={getChildValue(child, ["usia", "age"])}/>
                                <InfoRow
                                    label="Jenis Kelamin"
                                    value={getChildValue(child, ["jenis_kelamin", "gender"])}
                                />
                                <InfoRow
                                    label="Tanggal Lahir"
                                    value={getChildValue(child, ["tanggal_lahir", "birth_date"])}
                                />
                                <InfoRow label="Alamat" value={getChildValue(child, ["alamat", "address"])}/>
                            </div>
                        ))
                    )}
                </DetailCard>
            </div>
        </section>
    )
}
