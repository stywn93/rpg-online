import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {createServiceType, getServiceTypeDetail, updateServiceType} from "../lib/api/ServiceTypes.js"
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
        nama_layanan: "",
        deskripsi: "",
        durasi_estimasi_menit: "",
        aktif: 1
    })

    useEffect(() => {
        if (id && token) {
            setIsLoading(true)
            getServiceTypeDetail(token, id)
                .then(res => res.json())
                .then(data => {
                    if (data.data) {
                        setFormData({
                            nama_layanan: data.data.nama_layanan,
                            deskripsi: data.data.deskripsi,
                            durasi_estimasi_menit: data.data.durasi_estimasi_menit,
                            aktif: data.data.aktif ? 1 : 0
                        })
                    }
                })
                .finally(() => setIsLoading(false))
        }
    }, [id, token])

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
            
            if (response.status === 401) {
                logout()
                return
            }
            if (!response.ok) throw new Error("Gagal menyimpan layanan.")
            
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
                            <input type="text" value={formData.nama_layanan} onChange={e => setFormData({...formData, nama_layanan: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>
                        
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deskripsi</label>
                            <textarea value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>
                        
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Durasi (Menit) <span className="text-red-500">*</span></label>
                            <input type="number" value={formData.durasi_estimasi_menit} onChange={e => setFormData({...formData, durasi_estimasi_menit: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.aktif === 1} onChange={e => setFormData({...formData, aktif: e.target.checked ? 1 : 0})} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                            <label className="text-sm font-medium text-gray-900 dark:text-white">Aktif</label>
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
