import {useEffect, useState, useCallback} from "react"
import {Link} from "react-router-dom"
import {listService, deleteServiceType} from "../lib/api/ServiceTypes.js"
import {useLocalStorage} from "react-use"
import useAuth from "../auth/UseAuth.js"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import "sweetalert2/src/sweetalert2.scss"

function ActionButton({children, variant = "primary", to, onClick, disabled}) {
    const variants = {
        primary: "bg-blue-600 dark:bg-blue-100 text-slate-50 dark:text-slate-900 hover:bg-blue-800 cursor-pointer",
        secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer",
        danger: "bg-red-600 dark:bg-red-100 text-slate-50 dark:text-slate-900 hover:bg-red-800 cursor-pointer",
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

export default function ServiceList() {
    const [services, setServices] = useState([])
    const [token] = useLocalStorage("token", "")
    const [loading, setLoading] = useState(true)
    const {logout} = useAuth()

    const fetchServices = useCallback(async () => {
        setLoading(true)
        try {
            const response = await listService(token, {perPage: 100})
            if (response.status === 401) {
                logout()
                return
            }
            const responseBody = await response.json()
            setServices(responseBody.data ?? [])
        } catch (e) {
            console.error(e)
            toast.error("Gagal memuat data layanan.")
        } finally {
            setLoading(false)
        }
    }, [token, logout])

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Layanan ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
        })

        if (!result.isConfirmed) return
        
        try {
            const response = await deleteServiceType(token, id)
            if (response.status === 401) {
                logout()
                return
            }
            if (!response.ok) throw new Error("Gagal menghapus layanan.")
            
            toast.success("Layanan berhasil dihapus.")
            fetchServices()
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) fetchServices()
    }, [token, fetchServices])

    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white dark:bg-slate-950 dark:text-slate-50 p-5 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                            Layanan
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-200">
                            Data Layanan yang telah terdaftar di sistem.
                        </p>
                    </div>
                    <ActionButton to="/services/create">Tambah Layanan</ActionButton>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead>
                            <tr className="text-slate-500 dark:text-slate-100">
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Nama</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Deskripsi</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Durasi (Menit)</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Aktif</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 text-center">Memuat...</td>
                                </tr>
                            ) : services.map(service => (
                                <tr key={service.id} className="bg-slate-50 dark:bg-slate-950">
                                    <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 font-medium text-slate-900 dark:text-slate-100">{service.nama_layanan}</td>
                                    <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">{service.deskripsi}</td>
                                    <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">{service.durasi_estimasi_menit}</td>
                                    <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4 text-slate-700 dark:text-slate-100">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${service.aktif == 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {service.aktif == 1 ? "Ya" : "Tidak"}
                                        </span>
                                    </td>
                                    <td className="border-b border-slate-100 dark:border-slate-500 px-4 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <ActionButton to={`/services/${service.id}/edit`}>Edit</ActionButton>
                                            <ActionButton variant="danger" onClick={() => handleDelete(service.id)}>Hapus</ActionButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
