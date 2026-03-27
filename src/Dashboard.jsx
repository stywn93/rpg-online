import Topbar from "./components/Topbar"
import BottomNav from "./components/BottomNav"
import Sidebar from "./components/Sidebar"

export default function Dashboard(
    {
        activePage = "dashboard",
        onNavigate = () => {
        },
        onNewReservation = () => {
        },
        user = {name: "Andi Rahmat", role: "Admin", initials: "AR"},
        pageTitle = "Dasbor",
        children,
    }
) {
    return (

        <div className="flex h-dvh overflow-hidden bg-gray-50 font-sans">
            <Sidebar activeKey={activePage} onNavigate={onNavigate} user={user}/>

            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar title={pageTitle} onNewReservation={onNewReservation}/>
                <main className="flex-1 overflow-y-auto p-5">{children}</main>
                <BottomNav activeKey={activePage} onNavigate={onNavigate}/>
            </div>
        </div>
    );
}
