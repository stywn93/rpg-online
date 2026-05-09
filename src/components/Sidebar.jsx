import {useEffect, useRef, useState} from "react"
import {LogOut, MoreVertical} from "lucide-react"
import {CalendarDays} from 'lucide-react'
import {NAV_ITEMS} from "./navConfig"
import {Link, useNavigate} from "react-router-dom"
import useAuth from "../UseAuth.js"


function getInitials(name) {
    if (!name) {
        return "GU"
    }

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
}

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Sidebar({activeKey, onNavigate, user}) {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const userMenuRef = useRef(null)
    const resolvedUser = {
        name: user?.name ?? "Guest User",
        role: user?.role ?? user?.email ?? "Belum login",
        initials: user?.initials ?? getInitials(user?.name),
    }

    // Kelompokkan item berdasarkan section
    const sections = [];
    let current = null;
    NAV_ITEMS.forEach((item) => {
        if (item.section) {
            current = {label: item.section, items: [item]};
            sections.push(current);
        } else if (current) {
            current.items.push(item);
        }
    });

    const handleLogout = () => {
        setIsUserMenuOpen(false)
        logout()
        navigate("/login", { replace: true })
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!userMenuRef.current?.contains(event.target)) {
                setIsUserMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <aside className="hidden md:flex w-60 shrink-0 flex-col bg-slate-50 dark:bg-slate-950 border-r border-slate-300 dark:border-slate-100">

            {/* Logo */}
            <Link to={"/"} className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-300 dark:border-slate-800">
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

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto px-2.5 py-3">
                {sections.map((sec) => (
                    <div key={sec.label}>
                        <p className="text-[10px] font-medium text-gray-400 dark:text-gray-100 uppercase tracking-widest px-2.5 pt-2.5 pb-1.5">
                            {sec.label}
                        </p>
                        {sec.items.map((item) => {
                            const active = item.key === activeKey;
                            const Icon = item.icon;
                            return (
                                <Link
                                    to={item.link}
                                    key={item.key}
                                    onClick={() => onNavigate(item.key)}
                                    className={cn(
                                        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 transition-colors duration-150 text-left",
                                        active
                                            ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-100"
                                            : "text-gray-700 dark:text-gray-100 hover:bg-gray-50"
                                    )}
                                >
                                    <Icon
                                        size={16}
                                        strokeWidth={2}
                                        className={active ? "text-blue-600 dark:text-blue-100" : "text-gray-400 dark-text-gray-100"}
                                    />
                                    <span className={cn("flex-1 text-sm", active ? "font-medium" : "font-normal")}>
                    {item.label}
                  </span>
                                    {item.badge && (
                                        <span
                                            className="text-[10px] font-medium bg-fuchsia-500 dark:bg-fuchsia-950 text-slate-50 px-1.5 py-0.5 rounded-full leading-none">
                      {item.badge}
                    </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Footer: user profile */}
            <div ref={userMenuRef} className="cursor-pointer relative border-t border-slate-300 dark:border-slate-800 p-2.5">
                <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((current) => !current)}
                    className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150">
                    <div
                        className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-50 shrink-0">
                        {resolvedUser.initials}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">{resolvedUser.name}</p>
                        <p className="text-[11px] text-gray-400">{resolvedUser.role}</p>
                    </div>
                    <MoreVertical size={14} className="text-gray-300 shrink-0"/>
                </button>
                {isUserMenuOpen && (
                    <div className="cursor-pointer absolute bottom-[calc(100%-0.25rem)] left-2.5 right-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1 shadow-lg">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="cursor-pointer flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-red-600 dark:text-red-50 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-900"
                        >
                            <LogOut size={16} className="shrink-0" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
