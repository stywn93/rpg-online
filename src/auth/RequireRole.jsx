import { useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import toast from "react-hot-toast"
import useAuth from "./UseAuth.js"
import { normalizeRole } from "../lib/utils/roles.js"

function AccessDenied() {
    useEffect(() => {
        toast.error("Akses ditolak.")
    }, [])

    return <Navigate to="/reservation" replace/>
}

export default function RequireRole({ roles, children }) {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace/>
    }

    if (roles && !roles.includes(normalizeRole(user.role))) {
        return <AccessDenied/>
    }

    return children ?? <Outlet/>
}
