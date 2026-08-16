import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {getServiceTypeDetail, createServiceType, updateServiceType} from "../lib/api/ServiceTypes.js"
import {useLocalStorage} from "react-use"
import useAuth from "../auth/UseAuth.js"
import toast from "react-hot-toast"

export default function ServiceForm() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [token] = useLocalStorage("token", "")
    const {logout} = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        service_name: "",
    })

    useEffect(() => {
        if (id && token) {
            setIsLoading(true)
            getServiceTypeDetail(token, id)
                .then(res => res.json())
                .then(body => {
                    if (body?.status === 401) {
                        logout()
                        return
                    }
                    if (body?.data) {
                        setFormData({
                            service_name: body.data.service_name ?? "",
                        })
                    }
                })
                .finally(() => setIsLoading(false))
        }
    }, [id, token, logout])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            let response
            if (id) {
                response = await updateServiceType(token, id, formData)
            } else {
                response = await createServiceType(token, formData)
            }

            const body = await response.json()

            if (response.status === 401) {
                logout()
                return
            }
            if (body?.status !== "success") {
                throw new Error(body?.message ?? "Gagal menyimpan layanan.")
            }

            toast.success("Layanan berhasil disimpan.")
            navigate("/services")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="p-6">
            <div className="w-full bg-white dark:bg-slate-950 rounded-lg shadow sm:max-w-md mx-auto">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                        {id ? "Edit Layanan" : "Tambah Layanan"}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Layanan <span className="text-red-500">*</span></label>
                            <input type="text" value={formData.service_name} onChange={e => setFormData({...formData, service_name: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>

                        <button type="submit" disabled={isLoading} className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? "Memproses..." : "Simpan"}
                        </button>
                        <button type="button" onClick={() => navigate(-1)} className="cursor-pointer w-full text-white bg-rose-600 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Kembali
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}