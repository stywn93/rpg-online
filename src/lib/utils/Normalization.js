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
            nama: item?.nama_lengkap ?? item?.nama ?? "",
        }))
        .filter((item) => item.id && item.nama)
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
            id: String(item?.id ?? item?.service_type_id ?? ""),
            name: item?.name ?? item?.nama ?? item?.service_name ?? item?.nama_layanan ?? "",
        }))
        .filter((item) => item.id && item.name)
}