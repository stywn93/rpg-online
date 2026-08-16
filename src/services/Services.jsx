import Swal from "sweetalert2"
import toast from "react-hot-toast"
import {useLocalStorage} from "react-use"
import useAuth from "../auth/UseAuth.js"
import useServiceList from "../lib/hooks/useServiceList.js"
import ServiceTable from "./ServiceTable.jsx"
import ActionButton from "../components/ActionButton.jsx"

export default function Services() {
    const [token] = useLocalStorage("token", "")
    const {logout} = useAuth()

    const {services, isLoading, isDeleting, error, deleteService} = useServiceList({token, logout})

    const handleDelete = async (service) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: `Layanan "${service.name}" akan dihapus secara permanen!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        })

        if (!result.isConfirmed) return

        try {
            await deleteService(service.id)
            toast.success("Layanan berhasil dihapus.")
        } catch (deleteError) {
            toast.error(deleteError.message)
        }
    }

    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-950 dark:bg-slate-950 dark:text-slate-50">
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

                <ServiceTable
                    services={services}
                    isLoading={isLoading}
                    isDeleting={isDeleting}
                    error={error}
                    onDelete={handleDelete}
                />
            </div>
        </section>
    )
}