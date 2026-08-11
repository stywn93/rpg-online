import { LogOut, MoreVertical, KeyRound } from "lucide-react"

export default function SidebarUserMenu({ user, isUserMenuOpen, setIsUserMenuOpen, userMenuRef, onLogout }) {
    return (
        <div ref={userMenuRef} className="cursor-pointer relative border-t border-slate-300 dark:border-slate-800 p-2.5">
            <button
                type="button"
                onClick={() => setIsUserMenuOpen((current) => !current)}
                className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150"
            >
                <div
                    className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-50 shrink-0">
                    {user.initials}
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400">{user.role}</p>
                </div>
                <MoreVertical size={14} className="text-gray-300 shrink-0"/>
            </button>
            {isUserMenuOpen && (
                <div className="cursor-pointer absolute bottom-[calc(100%-0.25rem)] left-2.5 right-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1 shadow-lg">
                    <button
                        type="button"
                        className="cursor-pointer flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-50 transition-colors duration-150 hover:bg-blue-50 dark:hover:bg-blue-900"
                    >
                        <KeyRound size={16} className="shrink-0"/>
                        <span>Ganti Password</span>
                    </button>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="cursor-pointer flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-red-600 dark:text-red-50 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                        <LogOut size={16} className="shrink-0"/>
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    )
}
