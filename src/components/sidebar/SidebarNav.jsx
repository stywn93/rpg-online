import { NAV_SECTIONS } from "../navConfig"
import SidebarNavItem from "./SidebarNavItem"

export default function SidebarNav({ activeKey, onNavigate }) {
    return (
        <nav className="flex-1 overflow-y-auto px-2.5 py-3">
            {NAV_SECTIONS.map((section) => (
                <div key={section.label}>
                    <p className="text-[10px] font-medium text-gray-400 dark:text-gray-100 uppercase tracking-widest px-2.5 pt-2.5 pb-1.5">
                        {section.label}
                    </p>
                    {section.items.map((item) => (
                        <SidebarNavItem
                            key={item.key}
                            item={item}
                            active={item.key === activeKey}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            ))}
        </nav>
    )
}
