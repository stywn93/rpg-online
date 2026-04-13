const queueData = [
    {
        id: 1,
        visitDate: "3 Nov 2025",
        height: "75.0 cm",
        weight: "11.5 kg",
        gizi: "kurang",
        ku: "kurang",
    },
    {
        id: 2,
        visitDate: "26 Okt 2025",
        height: "75.0 cm",
        weight: "11.0 kg",
        gizi: "kurang",
        ku: "kurang",
    },
]





export default function RiwayatAnamnesa() {
    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Riwayat Anamnesa
                        </h1>

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
                            <th className="border-b border-slate-200 px-4 py-3 font-medium">Tanggal</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium">Tinggi Badan</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium">Berat Badan</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium">Status Gizi</th>
                            <th className="border-b border-slate-200 px-4 py-3 font-medium">Keadaan Umum</th>
                        </tr>
                        </thead>
                        <tbody>
                        {queueData.map((item, index) => (
                            <tr key={item.id}>
                                <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-900">
                                    {index + 1}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                    {item.visitDate}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                    {item.height}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                    {item.weight}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                    {item.gizi}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                    {item.ku}
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
