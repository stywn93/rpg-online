import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../../auth/UseAuth.js"
import { getInitials } from "../utils/initials.js"

export function useSidebar(user) {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const userMenuRef = useRef(null)

    const resolvedUser = {
        name: user?.name ?? "Guest User",
        role: user?.role ?? user?.email ?? "Belum login",
        initials: user?.initials ?? getInitials(user?.name),
    }

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

    return { resolvedUser, isUserMenuOpen, setIsUserMenuOpen, userMenuRef, handleLogout }
}
