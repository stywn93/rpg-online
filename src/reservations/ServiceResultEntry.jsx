import {useEffect, useState} from "react"
import {useLocation, useNavigate, useParams} from "react-router-dom"
import toast from "react-hot-toast"
import {useLocalStorage} from "react-use"
import useAuth from "../auth/UseAuth.js"
import {getVisitServiceDetail, updateVisitServiceResult, updateQueue} from "../lib/api/Queue.js"
import useVisitServiceResults from "../lib/hooks/useVisitServiceResults.js"
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

export default function ServiceResultEntry() {
    const navigate = useNavigate()
    const location = useLocation()
    const {id} = useParams()
    const [token] = useLocalStorage("token", "")
    const {logout, user} = useAuth()

    const stateVisit = location.state?.visit ?? {}
    const visitServiceId = String(location.state?.visitServiceId ?? "")

    const visitId = String(stateVisit.visit_id ?? stateVisit.id ?? id ?? "")

    const {
        records: allRecords,
        visit,
        isLoading,
        error,
    } = useVisitServiceResults({token, logout, visitId: visitServiceId ? "" : visitId})

    const localRecords = visitServiceId
        ? [{
            recordId: visitServiceId,
            serviceId: String(stateVisit.service_id ?? ""),
            serviceName: stateVisit.service_name ?? "",
        }]
        : []

    const [savedResult, setSavedResult] = useState("")

    useEffect(() => {
        if (!token || !visitServiceId) {
            return
        }

        let isCancelled = false

        async function fetchSavedResult() {
            try {
                const response = await getVisitServiceDetail(token, visitServiceId)
                const body = await response.json()

                if (response.status === 401) {
                    logout()
                    return
                }

                if (response.status === 200 && !isCancelled) {
                    setSavedResult(body?.data?.result ?? "")
                }
            } catch {
                if (!isCancelled) {
                    setSavedResult("")
                }
            }
        }

        fetchSavedResult()

        return () => {
            isCancelled = true
        }
    }, [token, visitServiceId, logout])

    const records = visitServiceId
        ? [{...localRecords[0], result: savedResult}]
        : allRecords

    const detail = Object.keys(stateVisit).length > 0 ? stateVisit : visit

    const [results, setResults] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleResultChange(key, value) {
        setResults((current) => ({
            ...current,
            [key]: value,
        }))
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

        if (records.length === 0) {
            toast.error("Tidak ada layanan untuk dikisi hasilnya.")
            return
        }

        const emptyCount = records
            .map((record, index) => (results[index] ?? record.result ?? "").trim())
            .reduce((count, value) => (value ? count : count + 1), 0)

        if (emptyCount > 0) {
            toast.error(`Masih ada ${emptyCount} hasil layanan yang belum diisi.`)
            return
        }

        console.log("records untuk PATCH:", records)
        const toastId = toast.loading("Menyimpan hasil layanan...")
        setIsSubmitting(true)

        try {
            for (const [index, record] of records.entries()) {
                const effectiveResult = (results[index] ?? record.result ?? "").trim()
                const payload = {
                    visit_id: String(detail.visit_id ?? visitId),
                    service_id: String(record.serviceId),
                    result: effectiveResult,
                    performed_by: user?.id,
                }

                console.log(`PATCH #${index}:`, {urlId: record.recordId || visitId, payload})
                const responseVisit = await updateQueue(token, visitId, "finished")
                // let responseVisitBody = {}
                // try {
                //     responseVisitBody = await responseVisit.json()
                // } catch {
                //     responseVisitBody = {}
                // }

                //tambahkan update visit untuk menandai kunjungan sudah s
                const response = await updateVisitServiceResult(
                    token,
                    record.recordId || visitId,
                    payload
                )
                let responseBody = {}

                try {
                    responseBody = await response.json()
                } catch {
                    responseBody = {}
                }

                if (response.status === 401) {
                    logout()
                    return
                }

                if (response.status !== 200 && response.status !== 201 && response.status !== 204) {
                    console.error("PATCH gagal:", {
                        url: record.recordId || visitId,
                        payload,
                        status: response.status,
                        responseBody,
                    })

                    throw new Error(
                        `[${response.status}] ${responseBody?.message
                            ?? responseBody?.messages?.error
                            ?? "Hasil layanan gagal disimpan."}`
                    )
                }
            }

            toast.success("Hasil layanan berhasil disimpan.", {id: toastId})
            navigate(-1)
        } catch (submitError) {
            console.error(submitError)
            toast.error(submitError.message || "Terjadi kesalahan saat menyimpan hasil layanan.", {id: toastId})
            setIsSubmitting(false)
        }
    }

    return (
        <section>
            <div className="flex flex-col items-center px-6 py-8">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Entri Hasil Layanan
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Isi hasil untuk setiap layanan yang diberikan kepada pasien.
                    </p>

                    <div className="mt-6 rounded-2xl bg-[#f8f9fc] px-5 py-4 text-left">
                        <InfoRow label="Nomor Antrian" value={detail.id ?? detail.visit_id ?? "-"} />
                        <InfoRow label="Nama Pasien" value={detail.patient_name ?? "-"} />
                        <InfoRow label="Jenis Kelamin" value={getGenderLabel(detail.patient_gender ?? detail.gender)} />
                        <InfoRow label="Usia" value={detail.age ?? "-"} />
                        <InfoRow label="Tanggal Kunjungan" value={detail.visit_date ? formatIndonesianDate(detail.visit_date) : "-"} />
                    </div>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                Daftar Layanan
                            </label>
                            <div className="space-y-3">
                                {!visitServiceId && isLoading && (
                                    <p className="px-2 py-2 text-sm text-slate-500">Memuat layanan...</p>
                                )}

                                {!isLoading && error && !visitServiceId && (
                                    <p className="px-2 py-2 text-sm text-red-500">Gagal memuat data layanan.</p>
                                )}

                                {!isLoading && !error && records.length === 0 && (
                                    <p className="px-2 py-2 text-sm text-slate-500">
                                        {visitServiceId
                                            ? "Layanan tidak ditemukan pada kunjungan ini."
                                            : "Tidak ada layanan pada kunjungan ini."}
                                    </p>
                                )}

                                {records.map((record, index) => (
                                    <div
                                        key={record.recordId || `${record.serviceId}-${index}`}
                                        className="rounded-xl border border-slate-200 p-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium text-slate-700">
                                                {record.serviceName || `Layanan #${record.serviceId}`}
                                            </p>
                                            {(results[index] ?? record.result ?? "").trim() !== "" && (
                                                <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                    Hasil tersimpan
                                                </span>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={results[index] ?? record.result ?? ""}
                                            onChange={(event) => handleResultChange(index, event.target.value)}
                                            placeholder="Isi hasil layanan"
                                            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="w-full cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Memproses..." : "Simpan Hasil Layanan"}
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
