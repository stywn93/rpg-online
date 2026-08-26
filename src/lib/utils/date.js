export function getTodayDate() {
    const now = new Date()
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    return local.toISOString().split("T")[0]
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
export function isDateString(v) { return typeof v === "string" && DATE_PATTERN.test(v) }
export function sanitizeStoredDate(value) {
    try { const parsed = JSON.parse(value); return isDateString(parsed) ? parsed : getTodayDate() } catch { return getTodayDate() }
}

export function formatDateForApi(value) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) return ""
    const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000)
    return local.toISOString().split("T")[0]
}

export function calculateAgeParts(dob) {
    if (!(dob instanceof Date) || Number.isNaN(dob.getTime())) return { years: "", months: "" }
    const today = new Date()
    let years = today.getFullYear() - dob.getFullYear()
    let months = today.getMonth() - dob.getMonth()
    if (today.getDate() < dob.getDate()) months -= 1
    if (months < 0) { years -= 1; months += 12 }
    if (years < 0) return { years: "", months: "" }
    return { years: String(years), months: String(months) }
}

export const inputClassName = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
