import Topbar from "./components/Topbar"
import BottomNav from "./components/BottomNav"
import Sidebar from "./components/Sidebar"
import { Outlet, useLocation } from "react-router-dom"
import { NAV_ITEMS } from "./components/navConfig"
import useAuth from "./UseAuth.js"

export default function Dashboard(
    {
        activePage,
        onNavigate = () => {
        },
        onNewReservation = () => {
        },
        pageTitle,
    }
) {
    const { user } = useAuth()
    const { pathname } = useLocation();
    const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const currentNavItem = NAV_ITEMS.find((item) => {
        if (!item.link) {
            return false;
        }

        return item.link === "/"
            ? normalizedPath === "/"
            : normalizedPath === item.link || normalizedPath.startsWith(`${item.link}/`);
    });

    const fallbackTitle = normalizedPath === "/"
        ? "Dasboard"
        : normalizedPath
            .split("/")
            .filter(Boolean)
            .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
            .join(" / ");

    const resolvedActivePage = activePage ?? currentNavItem?.key ?? "reservations";
    const resolvedPageTitle = pageTitle ?? currentNavItem?.label ?? fallbackTitle;

    return (

        <div className="flex h-dvh overflow-hidden bg-gray-50 font-sans">
            <Sidebar activeKey={resolvedActivePage} onNavigate={onNavigate} user={user}/>

            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar title={resolvedPageTitle} onNewReservation={onNewReservation}/>
                <main className="flex-1 overflow-y-auto p-5">
                    <Outlet/>
                </main>
                <BottomNav activeKey={resolvedActivePage} onNavigate={onNavigate}/>
            </div>
        </div>
    );
}
