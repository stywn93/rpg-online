export const STAFF_ROLES = ["admin", "staff"]

export function normalizeRole(role) {
    return String(role ?? "").toLowerCase()
}

export function isStaffRole(role) {
    return STAFF_ROLES.includes(normalizeRole(role))
}
