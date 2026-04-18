import { Link } from "react-router-dom"

const patientData = [
    {
        id: "PSN-0001",
        name: "Budi Santoso",
        birthDate: "12 Januari 2021",
        age: "5 tahun",
        birthPlace: "Situbondo",
        parentName: "Andi Santoso",
        bloodType: "O",
        address: "Jl. Melati No. 8, Situbondo",
    },
    {
        id: "PSN-0002",
        name: "Nabila Putri",
        birthDate: "23 Maret 2020",
        age: "6 tahun",
        birthPlace: "Bondowoso",
        parentName: "Rina Wulandari",
        bloodType: "A",
        address: "Jl. Kenanga No. 14, Bondowoso",
    },
    {
        id: "PSN-0003",
        name: "Raka Pratama",
        birthDate: "8 Juli 2022",
        age: "3 tahun 9 bulan",
        birthPlace: "Jember",
        parentName: "Dedi Pratama",
        bloodType: "B",
        address: "Perum Griya Asri Blok C2, Jember",
    },
    {
        id: "PSN-0004",
        name: "Citra Maharani",
        birthDate: "30 November 2019",
        age: "6 tahun 4 bulan",
        birthPlace: "Banyuwangi",
        parentName: "Siska Maharani",
        bloodType: "AB",
        address: "Dusun Krajan RT 03 RW 01, Banyuwangi",
    },
]

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
                        Total {patientData.length} pasien
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
                            {patientData.map((patient) => (
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
                                            <ActionButton variant="secondary">Ubah</ActionButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
