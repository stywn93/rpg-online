import {useEffect, useState} from "react"
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

function PaginationButton({children, disabled = false, onClick}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex min-w-8 items-center justify-center rounded-xl py-1 text-sm font-semibold transition ${
                disabled
                    ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                    : "border border-blue-200 bg-blue-50 text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-100"
            }`}
        >
            {children}
        </button>
    )
}

export default function AnamnesaHistory({riwayat = []}) {
    const perPage = 10
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(riwayat.length / perPage)
    const paginatedRiwayat = riwayat.slice((currentPage - 1) * perPage, currentPage * perPage)

    useEffect(() => {
        setCurrentPage(1)
    }, [riwayat.length])

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
                            {paginatedRiwayat.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-900">
                                        {(currentPage - 1) * perPage + index + 1}
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

                    {paginatedRiwayat.length > 0 && totalPages > 1 && (
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Menampilkan {(currentPage - 1) * perPage + 1}-
                                {Math.min(currentPage * perPage, riwayat.length)} dari {riwayat.length} data
                            </p>
                            <div className="flex items-center gap-3">
                                <PaginationButton
                                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                    disabled={currentPage === 1}
                                >
                                    &lt;
                                </PaginationButton>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                                    {currentPage} / {totalPages}
                                </span>
                                <PaginationButton
                                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    &gt;
                                </PaginationButton>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    )
}
