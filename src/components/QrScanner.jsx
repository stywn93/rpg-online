import { useEffect, useRef, useState, useCallback } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { X, Scan, CameraOff, Loader } from "lucide-react"
import toast from "react-hot-toast"

export default function QrScanner({ isOpen, onClose, onScan }) {
    const [status, setStatus] = useState("idle")
    const scannerRef = useRef(null)
    const containerRef = useRef(null)

    const stopScanner = useCallback(async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop()
            } catch {
            }
            scannerRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!isOpen) {
            stopScanner()
            setStatus("idle")
            return
        }

        let cancelled = false

        async function init() {
            setStatus("starting")

            try {
                const scanner = new Html5Qrcode("qr-scanner-container")
                scannerRef.current = scanner

                await scanner.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    async (decodedText) => {
                        if (cancelled) return

                        await stopScanner()
                        if (cancelled) return

                        setStatus("idle")
                        onScan(decodedText)
                        if (!cancelled) {
                            onClose()
                        }
                    },
                    () => {}
                )

                if (!cancelled) {
                    setStatus("scanning")
                }
            } catch (error) {
                if (cancelled) return

                console.error("QR Scanner error:", error)
                setStatus("error")

                const msg = error.toString()
                if (msg.includes("NotAllowedError") || msg.includes("Permission")) {
                    toast.error("Izin kamera ditolak. Izinkan akses kamera di pengaturan browser.")
                } else if (msg.includes("NotFoundError")) {
                    toast.error("Kamera tidak ditemukan pada perangkat ini.")
                } else {
                    toast.error("Gagal memulai kamera. Coba lagi.")
                }
            }
        }

        const timer = setTimeout(init, 300)

        return () => {
            cancelled = true
            clearTimeout(timer)
            stopScanner()
        }
    }, [isOpen, onScan, onClose, stopScanner])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                >
                    <X size={18} />
                </button>

                <div className="mb-4 text-center">
                    <h3 className="text-lg font-semibold text-slate-900">Scan QR Code</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Arahkan kamera ke QR code pasien
                    </p>
                </div>

                <div className="relative overflow-hidden rounded-xl bg-black">
                    <div id="qr-scanner-container" ref={containerRef} className="min-h-[280px] w-full" />

                    {status === "starting" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
                            <Loader size={32} className="animate-spin" />
                            <p className="mt-3 text-sm">Mengaktifkan kamera...</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
                            <CameraOff size={32} />
                            <p className="mt-3 text-sm">Kamera tidak tersedia</p>
                        </div>
                    )}
                </div>

                {status === "scanning" && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-600">
                        <Scan size={16} />
                        <span>Kamera aktif, menunggu QR code...</span>
                    </div>
                )}
            </div>
        </div>
    )
}
