import {CalendarFold} from "lucide-react"
import {MoreVertical} from "lucide-react"
import {CalendarDays} from 'lucide-react'
import {NAV_ITEMS} from "./navConfig"
import {Link} from "react-router-dom";


function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Sidebar({activeKey, onNavigate, user}) {
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

    return (
        <aside className="hidden md:flex w-60 shrink-0 flex-col bg-white border-r border-black/[0.08]">

            {/* Logo */}
            <Link to={"/"} className="flex items-center gap-2.5 px-5 py-5 border-b border-black/[0.08]">
                <div className="w-10 h-10 rounded-[9px] bg-accent flex items-center justify-center shrink-0">
                    <CalendarDays color="#ffffff"/>
                </div>
                <div>
                    <div className="font-semibold text-[15px] text-gray-900 tracking-tight leading-tight">
                        RPG
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                        Online
                    </div>
                </div>
            </Link>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto px-2.5 py-3">
                {sections.map((sec) => (
                    <div key={sec.label}>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-2.5 pt-2.5 pb-1.5">
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
                                            ? "bg-accent-light text-accent"
                                            : "text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    <Icon
                                        size={16}
                                        strokeWidth={2}
                                        className={active ? "text-accent" : "text-gray-400"}
                                    />
                                    <span className={cn("flex-1 text-sm", active ? "font-medium" : "font-normal")}>
                    {item.label}
                  </span>
                                    {item.badge && (
                                        <span
                                            className="text-[10px] font-medium bg-accent text-white px-1.5 py-0.5 rounded-full leading-none">
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
            <div className="border-t border-black/[0.08] p-2.5">
                <button
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                    <div
                        className="w-8 h-8 rounded-full bg-[#D8EDDE] flex items-center justify-center text-xs font-medium text-accent shrink-0">
                        {user.initials}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-400">{user.role}</p>
                    </div>
                    <MoreVertical size={14} className="text-gray-300 shrink-0"/>
                </button>
            </div>
        </aside>
    );
}