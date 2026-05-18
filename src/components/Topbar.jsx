import {Bell, Plus} from "lucide-react";
import {Link, useLocation} from "react-router-dom";

export default function Topbar({title, onNewReservation}) {
    const {pathname} = useLocation()
    const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname

    const actionConfig = normalizedPath.startsWith("/reservation")
        ? {
            to: "/reservation/new",
            label: "Buat Rencana Kunjungan",
        }
        : normalizedPath.startsWith("/patients")
            ? {
                to: "/patients/registration",
                label: "Buat Patients Baru",
            }
            : normalizedPath.startsWith("/users")
                ? {
                    to: "/register",
                    label: "Buat Pengguna Baru",
                }
                : null

    return (
        <div
            className="flex items-center justify-between gap-3 px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-200">
            <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{title}</h1>
            <div className="flex items-center gap-2">
                <button
                    aria-label="Notifikasi"
                    className="w-[34px] h-[34px] rounded-lg border border-slate-950 dark:border-slate-50 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-gray-500 dark:text-gray-100 hover:bg-gray-50 transition-colors"
                >
                    <Bell className={"dark:text-slate-50 dark:bg-slate-950"} size={15} strokeWidth={2}/>
                </button>
                {actionConfig && (
                    <Link
                        to={actionConfig.to}
                        onClick={onNewReservation}
                        className="h-[34px] px-3.5 rounded-lg bg-blue-600 dark:bg-blue-100 text-slate-50 dark:text-slate-950 text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-800 transition-colors whitespace-nowrap"
                    >
                        <Plus size={13} strokeWidth={2.5}/>
                        {actionConfig.label}
                    </Link>
                )}
            </div>
        </div>
    );
}
