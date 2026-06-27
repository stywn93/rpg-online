import { Check, Download } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { Link, useLocation } from "react-router-dom"
import { formatIndonesianDate } from "../lib/utils/formatIndonesianDate.js"
import { useRef } from "react"
import { toPng } from "html-to-image"

const fallbackReservation = {
    referenceNumber: "RPG9976315",
    queueNumber: "A-17",
    name: "Budi Santoso",
    gender: "Laki-laki",
    age: "3 tahun 10 bulan",
    visitDate: "2026-04-15T09:30:00+07:00",
}

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-6 py-2">
            <span className="text-sm text-slate-400">{label}</span>
            <span className="text-right text-sm font-medium text-slate-700">{value}</span>
        </div>
    )
}

function QueueQrCode({ value }) {
    return (
        <div className="mt-7">
            <div className="flex justify-center rounded-[20px] border border-slate-200 bg-white px-4 py-4">
                <QRCodeSVG
                    value={value}
                    size={160}
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                    level="M"
                    includeMargin={true}
                    title={`QR code reservasi ${value}`}
                />
            </div>
        </div>
    )
}

export default function ConfirmedReservation() {
    const { state } = useLocation()
    const reservation = state?.reservation ?? fallbackReservation
    const cardRef = useRef(null)

    async function handleDownloadImage() {
        try {
            const dataUrl = await toPng(cardRef.current, {
                pixelRatio: 2,
                cacheBust: true,
                filter: (node) => !(node instanceof HTMLElement && node.dataset.exportIgnore !== undefined),
            })
            const link = document.createElement("a")
            link.download = `${reservation.patientId ?? "unknown"}-${reservation.queueId ?? "unknown"}.png`
            link.href = dataUrl
            link.click()
        } catch {
            // Silently fail
        }
    }

    return (
        <section className="flex min-h-full items-center justify-center px-4 py-8 sm:px-6">
            <div ref={cardRef} className="w-full max-w-sm rounded-lg bg-white px-7 py-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-8">
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
                    <InfoRow label="Tanggal Rencana Berkunjung" value={formatIndonesianDate(reservation.visitDate)} />
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

                <QueueQrCode value={reservation.queueId ? String(reservation.queueId) : (reservation.queueNumber ?? "A-17")} />

                <button
                    type="button"
                    onClick={handleDownloadImage}
                    data-export-ignore="true"
                    className="mt-7 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
                >
                    <Download size={18} />
                    Simpan sebagai Gambar
                </button>

                <div data-export-ignore="true" className="mt-7 h-px w-full bg-slate-200" />

                <Link
                    to="/reservation"
                    data-export-ignore="true"
                    className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-4 text-sm font-medium text-white transition hover:bg-blue-800"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </section>
    )
}
