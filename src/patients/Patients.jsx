import {useLocalStorage} from "react-use"
import useAuth from "../auth/UseAuth.js"
import usePatientList from "../lib/hooks/usePatientList.js"
import PatientTable from "./PatientTable.jsx"

export default function Patients() {
    const [token] = useLocalStorage("token", "")
    const {logout, user} = useAuth()

    const normalizedRole = String(user?.role ?? "").toLowerCase()
    const isUserRole = normalizedRole === "user"
    const userId = String(user?.id ?? "")

    const {
        patients,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
    } = usePatientList({token, logout, isUserRole, userId})

    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                            Daftar Pasien
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {isUserRole
                                ? "Data anak Anda yang terdaftar di sistem."
                                : "Data pasien yang telah terdaftar di sistem."}
                        </p>
                    </div>
                    <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Total {patients.length} pasien
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

                <PatientTable
                    patients={patients}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </section>
    )
}