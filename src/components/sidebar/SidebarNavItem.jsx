import { Link } from "react-router-dom"
import { cn } from "../../lib/utils/cn.js"

export default function SidebarNavItem({ item, active, onNavigate }) {
    const Icon = item.icon

    return (
        <Link
            to={item.link}
            onClick={() => onNavigate(item.key)}
            className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 transition-colors duration-150 text-left",
                active
                    ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-100"
                    : "text-gray-700 dark:text-gray-100"
            )}
        >
            <Icon
                size={16}
                strokeWidth={2}
                className={active ? "text-blue-600 dark:text-blue-100" : "text-gray-400 dark:text-gray-100"}
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
    )
}
