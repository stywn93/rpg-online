import { useSidebar } from "../../lib/hooks/useSidebar.js"
import SidebarLogo from "./SidebarLogo"
import SidebarNav from "./SidebarNav"
import SidebarUserMenu from "./SidebarUserMenu"

export default function Sidebar({ activeKey, onNavigate, user }) {
    const { resolvedUser, isUserMenuOpen, setIsUserMenuOpen, userMenuRef, handleLogout } = useSidebar(user)

    return (
        <aside className="hidden md:flex w-60 shrink-0 flex-col bg-slate-50 dark:bg-slate-950 border-r border-slate-300 dark:border-slate-800">
            <SidebarLogo/>
            <SidebarNav activeKey={activeKey} onNavigate={onNavigate} role={user?.role}/>
            <SidebarUserMenu
                user={resolvedUser}
                isUserMenuOpen={isUserMenuOpen}
                setIsUserMenuOpen={setIsUserMenuOpen}
                userMenuRef={userMenuRef}
                onLogout={handleLogout}
            />
        </aside>
    )
}
