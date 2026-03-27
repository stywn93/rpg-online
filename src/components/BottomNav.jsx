import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from "./navConfig";

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function BottomNav({activeKey, onNavigate}) {
    return (
        <nav className="md:hidden h-[68px] bg-white border-t border-black/[0.08] shrink-0">
            <div className="flex h-full px-1">
                {BOTTOM_NAV_ITEMS.map((item) => {
                    const active = item.key === activeKey;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.key}
                            onClick={() => onNavigate(item.key)}
                            className={cn(
                                "flex-1 flex flex-col items-center justify-center gap-1.5 relative rounded-xl mx-0.5 my-1.5 transition-colors duration-150",
                                active ? "bg-accent-light" : "hover:bg-gray-50"
                            )}
                        >
                            {/* Badge */}
                            {item.badge && (
                                <span
                                    className="absolute top-1 right-2.5 min-w-[15px] h-[15px] bg-accent text-white text-[9px] font-semibold rounded-full flex items-center justify-center px-1 border-[1.5px] border-white">
                  {item.badge}
                </span>
                            )}
                            <Icon
                                size={18}
                                strokeWidth={2}
                                className={active ? "text-accent" : "text-gray-400"}
                            />
                            <span className={cn(
                                "text-[10px] leading-none whitespace-nowrap",
                                active ? "text-accent font-medium" : "text-gray-400"
                            )}>
                {item.label}
              </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}