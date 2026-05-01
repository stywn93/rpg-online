import {useEffect, useEffectEvent, useMemo, useState} from "react"
import {useNavigate} from "react-router-dom"
import {queueList} from "./lib/api/Queue.js"
import {useLocalStorage} from "react-use"
import useAuth from "./UseAuth.js"


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

function getTodayDate() {
    const now = new Date()
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)

    return localDate.toISOString().split("T")[0]
}

function ActionButton({children, variant = "primary", onClick}) {
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
    const [token, _] = useLocalStorage("token", "");
    const navigate = useNavigate()

    const [selectedDate, setSelectedDate] = useLocalStorage("tanggalKunjungan", getTodayDate())
    const [queues, setQueues] = useState([])
    const [totalPage, setTotalPage] = useState(1);
    const {logout} = useAuth()



    const updateQueue = useEffectEvent(async function fetchQueue() {
        //useEffectEvent adalah hooks yang diperkenalkan sejak react 19 untuk memastikan useEffect mendapatkan state terbaru
        try {
            const response = await queueList(token, selectedDate)
            const responseBody = await response.json();
            // console.log(responseBody)
            // console.log(selectedDate)

            if (response.status === 200) {
                setQueues(responseBody.data)
            }
            if (response.status === 401) {
                // console.log("tidak punya otoritas")
                logout()
            }
        } catch (error) {
            console.log(error)
        }

    })

    const handleCheckIn = (id) => {
        console.log(id)
        setQueues((currentQueue) =>
            currentQueue.map((item) =>
                item.id === id
                    ? {...item, status: "checked_in"}
                    : item
            )
        )
    }

    const handleAbsent = (id) => {
        setQueues((currentQueue) =>
            currentQueue.map((item) =>
                item.id === id
                    ? {...item, status: "absent"}
                    : item
            )
        )
    }

    const handlePrimaryAction = (item) => {
        console.log("clicked")
        if (item.status === "checked_in") {
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

        handleCheckIn(item.id)
    }
    useEffect(() => {
        updateQueue()
    }, [token, selectedDate])

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
                        Total {queues.length} pasien
                    </div>
                </div>

                <div
                    className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <label htmlFor="visit-date-filter" className="text-sm font-medium text-slate-700 mr-3">
                            Filter tanggal kunjungan
                        </label>
                        <input
                            id="visit-date-filter"
                            type="date"
                            value={selectedDate ?? ""}
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
                        {queues.map(((queue, index) => (
                            <tr key={queue.id} className={rowStyles[queue.status] ?? rowStyles.waiting}>
                                <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-900">
                                    {index + 1}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                    {queue.nama_pasien}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                    {queue.jenis_kelamin}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                    {queue.usia}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                                    {queue.tanggal_kunjungan}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4">
                                        <span
                                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-slate-700">
                                            {queue.kode_referensi}
                                        </span>
                                </td>
                                <td className="border-b border-slate-100 px-4 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {queue.status !== "no_show" && (
                                            <ActionButton
                                                variant={queue.status === "checked_in" ? "accent" : "primary"}
                                                onClick={() => handlePrimaryAction(queue)}
                                            >
                                                {queue.status === "checked_in" ? "Melayani" : "Check-in"}
                                            </ActionButton>
                                        )}

                                        {queue.status !== "checked_in" && queue.status !== "no_show" && (
                                            <ActionButton
                                                variant="secondary"
                                                onClick={() => handleAbsent(queue.id)}
                                            >
                                                Tidak Hadir
                                            </ActionButton>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )))}
                        {queues.length === 0 && (
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
                            <span className="h-3 w-3 rounded-full bg-blue-500"/>
                            <span>Warna biru artinya Sedang Dalam Pemeriksaan</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full bg-red-500"/>
                            <span>Warna merah artinya Tidak Hadir</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full border border-slate-300 bg-white"/>
                            <span>Tanpa warna artinya Dalam Antrian</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
