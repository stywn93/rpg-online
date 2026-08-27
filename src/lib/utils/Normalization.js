//digunakan untuk membuat normalisasi data orang (pasien/orang tua) agar setidaknya mempunyai id dan nama
export function normalizePeopleDetail(payload){
    const source = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : Array.isArray(payload)
                ? payload
                : []

    return source
        .map((item) => ({
            ...item,
            id: String(item?.id ?? ""),
            name: item?.name ?? item?.nama_lengkap ?? item?.nama ?? "",
            gender_code: item?.gender_code ?? item?.jenis_kelamin ?? "",
            age: item?.age ?? item?.usia ?? "",
        }))
        .filter((item) => item.id && item.name)
}

export function normalizeChildren(payload) {
    const source = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : Array.isArray(payload?.patients)
                ? payload.patients
                : Array.isArray(payload)
                    ? payload
                    : []

    return source
        .map((item) => ({
            ...item,
            id: String(item?.id ?? item?.patient_id ?? ""),
        }))
        .filter((item) => item.id)
}

export function normalizeAssessment(payload){
    if (Array.isArray(payload?.data)) {
        return payload.data
    }

    if (Array.isArray(payload)) {
        return payload
    }

    return []
}

export function normalizeQueueItem(item) {
    if (!item || typeof item !== "object") {
        return null
    }

    const queueId = String(item.queue_id ?? item.id ?? item.visit_id ?? "")

    return {
        ...item,
        id: queueId,
        queue_id: queueId,
    }
}

export function normalizeQueueList(payload) {
    const source = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
            ? payload
            : null

    if (!Array.isArray(source)) {
        return null
    }

    return source.map(normalizeQueueItem).filter(Boolean)
}

export function normalizeVisitServiceRowItem(item) {
    if (!item || typeof item !== "object") {
        return null
    }

    const visitServiceId = String(item.visit_service_id ?? item.id ?? "")
    const visitId = String(item.visit_id ?? "")

    if (!visitServiceId && !visitId) {
        return null
    }

    return {
        ...item,
        id: visitServiceId || visitId,
        visit_service_id: visitServiceId,
        visit_id: visitId,
        patient_name: item.patient_name ?? "",
        gender: item.gender ?? item.patient_gender ?? "",
        age: item.age ?? "",
        parent_name: item.parent_name ?? "",
        visit_date: item.visit_date ?? "",
        visit_status: item.visit_status ?? "waiting",
        service_id: String(item.service_id ?? ""),
        service_name: item.service_name ?? "",
        result: item.result ?? item.visit_service_result ?? "",
    }
}

export function normalizeVisitServiceRows(payload) {
    const source = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
            ? payload
            : null

    if (!Array.isArray(source)) {
        return null
    }

    return source.map(normalizeVisitServiceRowItem).filter(Boolean)
}

export function normalizeServiceList(payload) {
    const source = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : Array.isArray(payload)
                ? payload
                : []

    return source
        .map((item) => ({
            id: String(item.service_id ?? ""),
            name: item?.name ?? item?.service_name ?? "",
        }))
        .filter((item) => item.id && item.name)
}

export function normalizePatientList(payload) {
    const source = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : Array.isArray(payload)
                ? payload
                : []

    return source
        .map((item) => ({
            ...item,
            id: String(item?.id ?? ""),
            name: item?.name ?? item?.nama ?? "",
        }))
        .filter((item) => item.id && item.name)
}

export function normalizeUserList(payload) {
    const source = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : Array.isArray(payload)
                ? payload
                : []

    return source
        .map((item) => ({
            ...item,
            id: String(item?.id ?? ""),
            name: item?.name ?? item?.nama ?? "",
        }))
        .filter((item) => item.id && item.name)
}

export function normalizePatientDetail(payload) {
    const item = payload?.data

    if (!item || typeof item !== "object") {
        return null
    }

    return {
        ...item,
        id: String(item?.id ?? ""),
        name: item?.name ?? item?.nama ?? "",
    }
}

export function normalizeVisitServiceList(payload) {
    const source = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : Array.isArray(payload)
                ? payload
                : []

    return source
        .map((item) => ({
            ...item,
            id: String(item?.visit_id ?? item?.id ?? ""),
            services: item?.services ?? "",
        }))
        .filter((item) => item.id)
}

function splitListValue(value) {
    if (Array.isArray(value)) {
        return value
    }

    if (typeof value === "string" && value.trim()) {
        const trimmed = value.trim()

        if (trimmed.startsWith("[")) {
            try {
                const parsed = JSON.parse(trimmed)

                if (Array.isArray(parsed)) {
                    return parsed
                }
            } catch {
                return []
            }
        }

        return trimmed.split(",").map((item) => item.trim()).filter(Boolean)
    }

    return []
}

export function normalizeVisitServiceRecords(payload) {
    const source = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data && typeof payload.data === "object"
            ? [payload.data]
            : Array.isArray(payload)
                ? payload
                : []

    const records = []

    source.forEach((item) => {
        if (Array.isArray(item?.items)) {
            item.items.forEach((record) => {
                records.push({
                    recordId: String(record.id ?? ""),
                    serviceId: String(record.service_id ?? ""),
                    serviceName: record.service_name ?? record.name ?? "",
                    result: record.result ?? "",
                })
            })

            return
        }

        const recordKey = item?.visit_service_id ?? item?.id

        if (recordKey !== undefined && recordKey !== null && String(recordKey) !== "") {
            records.push({
                recordId: String(recordKey),
                serviceId: String(item.service_id ?? ""),
                serviceName: item.service_name ?? item.services ?? item.name ?? "",
                result: item.result ?? "",
            })

            return
        }

        const serviceIds = splitListValue(item?.service_id)
        const serviceNames = splitListValue(item?.services)

        serviceNames.forEach((serviceName, index) => {
            records.push({
                recordId: "",
                serviceId: String(serviceIds[index] ?? ""),
                serviceName: typeof serviceName === "string" ? serviceName : String(serviceName?.name ?? ""),
                result: "",
            })
        })
    })

    return records.filter((record) => record.serviceId || record.serviceName)
}