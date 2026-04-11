const queueData = [
    {
        id: 1,
        patientName: "Budi Santoso",
        gender: "Laki-laki",
        age: "3 tahun 10 bulan",
        visitDate: "15 April 2026",
        referenceCode: "RPG9976315",
    },
    {
        id: 2,
        patientName: "Nabila Putri",
        gender: "Perempuan",
        age: "5 tahun 2 bulan",
        visitDate: "15 April 2026",
        referenceCode: "RPG9976316",
    },
    {
        id: 3,
        patientName: "Raka Pratama",
        gender: "Laki-laki",
        age: "2 tahun 8 bulan",
        visitDate: "16 April 2026",
        referenceCode: "RPG9976317",
    },
    {
        id: 4,
        patientName: "Citra Maharani",
        gender: "Perempuan",
        age: "4 tahun 1 bulan",
        visitDate: "16 April 2026",
        referenceCode: "RPG9976318",
    },
]

function ActionButton({ children, variant = "primary" }) {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-800",
        secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
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

export default function AntrianKunjungan() {
    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Antrian Kunjungan</h2>
                        <p className="text-sm text-slate-500">
                            Daftar pasien yang sudah memiliki rencana kunjungan.
                        </p>
                    </div>
                    <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                        Total {queueData.length} pasien
                    </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead>
                            <tr className="text-slate-500">
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Nomor</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Nama Pasien</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Jenis Kelamin</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Usia</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Tanggal Kunjungan</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Kode Referensi</th>
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queueData.map((item, index) => (
                                <tr key={item.referenceCode} className="odd:bg-slate-50/60">
                                    <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-900">
                                        {index + 1}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {item.patientName}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {item.gender}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {item.age}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {item.visitDate}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-slate-700">
                                            {item.referenceCode}
                                        </span>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <ActionButton variant="secondary">Detail</ActionButton>
                                            <ActionButton>Check-in</ActionButton>
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
