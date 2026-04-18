import { useNavigate, useParams } from "react-router-dom"
import { patientData } from "./data/patients.js"

function InfoRow({ label, value }) {
    return (
        <div className="grid gap-1 border-b border-slate-100 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">{label}</p>
            <p className="text-sm leading-6 text-slate-700">{value}</p>
        </div>
    )
}

export default function DetailPasien() {
    const navigate = useNavigate()
    const { patientId } = useParams()
    const patient = patientData.find((item) => item.id === patientId)

    if (!patient) {
        return (
            <section className="space-y-5">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Detail Pasien
                    </h1>
                    <p className="mt-3 text-sm text-slate-500">
                        Data pasien dengan ID {patientId} tidak ditemukan.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Detail Pasien
                        </h1>
                        <p className="text-sm text-slate-500">
                            Informasi lengkap pasien berdasarkan ID yang dipilih.
                        </p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold tracking-[0.08em] text-slate-700">
                        {patient.id}
                    </div>
                </div>

                <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50/60 px-5">
                    <InfoRow label="Nama Pasien" value={patient.name} />
                    <InfoRow label="Tanggal Lahir" value={patient.birthDate} />
                    <InfoRow label="Usia" value={patient.age} />
                    <InfoRow label="Tempat Lahir" value={patient.birthPlace} />
                    <InfoRow label="Nama Orang Tua" value={patient.parentName} />
                    <InfoRow label="Golongan Darah" value={patient.bloodType} />
                    <InfoRow label="Alamat" value={patient.address} />
                </div>
                <button type="button" onClick={() => navigate(-1)}
                        className="mt-5 cursor-pointer text-white bg-rose-600 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed">Kembali
                </button>
            </div>
        </section>
    )
}
