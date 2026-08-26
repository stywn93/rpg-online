import ActionButton from "../components/ActionButton.jsx"
import {formatIndonesianDate} from "../lib/utils/formatIndonesianDate.js"

function formatGender(genderCode) {
    if (genderCode === "L") {
        return "Laki-laki"
    }
    if (genderCode === "P") {
        return "Perempuan"
    }
    return genderCode
}

export default function PatientTable({patients, isLoading, error}) {
    return (
        <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead>
                <tr className="text-slate-500 dark:text-slate-400">
                    <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">ID</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Nama Pasien</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Orang Tua</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Tanggal Lahir</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Jenis Kelamin</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Usia</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Alamat</th>
                    <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {patients.map((patient) => (
                    <tr key={patient.id} className="bg-white dark:bg-slate-900">
                        <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {patient.id}
                            </span>
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-900 dark:border-slate-700 dark:text-slate-100">
                            {patient.name}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                            {patient.parent_name}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                            {formatIndonesianDate(patient.dob)}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                            {formatGender(patient.gender_code)}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                            {patient.age}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                            {patient.address}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-700">
                            <div className="flex flex-wrap gap-2">
                                <ActionButton to={`/patients/${patient.id}`}>Detail</ActionButton>
                                <ActionButton to={`/patients/${patient.id}/edit`}>Edit</ActionButton>
                            </div>
                        </td>
                    </tr>
                ))}
                {isLoading && patients.length === 0 && (
                    <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Memuat data...
                        </td>
                    </tr>
                )}
                {!isLoading && error && (
                    <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-sm text-red-500">
                            Gagal memuat data pasien.
                        </td>
                    </tr>
                )}
                {!isLoading && !error && patients.length === 0 && (
                    <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Pasien tidak ditemukan.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}