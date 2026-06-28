export const ROLES = {
  ADMIN: "admin",
  USER: "user",
}

export const NAV_ACCESS = {
  reservation: [ROLES.ADMIN, ROLES.USER],
  patients: [ROLES.ADMIN, ROLES.USER],
  users: [ROLES.ADMIN],
  services: [ROLES.ADMIN],
}

export function isAdmin(user) {
  return user?.role === ROLES.ADMIN
}

export function isUser(user) {
  return user?.role === ROLES.USER
}

export function canAccessNavItem(user, itemKey) {
  const roles = NAV_ACCESS[itemKey]
  if (!roles) return false
  return roles.includes(user?.role)
}

export function filterNavItemsByRole(user, items) {
  return items.filter((item) => canAccessNavItem(user, item.key))
}

export function canAccessRoute(user, path) {
  const adminRoutes = ["/users", "/services"]
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))
  if (isAdminRoute) return isAdmin(user)
  return !!user
}
