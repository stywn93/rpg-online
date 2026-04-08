import { useState } from "react"
import { useLocalStorage } from "react-use"
import { AuthContext } from "./AuthContext"

export default function AuthProvider({ children }) {
    const [token, setToken, removeToken] = useLocalStorage("token", "")

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user")

        if (!savedUser || savedUser === "undefined") {
            return null
        }

        try {
            return JSON.parse(savedUser)
        } catch {
            localStorage.removeItem("user")
            return null
        }
    })

    const login = (userData, tokenValue) => {
        console.log("login() received", {userData, tokenValue})
        setToken(tokenValue)
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        removeToken()
        setUser(null)
        localStorage.removeItem("user")
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
