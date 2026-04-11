import { Check } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const fallbackReservation = {
    referenceNumber: "RPG9976315",
    queueNumber: "A-17",
    name: "Budi Santoso",
    gender: "Laki-laki",
    age: "3 tahun 10 bulan",
    visitDate: "2026-04-15T09:30:00+07:00",
}

function formatVisitDate(value) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(value))
}

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-6 py-2">
            <span className="text-sm text-slate-400">{label}</span>
            <span className="text-right text-sm font-medium text-slate-700">{value}</span>
        </div>
    )
}

function Barcode({ value }) {
    const pattern = value
        .split("")
        .flatMap((char, index) => {
            const seed = char.charCodeAt(0) + index * 17

            return seed
                .toString(2)
                .padStart(8, "0")
                .split("")
                .map((bit, bitIndex) => ({
                    key: `${char}-${index}-${bitIndex}`,
                    width: bit === "1" ? 3 : 1.4,
                    fill: bit === "1" ? "#0f172a" : "transparent",
                }))
        })

    let offset = 12
    const bars = pattern.map((bar) => {
        const x = offset
        offset += bar.width + 1.2

        return {
            ...bar,
            x,
        }
    })

    const viewBoxWidth = offset + 12

    return (
        <div className="mt-7">
            <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4">
                <svg
                    viewBox={`0 0 ${viewBoxWidth} 92`}
                    className="h-20 w-full"
                    role="img"
                    aria-label={`Barcode nomor referensi ${value}`}
                    preserveAspectRatio="none"
                >
                    <rect x="0" y="0" width={viewBoxWidth} height="92" fill="#ffffff" />
                    {bars.map((bar) => (
                        <rect key={bar.key} x={bar.x} y="8" width={bar.width} height="62" fill={bar.fill} />
                    ))}
                    <text
                        x={viewBoxWidth / 2}
                        y="84"
                        textAnchor="middle"
                        fontSize="11"
                        letterSpacing="2"
                        fill="#475569"
                    >
                        {value}
                    </text>
                </svg>
            </div>
        </div>
    )
}

export default function HasilReservasi() {
    const { state } = useLocation()
    const reservation = state?.reservation ?? fallbackReservation

    return (
        <section className="flex min-h-full items-center justify-center px-4 py-8 sm:px-6">
            <div className="w-full max-w-sm rounded-lg bg-white px-7 py-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-8">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-fuchsia-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fuchsia-500 text-white shadow-[0_12px_24px_rgba(111,134,255,0.35)]">
                        <Check size={30} strokeWidth={3} />
                    </div>
                </div>

                <h1 className="mt-8 text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-slate-900">
                    Sukses! Reservasi Anda terdaftar.
                </h1>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                    Silakan simpan detail konfirmasi ini untuk kebutuhan check-in saat kunjungan.
                </p>

                <div className="mt-8 rounded-[22px] bg-[#f8f9fc] px-5 py-4 text-left">
                    <InfoRow label="Nama" value={reservation.name} />
                    <InfoRow label="Jenis Kelamin" value={reservation.gender} />
                    <InfoRow label="Usia" value={reservation.age} />
                    <InfoRow label="Tanggal Rencana Berkunjung" value={formatVisitDate(reservation.visitDate)} />
                    <InfoRow label="Nomor Referensi" value={reservation.referenceNumber} />
                </div>

                <div className="mt-8">
                    <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                        Nomor Antrean
                    </p>
                    <h1 className="mt-2 text-4xl font-semibold tracking-[0.08em] text-slate-900">
                        {reservation.queueNumber ?? "A-17"}
                    </h1>
                </div>

                <Barcode value={reservation.referenceNumber} />

                <div className="mt-8 h-px w-full bg-slate-200" />

                <Link
                    to="/"
                    className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-4 text-sm font-medium text-white transition hover:bg-blue-800"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </section>
    )
}
