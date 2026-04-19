import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { patientData } from "./data/patients.js"

function ActionButton({ children, variant = "primary", to }) {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-800 cursor-pointer",
        secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer",
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
            className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition ${variants[variant]}`}
        >
            {children}
        </button>
    )
}

export default function Pasien() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredPatients = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase()

        if (!keyword) {
            return patientData
        }

        return patientData.filter((patient) =>
            [
                patient.id,
                patient.name,
                patient.parentName,
                patient.address,
            ].some((value) => value.toLowerCase().includes(keyword))
        )
    }, [searchTerm])

    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Daftar Pasien
                        </h1>
                        <p className="text-sm text-slate-500">
                            Data pasien yang telah terdaftar di sistem.
                        </p>
                    </div>
                    <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                        Total {filteredPatients.length} pasien
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="w-full space-y-1 sm:max-w-md">
                        <label htmlFor="patient-search" className="text-sm font-medium text-slate-700">
                            Cari pasien
                        </label>
                        <input
                            id="patient-search"
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Cari nama pasien, ID, orang tua, atau alamat"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead>
                            <tr className="text-slate-500">
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">ID</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Nama Pasien</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Tanggal Lahir</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Usia</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Tempat Lahir</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Nama Orang Tua</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Golongan Darah</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Alamat</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="bg-white">
                                    <td className="border-b border-slate-100 px-4 py-4">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-slate-700">
                                            {patient.id}
                                        </span>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-900">
                                        {patient.name}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {patient.birthDate}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {patient.age}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {patient.birthPlace}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {patient.parentName}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {patient.bloodType}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {patient.address}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <ActionButton to={`/patients/${patient.id}`}>Detail</ActionButton>
                                            <ActionButton variant="secondary" to={`/patients/${patient.id}/edit`}>Ubah</ActionButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPatients.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-4 py-6 text-center text-sm text-slate-500">
                                        Pasien tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
