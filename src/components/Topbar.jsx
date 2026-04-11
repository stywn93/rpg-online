import { Bell, Plus, MoreVertical } from "lucide-react";
import {Link} from "react-router-dom";

export default function Topbar({ title, onNewReservation }) {
    return (
        <div className="flex items-center justify-between gap-3 px-5 py-4 bg-white border-b border-black/[0.08]">
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">{title}</h1>
            <div className="flex items-center gap-2">
                <button
                    aria-label="Notifikasi"
                    className="w-[34px] h-[34px] rounded-lg border border-black/[0.12] bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    <Bell size={15} strokeWidth={2} />
                </button>
                <Link to={"reservation/new"}
                    onClick={onNewReservation}
                    className="h-[34px] px-3.5 rounded-lg bg-blue-600 text-white text-[13px] font-medium flex items-center gap-1.5 hover:bg-blue-800 transition-colors whitespace-nowrap"
                >
                    <Plus size={13} strokeWidth={2.5} />
                    Buat Rencana Kunjungan
                </Link>
            </div>
        </div>
    );
}