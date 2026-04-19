import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

const initialQueueData = [
    {
        id: 1,
        patientName: "Budi Santoso",
        gender: "Laki-laki",
        age: "3 tahun 10 bulan",
        visitDate: "15 April 2026",
        referenceCode: "RPG9976315",
        status: "examining",
    },
    {
        id: 2,
        patientName: "Nabila Putri",
        gender: "Perempuan",
        age: "5 tahun 2 bulan",
        visitDate: "15 April 2026",
        referenceCode: "RPG9976316",
        status: "waiting",
    },
    {
        id: 3,
        patientName: "Raka Pratama",
        gender: "Laki-laki",
        age: "2 tahun 8 bulan",
        visitDate: "16 April 2026",
        referenceCode: "RPG9976317",
        status: "absent",
    },
    {
        id: 4,
        patientName: "Citra Maharani",
        gender: "Perempuan",
        age: "4 tahun 1 bulan",
        visitDate: "16 April 2026",
        referenceCode: "RPG9976318",
        status: "waiting",
    },
]

const rowStyles = {
    examining: "bg-blue-50",
    absent: "bg-red-50",
    waiting: "bg-white",
}

const monthMap = {
    januari: "01",
    februari: "02",
    maret: "03",
    april: "04",
    mei: "05",
    juni: "06",
    juli: "07",
    agustus: "08",
    september: "09",
    oktober: "10",
    november: "11",
    desember: "12",
}

function normalizeVisitDate(value) {
    const [day, monthName, year] = value.split(" ")
    const month = monthMap[monthName?.toLowerCase()]

    if (!day || !month || !year) {
        return ""
    }

    return `${year}-${month}-${day.padStart(2, "0")}`
}

function ActionButton({ children, variant = "primary", onClick }) {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-800 cursor-pointer",
        accent: "bg-fuchsia-600 text-white hover:bg-fuchsia-800 cursor-pointer",
        secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer",
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition ${variants[variant]}`}
        >
            {children}
        </button>
    )
}

export default function AntrianKunjungan() {
    const navigate = useNavigate()
    const [queueData, setQueueData] = useState(initialQueueData)
    const [selectedDate, setSelectedDate] = useState("")

    const filteredQueueData = useMemo(() => {
        if (!selectedDate) {
            return queueData
        }

        return queueData.filter((item) => normalizeVisitDate(item.visitDate) === selectedDate)
    }, [queueData, selectedDate])

    const handleCheckIn = (referenceCode) => {
        setQueueData((currentQueue) =>
            currentQueue.map((item) =>
                item.referenceCode === referenceCode
                    ? { ...item, status: "examining" }
                    : item
            )
        )
    }

    const handleAbsent = (referenceCode) => {
        setQueueData((currentQueue) =>
            currentQueue.map((item) =>
                item.referenceCode === referenceCode
                    ? { ...item, status: "absent" }
                    : item
            )
        )
    }

    const handlePrimaryAction = (item) => {
        if (item.status === "examining") {
            navigate("/reservation/assesment", {
                state: {
                    patientName: item.patientName,
                    gender: item.gender,
                    age: item.age,
                    visitDate: item.visitDate,
                    referenceCode: item.referenceCode,
                },
            })
            return
        }

        handleCheckIn(item.referenceCode)
    }

    return (
        <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Antrian Kunjungan
                        </h1>
                        <p className="text-sm text-slate-500">
                            Daftar pasien yang sudah memiliki rencana kunjungan.
                        </p>
                    </div>
                    <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                        Total {filteredQueueData.length} pasien
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <label htmlFor="visit-date-filter" className="text-sm font-medium text-slate-700 mr-3">
                            Filter tanggal kunjungan
                        </label>
                        <input
                            id="visit-date-filter"
                            type="date"
                            value={selectedDate}
                            onChange={(event) => setSelectedDate(event.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none sm:w-56"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedDate("")}
                        disabled={!selectedDate}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Reset filter
                    </button>
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
                            {filteredQueueData.map((item, index) => (
                                <tr key={item.referenceCode} className={rowStyles[item.status] ?? rowStyles.waiting}>
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
                                            {item.status !== "absent" && (
                                                <ActionButton
                                                    variant={item.status === "examining" ? "accent" : "primary"}
                                                    onClick={() => handlePrimaryAction(item)}
                                                >
                                                    {item.status === "examining" ? "Melayani" : "Check-in"}
                                                </ActionButton>
                                            )}
                                            {item.status !== "examining" && item.status !== "absent" && (
                                                <ActionButton
                                                    variant="secondary"
                                                    onClick={() => handleAbsent(item.referenceCode)}
                                                >
                                                    Tidak Hadir
                                                </ActionButton>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredQueueData.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                                        Tidak ada data kunjungan pada tanggal yang dipilih.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-700">Keterangan</p>
                    <div className="mt-3 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:gap-5">
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full bg-blue-500" />
                            <span>Warna biru artinya Sedang Dalam Pemeriksaan</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full bg-red-500" />
                            <span>Warna merah artinya Tidak Hadir</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full border border-slate-300 bg-white" />
                            <span>Tanpa warna artinya Dalam Antrian</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
