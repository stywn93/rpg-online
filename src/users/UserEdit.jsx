import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useLocalStorage } from "react-use"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import useAuth from "../auth/UseAuth.js"
import { getUserDetail, updateUserDetail } from "../lib/api/User.js"

const inputClassName = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"

export default function UserEdit() {
    const navigate = useNavigate()
    const { userID, patientId } = useParams()
    const id = userID ?? patientId
    const [token] = useLocalStorage("token", "")
    const { logout } = useAuth()
    const [isFetching, setIsFetching] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { name: "", email: "" },
    })

    useEffect(() => {
        if (!token || !id) return
        let cancelled = false
        async function fetchDetail() {
            setIsFetching(true)
            try {
                const res = await getUserDetail(token, id)
                const body = await res.json()
                if (res.status === 401) { logout(); return }
                if (res.status !== 200) { if (!cancelled) setNotFound(true); return }
                const user = body?.data
                if (!user) { if (!cancelled) setNotFound(true); return }
                if (!cancelled) reset({ name: user.name ?? "", email: user.email ?? "" })
            } catch {
                if (!cancelled) setNotFound(true)
            } finally { if (!cancelled) setIsFetching(false) }
        }
        fetchDetail()
        return () => { cancelled = true }
    }, [token, id, logout, reset])

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        const tid = toast.loading("Menyimpan...")
        try {
            const res = await updateUserDetail(token, id, { name: data.name })
            const body = await res.json()
            if (res.status === 401) { logout(); return }
            if (body?.status !== "success" && res.status !== 200) throw new Error(body?.message ?? "Gagal menyimpan.")
            toast.success("Data pengguna diperbarui.", { id: tid })
            navigate(`/users/${id}`)
        } catch (e) { toast.error(e.message, { id: tid }) }
        finally { setIsSubmitting(false) }
    }

    if (isFetching) return <section className="p-5 text-sm text-slate-500">Memuat...</section>
    if (notFound) return (
        <section className="space-y-5">
            <div className="rounded-lg border bg-white p-5 shadow-sm">
                <h1 className="text-xl font-bold">Ubah Data Pengguna</h1>
                <p className="mt-3 text-sm text-slate-500">Pengguna {id} tidak ditemukan.</p>
                <button type="button" onClick={() => navigate(-1)} className="mt-4 rounded-lg bg-rose-600 px-5 py-2.5 text-sm text-white">Kembali</button>
            </div>
        </section>
    )

    return (
        <section>
            <div className="flex flex-col items-center px-6 mx-auto lg:py-0">
                <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 sm:p-8">
                        <h1 className="text-xl font-bold">Ubah Data Pengguna</h1>
                        <p className="text-sm text-slate-500">ID {id}</p>
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Nama <span className="text-red-500">*</span></label>
                                <input className={inputClassName} {...register("name", { required: "Nama wajib diisi" })} />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Email</label>
                                <input className={`${inputClassName} opacity-70`} readOnly {...register("email")} />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm text-white disabled:opacity-50">{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</button>
                            <button type="button" onClick={() => navigate(-1)} className="w-full rounded-lg bg-rose-600 px-5 py-2.5 text-sm text-white">Kembali</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
