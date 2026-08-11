import { Link } from "react-router-dom"
import { CalendarDays } from "lucide-react"

export default function SidebarLogo() {
    return (
        <Link to="/" className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-300 dark:border-slate-800">
            <div className="w-10 h-10 rounded-[9px] bg-blue-600 flex items-center justify-center shrink-0">
                <CalendarDays color="#ffffff"/>
            </div>
            <div>
                <div className="font-semibold text-[15px] text-gray-900 dark:text-slate-100 tracking-tight leading-tight">
                    RPG
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-100 uppercase tracking-widest">
                    Online
                </div>
            </div>
        </Link>
    )
}
