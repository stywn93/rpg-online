import {useEffect, useEffectEvent, useMemo, useState} from "react"
import { Link } from "react-router-dom"
import {listPatients, listPatientsByParent} from "../lib/api/Patient.js"
import {useLocalStorage} from "react-use"
import {formatIndonesianDate} from "../lib/utils/formatIndonesianDate.js"
import useAuth from "../auth/UseAuth.js"
import {isUser} from "../auth/permissions.js"
import {normalizePeopleDetail} from "../lib/utils/Normalization.js"

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

export default function Patients() {
    const [searchTerm, setSearchTerm] = useState("")
    const [token, _] = useLocalStorage("token", "")
    const [patients, setPatients] = useState([])
    const {logout, user} = useAuth()

    const filteredPatients = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase()

        if (!keyword) {
            return patients
        }

        return patients.filter((patient) =>
            [
                patient.id,
                patient.nama,
                patient.alamat,
                patient.jenis_kelamin,
                patient.usia,
            ].some((value) => String(value).toLowerCase().includes(keyword))
        )
    }, [patients, searchTerm])

    const fetchPatients = useEffectEvent(async function getPatients(){
        try {
            const response = isUser(user)
                ? await listPatientsByParent(token, user.id)
                : await listPatients(token)
            const responseBody = await response.json()

            if (response.status === 200) {
                setPatients(normalizePeopleDetail(responseBody))
            }

            if (response.status === 401) {
                logout()
            }
        } catch (e) {
            console.error(e)
        }
    })

    useEffect(() => {
        if (token) {
            fetchPatients()
        }
    }, [token, user?.id])

    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                            Daftar Pasien
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Data pasien yang telah terdaftar di sistem.
                        </p>
                    </div>
                    <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Total {filteredPatients.length} pasien
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <label htmlFor="patient-search" className="text-sm font-medium text-slate-700 dark:text-slate-200 mr-3">
                            Cari pasien
                        </label>
                        <input
                            id="patient-search"
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Cari nama pasien, ID, orang tua, atau alamat"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none sm:w-56"
                        />
                    </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead>
                            <tr className="text-slate-500 dark:text-slate-400">
                                <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">ID</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Nama Pasien</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Tanggal Lahir</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Jenis Kelamin</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Usia</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Alamat</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="bg-white dark:bg-slate-900">
                                    <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            {patient.id}
                                        </span>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-900 dark:border-slate-700 dark:text-slate-100">
                                        {patient.nama}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                        {formatIndonesianDate(patient.tanggal_lahir)}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                        {patient.jenis_kelamin === "L" ? "Laki-laki" : patient.jenis_kelamin === "P" ? "Perempuan" : patient.jenis_kelamin}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                        {patient.usia}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                                        {patient.alamat}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
                                        <div className="flex flex-wrap gap-2">
                                            <ActionButton to={`/patients/${patient.id}`}>Detail</ActionButton>
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
