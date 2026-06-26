import {formatIndonesianDate} from "../lib/utils/formatIndonesianDate.js"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from "recharts"


function StatusBadge({ value }) {
    const isLowStatus = value.toLowerCase() === "kurang"

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                isLowStatus ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
            }`}
        >
            {value}
        </span>
    )
}

export default function AnamnesaHistory({riwayat = []}) {
    const chartData = [...riwayat]
        .sort((a, b) => new Date(a.tanggal_pemeriksaan) - new Date(b.tanggal_pemeriksaan))
        .map(item => ({
            date: item.tanggal_pemeriksaan,
            tinggi: parseFloat(item.tinggi_badan),
            berat: parseFloat(item.berat_badan),
        }))

    return (
        <section className="w-full">
            <div className="mx-auto w-full">
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Riwayat Anamnesa
                            </h1>

                        </div>
                        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                            Total {riwayat.length} pemeriksaan
                        </div>
                    </div>

                    {chartData.length > 0 && (
                        <div className="mt-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{fontSize: 12}}
                                        tickFormatter={(val) => formatIndonesianDate(val)}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        label={{value: "Tinggi (cm)", angle: -90, position: "insideLeft", style: {fontSize: 12}}}
                                        tick={{fontSize: 12}}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        label={{value: "Berat (kg)", angle: 90, position: "insideRight", style: {fontSize: 12}}}
                                        tick={{fontSize: 12}}
                                    />
                                    <Tooltip labelFormatter={(val) => formatIndonesianDate(val)} />
                                    <Legend />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="tinggi"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        name="Tinggi Badan"
                                        dot={{r: 4}}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="berat"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        name="Berat Badan"
                                        dot={{r: 4}}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

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
                                <th className="border-b border-slate-200 px-4 py-3 font-medium">Keterangan</th>
                            </tr>
                            </thead>
                            <tbody>
                            {riwayat.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-900">
                                        {index + 1}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {formatIndonesianDate(item.tanggal_pemeriksaan)}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {item.tinggi_badan}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {item.berat_badan}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        <StatusBadge value={item.status_gizi} />
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        <StatusBadge value={item.keadaan_umum} />
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                        {item.keterangan}
                                    </td>


                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </section>
    )
}
