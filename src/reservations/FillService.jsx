import {useEffect, useState} from "react"
import {useLocation, useNavigate, useParams} from "react-router-dom"
import toast from "react-hot-toast"
import {useLocalStorage} from "react-use"
import useAuth from "../auth/UseAuth.js"
import {createVisitService} from "../lib/api/Queue.js"
import useServiceOptions from "../lib/hooks/useServiceOptions.js"
import {formatIndonesianDate} from "../lib/utils/formatIndonesianDate.js"

function getGenderLabel(genderValue) {
    if (genderValue === "L" || genderValue === "Laki-laki") {
        return "Laki-laki"
    }

    if (genderValue === "P" || genderValue === "Perempuan") {
        return "Perempuan"
    }

    return "-"
}

function InfoRow({label, value}) {
    return (
        <div className="flex items-center justify-between gap-6 py-2">
            <span className="text-sm text-slate-400">{label}</span>
            <span className="text-right text-sm font-medium text-slate-700">{value}</span>
        </div>
    )
}

export default function FillService() {
    const navigate = useNavigate()
    const location = useLocation()
    const {id} = useParams()
    const [token] = useLocalStorage("token", "")
    const {logout} = useAuth()

    const visit = location.state?.visit ?? {}

    const {
        activeServiceOptions,
        isLoading: isLoadingServices,
    } = useServiceOptions({token, logout})

    const [selectedServiceIds, setSelectedServiceIds] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const visitId = String(visit.id ?? id ?? "")

    useEffect(() => {
        if (!visitId) {
            toast.error("Data kunjungan tidak ditemukan.", {duration: 3000})
        }
    }, [visitId])

    function toggleService(serviceId) {
        setSelectedServiceIds((current) =>
            current.includes(serviceId)
                ? current.filter((item) => item !== serviceId)
                : [...current, serviceId]
        )
    }

    function handleBack() {
        navigate(-1)
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!visitId) {
            toast.error("Data kunjungan tidak ditemukan.")
            return
        }

        if (selectedServiceIds.length === 0) {
            toast.error("Pilih minimal satu layanan.")
            return
        }

        const toastId = toast.loading("Menyimpan layanan...")
        setIsSubmitting(true)

        try {
            for (const serviceId of selectedServiceIds) {
                const payload = {
                    visit_id: visitId,
                    service_id: serviceId,
                    result: "",
                    performed_by: null,
                }

                const response = await createVisitService(token, payload)
                const responseBody = await response.json()

                if (response.status === 401) {
                    logout()
                    return
                }

                if (response.status !== 200 && response.status !== 201) {
                    throw new Error(
                        responseBody?.message
                        ?? responseBody?.messages?.error
                        ?? "Layanan gagal disimpan."
                    )
                }
            }

            toast.success("Layanan berhasil disimpan.", {id: toastId})
            navigate(-1)
        } catch (error) {
            console.error(error)
            toast.error(error.message || "Terjadi kesalahan saat menyimpan layanan.", {id: toastId})
            setIsSubmitting(false)
        }
    }

    return (
        <section>
            <div className="flex flex-col items-center px-6 py-8">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Isi Layanan
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Tambahkan layanan yang akan diberikan kepada pasien.
                    </p>

                    <div className="mt-6 rounded-2xl bg-[#f8f9fc] px-5 py-4 text-left">
                        <InfoRow label="Nomor Antrian" value={visitId || "-"} />
                        <InfoRow label="Nama Pasien" value={visit.patient_name ?? "-"} />
                        <InfoRow label="Jenis Kelamin" value={getGenderLabel(visit.patient_gender ?? visit.gender)} />
                        <InfoRow label="Usia" value={visit.age ?? "-"} />
                        <InfoRow label="Tanggal Kunjungan" value={visit.visit_date ? formatIndonesianDate(visit.visit_date) : "-"} />
                    </div>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                Pilih Layanan
                            </label>
                            <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-3">
                                {isLoadingServices && (
                                    <p className="px-2 py-2 text-sm text-slate-500">Memuat layanan...</p>
                                )}

                                {!isLoadingServices && activeServiceOptions.length === 0 && (
                                    <p className="px-2 py-2 text-sm text-slate-500">Data layanan tidak tersedia.</p>
                                )}

                                {!isLoadingServices && activeServiceOptions.map((service) => (
                                    <label
                                        key={service.id}
                                        className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedServiceIds.includes(service.id)}
                                            onChange={() => toggleService(service.id)}
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>{service.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Memproses..." : "Simpan Layanan"}
                        </button>

                        <button
                            type="button"
                            onClick={handleBack}
                            className="w-full cursor-pointer rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-800"
                        >
                            Kembali
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
