import { Navigate } from "react-router-dom"
import useAuth from "../auth/UseAuth"

export default function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/reservation" replace />
  }

  return children
}
